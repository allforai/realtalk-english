#!/usr/bin/env python3
"""Generate feature-prune analysis: frequency-tier, scenario-alignment,
competitive-ref, prune-decisions, prune-tasks, and prune-report."""

import json, os, datetime

BASE = "/home/hello/Documents/myskills/.allforai"
OUT = os.path.join(BASE, "feature-prune")
os.makedirs(OUT, exist_ok=True)

NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ── Load data ──────────────────────────────────────────────────────────────
with open(os.path.join(BASE, "product-map/task-inventory.json")) as f:
    inv = json.load(f)
tasks = {t["id"]: t for t in inv["tasks"]}

with open(os.path.join(BASE, "product-map/task-index.json")) as f:
    tidx = json.load(f)

with open(os.path.join(BASE, "product-map/role-profiles.json")) as f:
    roles = json.load(f)
role_map = {r["id"]: r["name"] for r in roles["roles"]}

# Load pipeline preferences for scope_strategy and competitors
with open(os.path.join(BASE, "product-concept/product-concept.json")) as f:
    concept = json.load(f)
prefs = concept.get("pipeline_preferences", {})
scope_strategy = prefs.get("scope_strategy", "balanced")
competitors = prefs.get("competitors", [])

# Load screen-map for scenario alignment
screens = []
task_screen_map = {}
try:
    with open(os.path.join(BASE, "screen-map/screen-map.json")) as f:
        sm = json.load(f)
    screens = sm.get("screens", [])
    for s in screens:
        for tid in s.get("tasks", s.get("task_refs", [])):
            task_screen_map.setdefault(tid, []).append(s)
except FileNotFoundError:
    pass

# Load business flows for CUT safety check
flows = []
flow_task_refs = set()
try:
    with open(os.path.join(BASE, "product-map/business-flows.json")) as f:
        fd = json.load(f)
    flows = fd.get("flows", [])
    for flow in flows:
        for step in flow.get("steps", []):
            if isinstance(step, str):
                flow_task_refs.add(step)
            elif isinstance(step, dict):
                flow_task_refs.add(step.get("task_ref", ""))
except FileNotFoundError:
    pass

# ── Step 1: Frequency tier ────────────────────────────────────────────────
freq_tier = []
for tid, task in tasks.items():
    freq = task.get("frequency", "低")
    if freq == "高":
        tier = "protected"
    elif freq == "低":
        tier = "candidate"
    else:
        tier = "review"
    freq_tier.append({
        "task_id": tid,
        "task_name": task["task_name"],
        "frequency": freq,
        "tier": tier,
        "data_points": f"frequency={freq}, risk={task.get('risk_level', '低')}"
    })

with open(os.path.join(OUT, "frequency-tier.json"), "w", encoding="utf-8") as f:
    json.dump(freq_tier, f, ensure_ascii=False, indent=2)

