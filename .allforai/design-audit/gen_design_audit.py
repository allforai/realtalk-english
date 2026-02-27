#!/usr/bin/env python3
"""Generate design audit: trace, coverage, cross-check, fidelity, and report."""

import json, os, datetime

BASE = "/home/hello/Documents/myskills/.allforai"
OUT = os.path.join(BASE, "design-audit")
os.makedirs(OUT, exist_ok=True)

NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ── Layer detection ────────────────────────────────────────────────────────
def load_json(path):
    try:
        with open(os.path.join(BASE, path)) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None

available_layers = []

# product-map (required)
pm = load_json("product-map/product-map.json")
if not pm:
    print("ERROR: product-map.json not found")
    exit(1)
available_layers.append("product-map")

inv = load_json("product-map/task-inventory.json")
tasks = {t["id"]: t for t in inv["tasks"]} if inv else {}
task_ids = set(tasks.keys())

# screen-map (optional)
sm = load_json("screen-map/screen-map.json")
screens = {}
screen_task_map = {}  # screen_id -> [task_ids]
task_screen_map = {}  # task_id -> [screen_ids]
if sm:
    available_layers.append("screen-map")
    for s in sm.get("screens", []):
        sid = s["id"]
        screens[sid] = s
        trefs = s.get("tasks", s.get("task_refs", []))
        screen_task_map[sid] = trefs
        for tid in trefs:
            task_screen_map.setdefault(tid, []).append(sid)

# use-case (optional)
uc = load_json("use-case/use-case-tree.json")
uc_task_map = {}  # task_id -> [use_case_ids]
uc_screen_refs = {}  # uc_id -> screen_ref
if uc:
    available_layers.append("use-case")
    for role in uc.get("roles", []):
        for fa in role.get("feature_areas", []):
            for t_data in fa.get("tasks", []):
                tid = t_data["id"]
                for ucase in t_data.get("use_cases", []):
                    uc_task_map.setdefault(tid, []).append(ucase["id"])
                    if ucase.get("screen_ref"):
                        uc_screen_refs[ucase["id"]] = ucase["screen_ref"]

# feature-gap (optional)
gap = load_json("feature-gap/gap-tasks.json")
gap_task_ids = set()
if gap:
    available_layers.append("feature-gap")
    for g in gap:
        for tid in g.get("affected_tasks", []):
            gap_task_ids.add(tid)

# Also load task-gaps for per-task check
task_gaps_data = load_json("feature-gap/task-gaps.json")
gap_checked_tasks = set()
if task_gaps_data:
    for tg in task_gaps_data:
        gap_checked_tasks.add(tg["task_id"])

# feature-prune (optional)
prune = load_json("feature-prune/prune-decisions.json")
prune_map = {}  # task_id -> decision
if prune:
    available_layers.append("feature-prune")
    for d in prune:
        prune_map[d["item_id"]] = d["decision"]

# ui-design (optional)
ui_spec_path = os.path.join(BASE, "ui-design/ui-design-spec.md")
ui_spec_text = ""
if os.path.exists(ui_spec_path):
    available_layers.append("ui-design")
    with open(ui_spec_path) as f:
        ui_spec_text = f.read()

print(f"Available layers: {available_layers}")

# ── Step 1: Trace (reverse) ───────────────────────────────────────────────
trace_issues = []
trace_total = 0
trace_pass = 0

# T1: screen -> task
if "screen-map" in available_layers:
    for sid, trefs in screen_task_map.items():
        for tid in trefs:
            trace_total += 1
            if tid not in task_ids:
                trace_issues.append({
                    "check_id": "T1",
                    "type": "ORPHAN",
                    "source": "screen-map",
                    "item_id": sid,
                    "item_name": screens[sid].get("name", ""),
                    "missing_ref": tid,
                    "detail": f"screen {sid} 引用了不存在的 task {tid}"
                })
            else:
                trace_pass += 1

# T2: use-case -> task
if "use-case" in available_layers:
    for tid, uids in uc_task_map.items():
        trace_total += 1
        if tid not in task_ids:
            trace_issues.append({
                "check_id": "T2",
                "type": "ORPHAN",
                "source": "use-case",
                "item_id": uids[0] if uids else "?",
                "item_name": f"use-case for {tid}",
                "missing_ref": tid,
                "detail": f"use-case 引用了不存在的 task {tid}"
            })
        else:
            trace_pass += 1

