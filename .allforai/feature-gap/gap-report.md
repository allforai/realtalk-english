# 功能缺口报告

## 摘要

- 任务缺口: 19 个
- 界面缺口: 18 个
- 旅程缺口: 21 个
- 业务流缺口: 1 个
- 状态机缺口: 2 个

## Flag 统计

| Flag | 数量 |
|------|------|
| NO_EXCEPTIONS | 16 |
| CRUD_INCOMPLETE | 8 |
| SILENT_FAILURE | 7 |
| HIGH_RISK_NO_CONFIRM | 6 |
| NO_SCREEN | 3 |
| NO_PRIMARY | 2 |
| NO_REVERSE_TRANSITION | 2 |
| DEAD_END_STATE | 1 |

## 用户旅程评分

- AI 训练师: 平均 2.0/4（3 条旅程）
- 内容运营: 平均 2.0/4（2 条旅程）
- 数据运营: 平均 2.0/4（3 条旅程）
- 系统管理员: 平均 2.4/4（8 条旅程）
- 职场人士: 平均 3.0/4（5 条旅程）

## 状态机完整性检查

| 实体 | 状态数 | 转换数 | 缺口 | 严重级 |
|------|--------|--------|------|--------|
| 学习场景 | 4 | 4 | DEAD_END_STATE, NO_REVERSE_TRANSITION | 高 |
| 词汇卡 | 4 | 4 | NO_REVERSE_TRANSITION | 中 |

## 缺口任务清单（按优先级排序）