# ── Step 2: Scenario alignment ────────────────────────────────────────────
scenario_align = []
for ft in freq_tier:
    if ft["tier"] == "protected":
        continue  # Skip high-frequency protected tasks

    tid = ft["task_id"]
    task = tasks[tid]

    # Question A: Core scenario?
    screens_for_task = task_screen_map.get(tid, [])
    if screens_for_task:
        # Check if task appears in high-freq actions
        is_high_freq_action = False
        for s in screens_for_task:
            for a in s.get("actions", []):
                if a.get("task_ref") == tid and a.get("frequency") == "高":
                    is_high_freq_action = True
                    break
        question_a = "core" if is_high_freq_action else "secondary"
    else:
        question_a = "none"

    # Question B: Complexity vs frequency match
    main_flow = task.get("main_flow", [])
    rules = task.get("rules", [])
    exceptions = task.get("exceptions", [])
    complexity = "high" if (len(main_flow) >= 5 or len(rules) >= 3 or len(exceptions) >= 3) else (
        "low" if (len(main_flow) <= 2 and len(rules) <= 1) else "medium"
    )
    freq = ft["frequency"]
    if freq == "低" and complexity in ("high", "medium"):
        question_b = "over_engineered"
    elif freq == "低" and complexity == "low":
        question_b = "match"
    elif freq == "中" and complexity == "high":
        question_b = "over_engineered"
    else:
        question_b = "match"

    # Question C: Cross-department dependency
    question_c = "standalone"

    # Preliminary decision based on scope_strategy
    if scope_strategy == "aggressive":
        if freq == "高":
            prelim = "CORE"
        elif freq == "中" and question_a == "core":
            prelim = "CORE"
        elif freq == "中" and question_a != "core":
            prelim = "DEFER"
        elif freq == "低" and tid in flow_task_refs:
            prelim = "DEFER"  # Don't CUT flow-referenced tasks
        elif freq == "低":
            prelim = "CUT"
        else:
            prelim = "DEFER"
    elif scope_strategy == "balanced":
        if freq == "高":
            prelim = "CORE"
        elif freq == "中":
            prelim = "CORE"
        elif freq == "低" and question_a == "core":
            prelim = "DEFER"
        else:
            prelim = "CUT"
    else:  # conservative
        if freq == "高":
            prelim = "CORE"
        elif freq == "中":
            prelim = "CORE"
        elif freq == "低" and question_a == "core":
            prelim = "CORE"
        else:
            prelim = "DEFER"

    reason_parts = []
    reason_parts.append(f"频次={freq}")
    reason_parts.append(f"场景={question_a}")
    reason_parts.append(f"复杂度匹配={question_b}")
    if tid in flow_task_refs:
        reason_parts.append("被业务流引用")
    reason_parts.append(f"策略={scope_strategy}")

    scenario_align.append({
        "task_id": tid,
        "task_name": task["task_name"],
        "tier": ft["tier"],
        "question_a": question_a,
        "question_b": question_b,
        "question_c": question_c,
        "preliminary_decision": prelim,
        "reason": "；".join(reason_parts)
    })

with open(os.path.join(OUT, "scenario-alignment.json"), "w", encoding="utf-8") as f:
    json.dump(scenario_align, f, ensure_ascii=False, indent=2)

# ── Step 3: Competitive reference ─────────────────────────────────────────
# In auto mode, use predefined competitors from pipeline_preferences
comp_ref = {
    "competitors": competitors,
    "analysis_date": NOW[:10],
    "note": "全自动模式 — 竞品覆盖为估算值，基于产品类型（AI口语练习App）",
    "features": []
}

# Rough competitive coverage based on common features in AI language learning apps
core_features_competitors_have = {
    "浏览并选择场景", "进行场景对话", "查看对话报告", "查看实时发音纠正",
    "完成记忆曲线复习", "登录账户", "注册账户", "查看个性化推荐",
    "订阅付费方案"
}
some_features = {
    "进行自由对话", "查看发音详细报告", "管理词汇本", "查看学习连胜与成就",
    "查看排行榜", "管理个人设置", "查看学习统计报告", "管理通知中心"
}

for tid, task in tasks.items():
    tname = task["task_name"]
    if tname in core_features_competitors_have:
        coverage = "all_have"
    elif tname in some_features:
        coverage = "some_have"
    else:
        coverage = "none_have"
    comp_ref["features"].append({
        "task_id": tid,
        "task_name": tname,
        "competitor_coverage": coverage,
        "notes": ""
    })

with open(os.path.join(OUT, "competitive-ref.json"), "w", encoding="utf-8") as f:
    json.dump(comp_ref, f, ensure_ascii=False, indent=2)

# ── Step 4: Classification decisions ──────────────────────────────────────
decisions = []

# Protected tasks = CORE
for ft in freq_tier:
    if ft["tier"] == "protected":
        decisions.append({
            "step": "Step 4",
            "item_id": ft["task_id"],
            "item_name": ft["task_name"],
            "decision": "CORE",
            "reason": f"高频受保护（frequency=高）— 策略={scope_strategy}",
            "decided_at": NOW
        })

# Candidate/review tasks = from scenario alignment
for sa in scenario_align:
    decisions.append({
        "step": "Step 4",
        "item_id": sa["task_id"],
        "item_name": sa["task_name"],
        "decision": sa["preliminary_decision"],
        "reason": sa["reason"],
        "decided_at": NOW
    })

with open(os.path.join(OUT, "prune-decisions.json"), "w", encoding="utf-8") as f:
    json.dump(decisions, f, ensure_ascii=False, indent=2)