# T3: use-case screen_ref -> screen-map
if "use-case" in available_layers and "screen-map" in available_layers:
    for ucid, sref in uc_screen_refs.items():
        trace_total += 1
        if sref and sref not in screens:
            trace_issues.append({
                "check_id": "T3",
                "type": "ORPHAN",
                "source": "use-case",
                "item_id": ucid,
                "item_name": f"use-case {ucid}",
                "missing_ref": sref,
                "detail": f"use-case {ucid} 的 screen_ref {sref} 在 screen-map 中不存在"
            })
        else:
            trace_pass += 1

# T5: prune-decision -> task
if "feature-prune" in available_layers:
    for tid in prune_map:
        trace_total += 1
        if tid not in task_ids:
            trace_issues.append({
                "check_id": "T5",
                "type": "ORPHAN",
                "source": "feature-prune",
                "item_id": tid,
                "item_name": f"prune decision for {tid}",
                "missing_ref": tid,
                "detail": f"prune 决策引用了不存在的 task {tid}"
            })
        else:
            trace_pass += 1

# ── Step 2: Coverage (flood) ──────────────────────────────────────────────
coverage_issues = []
coverage_total = 0
coverage_covered = 0

for tid in task_ids:
    # C1: task -> screen
    if "screen-map" in available_layers:
        coverage_total += 1
        if tid in task_screen_map:
            coverage_covered += 1
        else:
            coverage_issues.append({
                "check_id": "C1",
                "type": "GAP",
                "task_id": tid,
                "task_name": tasks[tid]["task_name"],
                "missing_in": "screen-map",
                "detail": f"任务 {tid} ({tasks[tid]['task_name']}) 在 screen-map 中无对应界面"
            })

    # C2: task -> use-case
    if "use-case" in available_layers:
        coverage_total += 1
        if tid in uc_task_map:
            coverage_covered += 1
        else:
            coverage_issues.append({
                "check_id": "C2",
                "type": "GAP",
                "task_id": tid,
                "task_name": tasks[tid]["task_name"],
                "missing_in": "use-case",
                "detail": f"任务 {tid} ({tasks[tid]['task_name']}) 无对应用例"
            })

    # C3: task -> gap-checked
    if "feature-gap" in available_layers:
        coverage_total += 1
        if tid in gap_checked_tasks:
            coverage_covered += 1
        else:
            coverage_issues.append({
                "check_id": "C3",
                "type": "GAP",
                "task_id": tid,
                "task_name": tasks[tid]["task_name"],
                "missing_in": "feature-gap",
                "detail": f"任务 {tid} ({tasks[tid]['task_name']}) 未被 feature-gap 检查"
            })

    # C4: task -> prune-decided
    if "feature-prune" in available_layers:
        coverage_total += 1
        if tid in prune_map:
            coverage_covered += 1
        else:
            coverage_issues.append({
                "check_id": "C4",
                "type": "GAP",
                "task_id": tid,
                "task_name": tasks[tid]["task_name"],
                "missing_in": "feature-prune",
                "detail": f"任务 {tid} ({tasks[tid]['task_name']}) 无 prune 决策"
            })

coverage_rate = f"{coverage_covered / coverage_total * 100:.0f}%" if coverage_total > 0 else "N/A"

# ── Step 3: Cross-check ───────────────────────────────────────────────────
cross_issues = []
cross_total = 0
cross_ok = 0

# X1: gap x prune conflict
if "feature-gap" in available_layers and "feature-prune" in available_layers:
    for tid in gap_task_ids:
        if tid in prune_map:
            cross_total += 1
            if prune_map[tid] == "CUT":
                cross_issues.append({
                    "check_id": "X1",
                    "type": "CONFLICT",
                    "task_id": tid,
                    "task_name": tasks.get(tid, {}).get("task_name", "?"),
                    "detail": f"feature-gap 报 {tid} 有缺口，但 feature-prune 标为 CUT — 矛盾"
                })
            else:
                cross_ok += 1

