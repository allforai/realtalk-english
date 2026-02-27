# 设计审计报告

## 摘要

- 执行模式: full
- 可用层: product-map, screen-map, use-case, feature-gap, feature-prune, ui-design
- 逆向追溯: 136 项检查, 136 PASS, 0 ORPHAN
- 覆盖洪泛: 180 项检查, 180 COVERED, 0 GAP, 覆盖率 100%
- 横向一致性: 60 项检查, 43 OK, 16 CONFLICT, 1 WARNING
- 信息保真: 追溯完整率 100% (PASS) · 视角覆盖率 100% (PASS)

## CONFLICT（跨层矛盾）

| # | 检查项 | 任务 | 说明 |
|---|--------|------|------|
| 1 | X1 | 重置密码 | feature-gap 报 T041 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 2 | X1 | 购买场景包 | feature-gap 报 T024 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 3 | X1 | 分享学习成果 | feature-gap 报 T016 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 4 | X1 | 订阅付费方案 | feature-gap 报 T022 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 5 | X1 | 完成新手引导 | feature-gap 报 T043 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 6 | X1 | 管理权限角色 | feature-gap 报 T036 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 7 | X1 | 管理个人设置 | feature-gap 报 T040 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 8 | X1 | 管理订阅 | feature-gap 报 T023 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 9 | X1 | 注销账户 | feature-gap 报 T042 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 10 | X1 | 设置角色偏好 | feature-gap 报 T019 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 11 | X1 | 注册账户 | feature-gap 报 T038 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 12 | X1 | 配置系统参数 | feature-gap 报 T035 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 13 | X1 | 提交意见反馈 | feature-gap 报 T045 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 14 | X1 | 调整发音评估参数 | feature-gap 报 T032 有缺口，但 feature-prune 标为 CUT — 矛盾 |
| 15 | X2 | 购买场景包 | CUT 任务 T024 (购买场景包) 仍出现在 ui-design-spec.md 中 |
| 16 | X2 | 重置密码 | CUT 任务 T041 (重置密码) 仍出现在 ui-design-spec.md 中 |

## WARNING（风险）

| # | 检查项 | 任务 | 说明 |
|---|--------|------|------|
| 1 | X3 | 创建场景对话脚本 | 高频任务 T009 的操作 '预览场景对话' click_depth=3 ≥ 3（被埋深） |