# ── Step 5: Generate prune tasks ──────────────────────────────────────────
prune_tasks = []
prune_counter = 0

for d in decisions:
    if d["decision"] in ("DEFER", "CUT"):
        prune_counter += 1
        tid = d["item_id"]
        task = tasks.get(tid, {})
        sids = [s["id"] for s in task_screen_map.get(tid, [])]

        if d["decision"] == "DEFER":
            action = "从当前迭代移除，迁移到 backlog，3个月后重新评估"
            risk = "低"
        else:
            action = "标记移除，通知开发团队清理相关代码和界面"
            risk = "中" if tid in flow_task_refs else "低"

        prune_tasks.append({
            "id": f"PRUNE-{prune_counter:03d}",
            "title": f"{task.get('task_name', tid)} → {d['decision']}",
            "decision": d["decision"],
            "affected_tasks": [tid],
            "affected_screens": sids,
            "reason": d["reason"],
            "action": action,
            "risk": risk
        })

with open(os.path.join(OUT, "prune-tasks.json"), "w", encoding="utf-8") as f:
    json.dump(prune_tasks, f, ensure_ascii=False, indent=2)

# ── Statistics ─────────────────────────────────────────────────────────────
core_count = sum(1 for d in decisions if d["decision"] == "CORE")
defer_count = sum(1 for d in decisions if d["decision"] == "DEFER")
cut_count = sum(1 for d in decisions if d["decision"] == "CUT")

# ── Markdown report ────────────────────────────────────────────────────────
lines = []
lines.append("# 功能剪枝报告\n")
lines.append(f"策略: {scope_strategy}\n")
lines.append("## 总览\n")
lines.append("| 分类 | 数量 |")
lines.append("|------|------|")
lines.append(f"| CORE（必须保留）| {core_count} |")
lines.append(f"| DEFER（推迟）| {defer_count} |")
lines.append(f"| CUT（移除）| {cut_count} |")

if cut_count > 0:
    lines.append("\n## CUT 清单\n")
    lines.append("| 任务 | 频次 | 场景 | 理由 |")
    lines.append("|------|------|------|------|")
    for d in decisions:
        if d["decision"] == "CUT":
            tid = d["item_id"]
            task = tasks.get(tid, {})
            lines.append(f"| {d['item_name']} | {task.get('frequency', '-')} | {d['reason'][:40]} | {d['reason']} |")

if defer_count > 0:
    lines.append("\n## DEFER 清单\n")
    lines.append("| 任务 | 频次 | 理由 | 建议重评时间 |")
    lines.append("|------|------|------|-------------|")
    for d in decisions:
        if d["decision"] == "DEFER":
            tid = d["item_id"]
            task = tasks.get(tid, {})
            lines.append(f"| {d['item_name']} | {task.get('frequency', '-')} | {d['reason']} | 3个月后 |")

lines.append("\n## CORE 清单\n")
lines.append("| 任务 | 频次 | 理由 |")
lines.append("|------|------|------|")
for d in decisions:
    if d["decision"] == "CORE":
        tid = d["item_id"]
        task = tasks.get(tid, {})
        lines.append(f"| {d['item_name']} | {task.get('frequency', '-')} | {d['reason'][:60]} |")

with open(os.path.join(OUT, "prune-report.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

# ── Pipeline decisions ─────────────────────────────────────────────────────
pipe_path = os.path.join(BASE, "pipeline-decisions.json")
pipe = []
if os.path.exists(pipe_path):
    with open(pipe_path) as f:
        pipe = json.load(f)
pipe.append({
    "phase": "Phase 6 — feature-prune",
    "decision": "auto_confirmed",
    "detail": f"strategy={scope_strategy}, CORE={core_count}, DEFER={defer_count}, CUT={cut_count}",
    "decided_at": NOW
})
with open(pipe_path, "w", encoding="utf-8") as f:
    json.dump(pipe, f, ensure_ascii=False, indent=2)

# ── Summary ────────────────────────────────────────────────────────────────
print(f"Strategy: {scope_strategy}")
print(f"CORE: {core_count}")
print(f"DEFER: {defer_count}")
print(f"CUT: {cut_count}")
print(f"Prune tasks: {len(prune_tasks)}")
print(f"Competitors: {competitors}")
print(f"\nAll files written to {OUT}/")