| 优先级 | ID | 任务 | 缺口类型 | 描述 |
|--------|----|------|---------|------|
| 高 | GAP-028 | 对话报告页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '再来一次' 无失败反馈定义 |
| 高 | GAP-029 | 词汇复习页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '评分（Again/Hard/Good/Easy）' 无失败反馈定义 |
| 高 | GAP-033 | 场景列表（管理端） — SILENT_FAILURE | SILENT_FAILURE | 操作 '新建场景' 无失败反馈定义 |
| 高 | GAP-044 | 实体「学习场景」— DEAD_END_STATE | DEAD_END_STATE | 实体「学习场景」状态机检测到 DEAD_END_STATE（4 个状态, 4 个转换） |
| 高 | GAP-025 | (任务 T003 无对应界面) — NO_SCREEN | NO_SCREEN | 任务 T003 (刷新登录凭证) 在 screen-map 中无对应界面 |
| 高 | GAP-007 | 创建学习场景草稿 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T024 (创建学习场景草稿) 检测到 CRUD_INCOMPLETE |
| 高 | GAP-008 | 查看 AI 质量评分概览 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T028 (查看 AI 质量评分概览) 检测到 NO_EXCEPTIONS |
| 高 | GAP-009 | 查看核心指标仪表盘 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T030 (查看核心指标仪表盘) 检测到 NO_EXCEPTIONS |
| 高 | GAP-013 | 检测异常对话 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T039 (检测异常对话) 检测到 NO_EXCEPTIONS |
| 中 | GAP-030 | 成就与连续天数页 — NO_PRIMARY | NO_PRIMARY | 界面 S008 (成就与连续天数页) 无主操作按钮 |
| 中 | GAP-036 | 用户详情页 — NO_PRIMARY | NO_PRIMARY | 界面 S018 (用户详情页) 无主操作按钮 |
| 高 | GAP-045 | 实体「学习场景」— NO_REVERSE_TRANSITION | NO_REVERSE_TRANSITION | 实体「学习场景」状态机检测到 NO_REVERSE_TRANSITION（4 个状态, 4 个转换） |
| 中 | GAP-046 | 实体「词汇卡」— NO_REVERSE_TRANSITION | NO_REVERSE_TRANSITION | 实体「词汇卡」状态机检测到 NO_REVERSE_TRANSITION（4 个状态, 4 个转换） |
| 高 | GAP-031 | 通知中心 — SILENT_FAILURE | SILENT_FAILURE | 操作 '点击通知' 无失败反馈定义 |
| 高 | GAP-032 | 通知中心 — SILENT_FAILURE | SILENT_FAILURE | 操作 '管理通知偏好' 无失败反馈定义 |
| 高 | GAP-035 | 场景审核详情页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '驳回' 无失败反馈定义 |
| 高 | GAP-027 | (任务 T023 无对应界面) — NO_SCREEN | NO_SCREEN | 任务 T023 (手动添加词汇到生词本) 在 screen-map 中无对应界面 |
| 高 | GAP-034 | 审核队列页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T027 (审核学习场景) 对应操作缺少二次确认 |
| 高 | GAP-037 | Prompt 模板管理页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T040 (管理 Prompt 模板) 对应操作缺少二次确认 |
| 高 | GAP-002 | 查看复习统计摘要 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T013 (查看复习统计摘要) 检测到 NO_EXCEPTIONS |
| 中 | GAP-003 | 查看成就列表 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T016 (查看成就列表) 检测到 NO_EXCEPTIONS |
| 中 | GAP-004 | 标记通知已读 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T019 (标记通知已读) 检测到 NO_EXCEPTIONS |
| 中 | GAP-010 | 管理场景包 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T037 (管理场景包) 检测到 NO_EXCEPTIONS |
| 中 | GAP-011 | 管理场景包 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T037 (管理场景包) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-012 | 管理场景标签 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T038 (管理场景标签) 检测到 NO_EXCEPTIONS |
| 中 | GAP-014 | 管理 Prompt 模板 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T040 (管理 Prompt 模板) 检测到 NO_EXCEPTIONS |
| 中 | GAP-015 | 管理 Prompt 模板 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T040 (管理 Prompt 模板) 检测到 CRUD_INCOMPLETE |
| 高 | GAP-016 | 查看发音分析报告 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T041 (查看发音分析报告) 检测到 NO_EXCEPTIONS |
| 中 | GAP-021 | 处理用户投诉 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T044 (处理用户投诉) 检测到 NO_EXCEPTIONS |
| 中 | GAP-022 | 查看用户反馈 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T045 (查看用户反馈) 检测到 NO_EXCEPTIONS |
| 高 | GAP-042 | 重置密码页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '发送重置链接' 无失败反馈定义 |
| 高 | GAP-043 | 新手引导页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '选择学习目标' 无失败反馈定义 |
| 高 | GAP-026 | (任务 T004 无对应界面) — NO_SCREEN | NO_SCREEN | 任务 T004 (退出登录) 在 screen-map 中无对应界面 |
| 高 | GAP-038 | A/B 测试管理页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T048 (管理 A/B 测试) 对应操作缺少二次确认 |
| 高 | GAP-039 | 订阅管理页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T042 (管理订阅方案) 对应操作缺少二次确认 |
| 高 | GAP-040 | 系统设置页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T043 (管理系统配置) 对应操作缺少二次确认 |
| 高 | GAP-041 | 角色权限管理页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T050 (管理角色权限) 对应操作缺少二次确认 |
| 中 | GAP-001 | 退出登录 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T004 (退出登录) 检测到 NO_EXCEPTIONS |
| 低 | GAP-005 | 管理推送通知偏好 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T020 (管理推送通知偏好) 检测到 NO_EXCEPTIONS |
| 低 | GAP-006 | 管理推送通知偏好 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T020 (管理推送通知偏好) 检测到 CRUD_INCOMPLETE |
| 低 | GAP-017 | 管理订阅方案 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T042 (管理订阅方案) 检测到 NO_EXCEPTIONS |
| 低 | GAP-018 | 管理订阅方案 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T042 (管理订阅方案) 检测到 CRUD_INCOMPLETE |
| 低 | GAP-019 | 管理系统配置 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T043 (管理系统配置) 检测到 NO_EXCEPTIONS |
| 低 | GAP-020 | 管理系统配置 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T043 (管理系统配置) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-023 | 管理 A/B 测试 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T048 (管理 A/B 测试) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-024 | 管理角色权限 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T050 (管理角色权限) 检测到 CRUD_INCOMPLETE |
| 高 | GAP-047 | [XV] 职场人士 — Missing dead-end state handling. When an admin executes T034 (封禁用户), there is no corresponding UI state or forced logout flow defined for the banned user to explain their account status. | XV_JOURNEY_GAP | Missing dead-end state handling. When an admin executes T034 |
| 高 | GAP-048 | [XV] 职场人士/系统管理员 — Missing cross-role feedback loop. After the admin processes a complaint, there is no defined notification mechanism or UI for the end-user to see the resolution. | XV_JOURNEY_GAP | Missing cross-role feedback loop. After the admin processes  |
