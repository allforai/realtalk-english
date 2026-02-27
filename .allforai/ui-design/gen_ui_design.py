#!/usr/bin/env python3
"""Generate UI design spec, decisions, and HTML previews for Material Design 3."""

import json, os, datetime

BASE = "/home/hello/Documents/myskills/.allforai"
OUT = os.path.join(BASE, "ui-design")
PREVIEW = os.path.join(OUT, "preview")
os.makedirs(PREVIEW, exist_ok=True)

NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ── Load data ──────────────────────────────────────────────────────────────
with open(os.path.join(BASE, "product-map/task-inventory.json")) as f:
    inv = json.load(f)
tasks = {t["id"]: t for t in inv["tasks"]}

with open(os.path.join(BASE, "product-map/role-profiles.json")) as f:
    roles_data = json.load(f)
roles = roles_data["roles"]
role_map = {r["id"]: r["name"] for r in roles}
role_audience = {r["id"]: r.get("audience_type", "default") for r in roles}

with open(os.path.join(BASE, "screen-map/screen-map.json")) as f:
    sm = json.load(f)
screens = sm["screens"]

with open(os.path.join(BASE, "product-concept/product-concept.json")) as f:
    concept = json.load(f)

STYLE = "Material Design 3"
PRIMARY = "#6750A4"
ON_PRIMARY = "#FFFFFF"
SECONDARY = "#625B71"
TERTIARY = "#7D5260"
BG = "#FFFBFE"
SURFACE = "#FFFBFE"
SURFACE_VARIANT = "#E7E0EC"
ON_SURFACE = "#1C1B1F"
ON_SURFACE_VARIANT = "#49454F"
ERROR = "#B3261E"
SUCCESS = "#2E7D32"
WARNING = "#ED6C02"
RADIUS = "12px"
SHADOW = "0 1px 3px 1px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.3)"

# ── Build role -> screens mapping ──────────────────────────────────────────
role_screens = {}  # role_id -> list of screens
for s in screens:
    screen_tasks = s.get("tasks", [])
    screen_roles = set()
    for tid in screen_tasks:
        task = tasks.get(tid)
        if task:
            screen_roles.add(task["owner_role"])
    for rid in screen_roles:
        role_screens.setdefault(rid, []).append(s)

# ── Step 4: Generate design spec ──────────────────────────────────────────
spec_lines = []
spec_lines.append("# UI 设计规格\n")
spec_lines.append(f"> 风格: {STYLE}")
spec_lines.append(f"> 生成时间: {NOW}")
spec_lines.append(f"> 产品: {concept.get('mission', 'AI口语练习App')}\n")

spec_lines.append("## 设计语言基础\n")
spec_lines.append("### 配色系统\n")
spec_lines.append(f"- 主色 (Primary): {PRIMARY}")
spec_lines.append(f"- 次色 (Secondary): {SECONDARY}")
spec_lines.append(f"- 强调色 (Tertiary): {TERTIARY}")
spec_lines.append(f"- 背景: {BG}")
spec_lines.append(f"- 表面 (Surface): {SURFACE}")
spec_lines.append(f"- 表面变体: {SURFACE_VARIANT}")
spec_lines.append(f"- 功能色: 成功 {SUCCESS} · 警告 {WARNING} · 错误 {ERROR}\n")

spec_lines.append("### 排版\n")
spec_lines.append("- Display: 57px / 400")
spec_lines.append("- Headline: 32px / 400")
spec_lines.append("- Title: 22px / 500")
spec_lines.append("- Body: 16px / 400 / 行高 24px")
spec_lines.append("- Label: 14px / 500")
spec_lines.append("- 字体推荐: Roboto (Latin) / Noto Sans SC (中文)\n")

spec_lines.append("### 组件规范\n")
spec_lines.append(f"- 圆角: {RADIUS}")
spec_lines.append("- 间距系统: 4px 基准 (4/8/12/16/24/32)")
spec_lines.append("- 按钮: Filled (主操作) / Outlined (次要) / Text (辅助)")
spec_lines.append("- 卡片: Elevated (阴影) / Filled (填充) / Outlined (边框)")
spec_lines.append("- 输入框: 默认 outlined，聚焦态主色边框")
spec_lines.append("- 导航: Bottom navigation (C端) / Navigation rail (B端)\n")

spec_lines.append("### 推荐组件库\n")
spec_lines.append("- 首选: Flutter Material 3 — 原生支持 M3 tokens")
spec_lines.append("- 备选: MUI (React) — 成熟的 MD3 实现\n")

spec_lines.append("---\n")
spec_lines.append("## 界面规格\n")

# Group screens by module
module_screens = {}
for s in screens:
    mod = s.get("module", "其他")
    module_screens.setdefault(mod, []).append(s)