# X2: ui-design x prune CUT
if "ui-design" in available_layers and "feature-prune" in available_layers:
    for tid, decision in prune_map.items():
        if decision == "CUT":
            cross_total += 1
            tname = tasks.get(tid, {}).get("task_name", "")
            if tname and tname in ui_spec_text:
                cross_issues.append({
                    "check_id": "X2",
                    "type": "CONFLICT",
                    "task_id": tid,
                    "task_name": tname,
                    "detail": f"CUT 任务 {tid} ({tname}) 仍出现在 ui-design-spec.md 中"
                })
            else:
                cross_ok += 1

# X3: frequency x click_depth
if "screen-map" in available_layers:
    for tid, task in tasks.items():
        if task.get("frequency") == "高":
            sids = task_screen_map.get(tid, [])
            for sid in sids:
                s = screens.get(sid, {})
                for a in s.get("actions", []):
                    if a.get("task_ref") == tid and a.get("click_depth", 1) >= 3:
                        cross_total += 1
                        cross_issues.append({
                            "check_id": "X3",
                            "type": "WARNING",
                            "task_id": tid,
                            "task_name": task["task_name"],
                            "detail": f"高频任务 {tid} 的操作 '{a.get('label', '')}' click_depth={a['click_depth']} ≥ 3（被埋深）"
                        })

# ── Step 3.5: Fidelity ────────────────────────────────────────────────────
# F1: Traceability rate
total_downstream = trace_total
traceable = trace_pass
traceability_rate = f"{traceable / total_downstream * 100:.0f}%" if total_downstream > 0 else "N/A"
traceability_status = "PASS" if total_downstream == 0 or (traceable / total_downstream >= 0.95) else "BELOW_THRESHOLD"

# F2: Viewpoint coverage (simplified — count layers covering each task)
vp_total = len(task_ids)
vp_covered = 0
for tid in task_ids:
    viewpoints = 0
    if tid in task_screen_map:
        viewpoints += 1  # UX viewpoint
    if tid in uc_task_map:
        viewpoints += 1  # User viewpoint
    if tid in gap_checked_tasks:
        viewpoints += 1  # Tech viewpoint
    if tid in prune_map:
        viewpoints += 1  # Business viewpoint
    if viewpoints >= 4:
        vp_covered += 1
vp_rate = f"{vp_covered / vp_total * 100:.0f}%" if vp_total > 0 else "N/A"
vp_status = "PASS" if vp_total == 0 or (vp_covered / vp_total >= 0.90) else "BELOW_THRESHOLD"

# ── Build report ───────────────────────────────────────────────────────────
report = {
    "generated_at": NOW,
    "mode": "full",
    "role_filter": None,
    "available_layers": available_layers,
    "summary": {
        "trace": {"total": trace_total, "pass": trace_pass, "orphan": len(trace_issues)},
        "coverage": {"total": coverage_total, "covered": coverage_covered,
                     "gap": len(coverage_issues), "rate": coverage_rate},
        "cross": {"total": cross_total, "ok": cross_ok,
                  "conflict": sum(1 for i in cross_issues if i["type"] == "CONFLICT"),
                  "warning": sum(1 for i in cross_issues if i["type"] == "WARNING"),
                  "broken_ref": sum(1 for i in cross_issues if i["type"] == "BROKEN_REF")},
        "fidelity": {
            "traceability_rate": traceability_rate,
            "traceability_status": traceability_status,
            "viewpoint_coverage_rate": vp_rate,
            "viewpoint_status": vp_status
        }
    },
    "trace_issues": trace_issues,
    "coverage_issues": coverage_issues,
    "cross_issues": cross_issues
}

with open(os.path.join(OUT, "audit-report.json"), "w", encoding="utf-8") as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