for mod, slist in module_screens.items():
    spec_lines.append(f"### 模块: {mod}\n")
    for s in slist:
        screen_tasks = s.get("tasks", [])
        audience = "consumer"
        for tid in screen_tasks:
            task = tasks.get(tid)
            if task:
                at = role_audience.get(task["owner_role"], "default")
                if at == "professional":
                    audience = "professional"
                    break

        actions = s.get("actions", [])
        primary_actions = [a["label"] for a in actions if a.get("frequency") == "高"]
        secondary_actions = [a["label"] for a in actions if a.get("frequency") != "高"]

        # Determine layout
        if audience == "professional":
            layout = "侧边导航 + 内容区（表格/列表导向）"
        elif len(actions) > 5:
            layout = "顶部导航 + 多区域卡片布局"
        else:
            layout = "单列卡片流"

        spec_lines.append(f"#### {s['name']}（{s['id']}）[{audience}]\n")
        spec_lines.append(f"**界面目的**: {s.get('notes', '支撑关联任务')}\n")
        spec_lines.append(f"**布局模式**: {layout}\n")
        spec_lines.append("**主要操作**:")
        for a in primary_actions[:3]:
            spec_lines.append(f"  - {a} (Filled Button)")
        for a in secondary_actions[:3]:
            spec_lines.append(f"  - {a} (Outlined Button)")
        spec_lines.append("")
        spec_lines.append("**关键状态设计**:")
        spec_lines.append("  - 空态: 插图 + 引导文案 + CTA 按钮")
        spec_lines.append("  - 加载中: M3 骨架屏 (shimmer)")
        spec_lines.append("  - 错误: Snackbar (错误色) + 重试按钮")
        spec_lines.append("  - 成功: Snackbar (成功色) / 页面跳转")
        spec_lines.append("")

with open(os.path.join(OUT, "ui-design-spec.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(spec_lines) + "\n")

# ── Step 5: Generate HTML previews ────────────────────────────────────────
CSS = f"""
body {{ font-family: 'Roboto', 'Noto Sans SC', sans-serif; background: {BG}; color: {ON_SURFACE}; margin: 0; padding: 0; }}
.header {{ background: {PRIMARY}; color: {ON_PRIMARY}; padding: 16px 24px; font-size: 22px; font-weight: 500; }}
.header a {{ color: {ON_PRIMARY}; text-decoration: none; opacity: 0.8; font-size: 14px; }}
.header a:hover {{ opacity: 1; }}
.container {{ max-width: 1200px; margin: 0 auto; padding: 24px; }}
.card-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }}
.card {{ background: {SURFACE}; border-radius: {RADIUS}; box-shadow: {SHADOW}; padding: 20px; transition: box-shadow 0.2s; }}
.card:hover {{ box-shadow: 0 2px 6px 2px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.3); }}
.card h3 {{ margin: 0 0 8px; font-size: 18px; color: {ON_SURFACE}; }}
.card .subtitle {{ font-size: 14px; color: {ON_SURFACE_VARIANT}; margin-bottom: 12px; }}
.badge {{ display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 12px; font-weight: 500; }}
.badge-consumer {{ background: #E8DEF8; color: {PRIMARY}; }}
.badge-professional {{ background: #D0BCFF; color: #21005D; }}
.actions {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }}
.btn-filled {{ background: {PRIMARY}; color: {ON_PRIMARY}; border: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; cursor: pointer; }}
.btn-outlined {{ background: transparent; color: {PRIMARY}; border: 1px solid {PRIMARY}; padding: 8px 16px; border-radius: 20px; font-size: 14px; cursor: pointer; }}
.states {{ margin-top: 12px; font-size: 13px; color: {ON_SURFACE_VARIANT}; }}
.states span {{ margin-right: 12px; }}
.module-title {{ font-size: 20px; font-weight: 500; margin: 24px 0 12px; color: {PRIMARY}; }}
a.card-link {{ text-decoration: none; color: inherit; }}
.task-count {{ font-size: 13px; color: {ON_SURFACE_VARIANT}; margin-top: 8px; }}
"""

def html_escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

# index.html
index_cards = []
for role in roles:
    rid = role["id"]
    rname = role["name"]
    at = role.get("audience_type", "default")
    rscreens = role_screens.get(rid, [])
    screen_count = len(rscreens)
    # Top 3 high-freq tasks
    role_tasks = [t for t in inv["tasks"] if t["owner_role"] == rid and t.get("frequency") == "高"]
    top3 = [t["task_name"] for t in role_tasks[:3]]
    safe_name = rname.replace("/", "-").replace(" ", "-")
    badge_class = "badge-consumer" if at == "consumer" else "badge-professional"
    index_cards.append(f"""
    <a href="ui-role-{html_escape(safe_name)}.html" class="card-link">
      <div class="card">
        <h3>{html_escape(rname)}</h3>
        <span class="badge {badge_class}">{html_escape(at)}</span>
        <div class="subtitle">{screen_count} 个界面</div>
        <div class="states">{'<br>'.join(html_escape(t) for t in top3) if top3 else '无高频任务'}</div>
      </div>
    </a>""")

index_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>UI 设计预览 — {html_escape(concept.get('mission', 'AI口语练习App')[:40])}</title>
<style>{CSS}</style></head>
<body>
<div class="header">{html_escape(concept.get('mission', 'AI口语练习App')[:50])} — UI 设计预览
<div style="font-size:14px;opacity:0.8;margin-top:4px">风格: {STYLE} · {len(roles)} 角色 · {len(screens)} 界面</div>
</div>
<div class="container">
<div class="card-grid">
{''.join(index_cards)}
</div>
</div>
</body></html>"""

with open(os.path.join(PREVIEW, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# Per-role HTML files
for role in roles:
    rid = role["id"]
    rname = role["name"]
    at = role.get("audience_type", "default")
    safe_name = rname.replace("/", "-").replace(" ", "-")
    rscreens = role_screens.get(rid, [])

    # Group by module
    mod_groups = {}
    for s in rscreens:
        mod = s.get("module", "其他")
        mod_groups.setdefault(mod, []).append(s)

    content = ""
    for mod, slist in mod_groups.items():
        content += f'<div class="module-title">{html_escape(mod)}</div>\n<div class="card-grid">\n'
        for s in slist:
            actions = s.get("actions", [])
            high_actions = [a for a in actions if a.get("frequency") == "高"]
            other_actions = [a for a in actions if a.get("frequency") != "高"]

            btns = ""
            for a in high_actions[:3]:
                btns += f'<button class="btn-filled">{html_escape(a["label"])}</button>\n'
            for a in other_actions[:2]:
                btns += f'<button class="btn-outlined">{html_escape(a["label"])}</button>\n'

            task_count = len(s.get("tasks", []))
            content += f"""
  <div class="card">
    <h3>{html_escape(s['name'])}</h3>
    <span class="badge badge-{'consumer' if at == 'consumer' else 'professional'}">{html_escape(at)}</span>
    <div class="subtitle">{html_escape(s.get('notes', ''))}</div>
    <div class="actions">{btns}</div>
    <div class="states">
      <span>正常: 默认视图</span>
      <span>空态: 引导+CTA</span>
      <span>错误: Snackbar</span>
    </div>
    <div class="task-count">{task_count} 个关联任务</div>
  </div>"""
        content += "\n</div>\n"

    role_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html_escape(rname)} — UI 设计预览</title>
<style>{CSS}</style></head>
<body>
<div class="header">
  <a href="index.html">← 返回总览</a> &nbsp;·&nbsp; {html_escape(rname)}
  <div style="font-size:14px;opacity:0.8;margin-top:4px">风格: {STYLE} · {len(rscreens)} 个界面</div>
</div>
<div class="container">
{content}
</div>
</body></html>"""

    with open(os.path.join(PREVIEW, f"ui-role-{safe_name}.html"), "w", encoding="utf-8") as f:
        f.write(role_html)

# ── Decisions ──────────────────────────────────────────────────────────────
decisions = [
    {"step": "Step 1", "item_id": "profile", "decision": "auto_confirmed",
     "value": f"{len(roles)} roles, {len(screens)} screens", "decided_at": NOW},
    {"step": "Step 2", "item_id": "style", "decision": "auto_confirmed",
     "value": STYLE, "reason": "pipeline_preferences.ui_style=material-design-3", "decided_at": NOW},
    {"step": "Step 3", "item_id": "principles", "decision": "auto_confirmed",
     "value": "M3 default CSS variables applied", "decided_at": NOW},
    {"step": "Step 4", "item_id": "spec", "decision": "auto_confirmed",
     "value": "ui-design-spec.md generated", "decided_at": NOW},
    {"step": "Step 5", "item_id": "preview", "decision": "auto_confirmed",
     "value": f"index.html + {len(roles)} role HTML files", "decided_at": NOW},
]
with open(os.path.join(OUT, "ui-design-decisions.json"), "w", encoding="utf-8") as f:
    json.dump(decisions, f, ensure_ascii=False, indent=2)

# ── Pipeline decisions ─────────────────────────────────────────────────────
pipe_path = os.path.join(BASE, "pipeline-decisions.json")
pipe = []
if os.path.exists(pipe_path):
    with open(pipe_path) as f:
        pipe = json.load(f)
pipe.append({
    "phase": "Phase 7 — ui-design",
    "decision": "auto_confirmed",
    "detail": f"style={STYLE}, roles={len(roles)}, screens={len(screens)}, html_files={1 + len(roles)}",
    "decided_at": NOW
})
with open(pipe_path, "w", encoding="utf-8") as f:
    json.dump(pipe, f, ensure_ascii=False, indent=2)

# ── Summary ────────────────────────────────────────────────────────────────
html_files = [f for f in os.listdir(PREVIEW) if f.endswith(".html")]
print(f"Style: {STYLE}")
print(f"Roles: {len(roles)}")
print(f"Screens: {len(screens)}")
print(f"HTML files: {len(html_files)} ({', '.join(sorted(html_files)[:5])}...)")
print(f"Spec: ui-design-spec.md")
print(f"\nAll files written to {OUT}/")