# ── Markdown report ────────────────────────────────────────────────────────
lines = []
lines.append("# 设计审计报告\n")
lines.append("## 摘要\n")
lines.append(f"- 执行模式: full")
lines.append(f"- 可用层: {', '.join(available_layers)}")
lines.append(f"- 逆向追溯: {trace_total} 项检查, {trace_pass} PASS, {len(trace_issues)} ORPHAN")
lines.append(f"- 覆盖洪泛: {coverage_total} 项检查, {coverage_covered} COVERED, {len(coverage_issues)} GAP, 覆盖率 {coverage_rate}")
lines.append(f"- 横向一致性: {cross_total} 项检查, {cross_ok} OK, {report['summary']['cross']['conflict']} CONFLICT, {report['summary']['cross']['warning']} WARNING")
lines.append(f"- 信息保真: 追溯完整率 {traceability_rate} ({traceability_status}) · 视角覆盖率 {vp_rate} ({vp_status})\n")

# Issues by severity
conflicts = [i for i in cross_issues if i["type"] == "CONFLICT"]
orphans = trace_issues
gaps = coverage_issues
warnings = [i for i in cross_issues if i["type"] == "WARNING"]
broken = [i for i in cross_issues if i["type"] == "BROKEN_REF"]

if conflicts:
    lines.append("## CONFLICT（跨层矛盾）\n")
    lines.append("| # | 检查项 | 任务 | 说明 |")
    lines.append("|---|--------|------|------|")
    for i, c in enumerate(conflicts, 1):
        lines.append(f"| {i} | {c['check_id']} | {c.get('task_name', '')} | {c['detail']} |")

if orphans:
    lines.append("\n## ORPHAN（无源头）\n")
    lines.append("| # | 检查项 | 来源层 | 项目 | 说明 |")
    lines.append("|---|--------|--------|------|------|")
    for i, o in enumerate(orphans, 1):
        lines.append(f"| {i} | {o['check_id']} | {o['source']} | {o['item_id']} | {o['detail']} |")

if gaps:
    lines.append("\n## GAP（未覆盖）\n")
    lines.append("| # | 检查项 | 任务 | 缺失层 | 说明 |")
    lines.append("|---|--------|------|--------|------|")
    for i, g in enumerate(gaps[:30], 1):  # Limit to 30
        lines.append(f"| {i} | {g['check_id']} | {g['task_name']} | {g['missing_in']} | {g['detail'][:80]} |")
    if len(gaps) > 30:
        lines.append(f"\n... 及另外 {len(gaps) - 30} 个 GAP\n")

if warnings:
    lines.append("\n## WARNING（风险）\n")
    lines.append("| # | 检查项 | 任务 | 说明 |")
    lines.append("|---|--------|------|------|")
    for i, w in enumerate(warnings, 1):
        lines.append(f"| {i} | {w['check_id']} | {w.get('task_name', '')} | {w['detail']} |")

with open(os.path.join(OUT, "audit-report.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

# ── Pipeline decisions ─────────────────────────────────────────────────────
pipe_path = os.path.join(BASE, "pipeline-decisions.json")
pipe = []
if os.path.exists(pipe_path):
    with open(pipe_path) as f:
        pipe = json.load(f)
pipe.append({
    "phase": "Phase 8 — design-audit",
    "decision": "auto_confirmed",
    "detail": (f"layers={len(available_layers)}, trace={trace_total}({len(trace_issues)} orphan), "
               f"coverage={coverage_rate}({len(coverage_issues)} gap), "
               f"cross={cross_total}({report['summary']['cross']['conflict']} conflict, "
               f"{report['summary']['cross']['warning']} warning), "
               f"fidelity={traceability_rate}/{vp_rate}"),
    "decided_at": NOW
})
with open(pipe_path, "w", encoding="utf-8") as f:
    json.dump(pipe, f, ensure_ascii=False, indent=2)

# ── Summary ────────────────────────────────────────────────────────────────
print(f"Layers: {available_layers}")
print(f"Trace: {trace_total} checks, {trace_pass} PASS, {len(trace_issues)} ORPHAN")
print(f"Coverage: {coverage_total} checks, {coverage_covered} COVERED, {len(coverage_issues)} GAP, rate={coverage_rate}")
print(f"Cross: {cross_total} checks, {cross_ok} OK, {report['summary']['cross']['conflict']} CONFLICT, {report['summary']['cross']['warning']} WARNING")
print(f"Fidelity: traceability={traceability_rate} ({traceability_status}), viewpoint={vp_rate} ({vp_status})")
print(f"\nAll files written to {OUT}/")
