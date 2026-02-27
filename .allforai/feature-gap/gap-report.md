# 功能缺口报告

## 摘要

- 任务缺口: 37 个
- 界面缺口: 42 个
- 旅程缺口: 45 个
- 业务流缺口: 1 个

## Flag 统计

| Flag | 数量 |
|------|------|
| NO_PRIMARY | 42 |
| NO_RULES | 28 |
| NO_EXCEPTIONS | 28 |
| CRUD_INCOMPLETE | 10 |
| SILENT_FAILURE | 9 |
| HIGH_RISK_NO_CONFIRM | 4 |

## 用户旅程评分

- AI 训练师: 平均 2.0/4（4 条旅程）
- 内容运营: 平均 2.0/4（4 条旅程）
- 数据运营: 平均 2.0/4（4 条旅程）
- 新移民: 平均 2.0/4（1 条旅程）
- 系统管理员: 平均 2.0/4（5 条旅程）
- 职场人士: 平均 2.0/4（27 条旅程）

## 缺口任务清单（按优先级排序）

| 优先级 | ID | 任务 | 缺口类型 | 描述 |
|--------|----|------|---------|------|
| 高 | GAP-076 | 场景脚本编辑器 — SILENT_FAILURE | SILENT_FAILURE | 操作 '创建新场景' 无失败反馈定义 |
| 高 | GAP-077 | 场景脚本编辑器 — SILENT_FAILURE | SILENT_FAILURE | 操作 '保存草稿' 无失败反馈定义 |
| 高 | GAP-003 | 查看实时发音纠正 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T005 (查看实时发音纠正) 检测到 NO_EXCEPTIONS |
| 高 | GAP-007 | 完成记忆曲线复习 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T007 (完成记忆曲线复习) 检测到 NO_EXCEPTIONS |
| 高 | GAP-011 | 创建场景对话脚本 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T009 (创建场景对话脚本) 检测到 CRUD_INCOMPLETE |
| 高 | GAP-017 | 查看学习连胜与成就 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T013 (查看学习连胜与成就) 检测到 NO_EXCEPTIONS |
| 高 | GAP-030 | 查看个性化推荐 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T020 (查看个性化推荐) 检测到 NO_EXCEPTIONS |
| 高 | GAP-036 | 查看关键指标看板 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T025 (查看关键指标看板) 检测到 NO_EXCEPTIONS |
| 高 | GAP-044 | 查看AI对话质量评分 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T029 (查看AI对话质量评分) 检测到 NO_EXCEPTIONS |
| 高 | GAP-051 | 管理用户账户 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T033 (管理用户账户) 检测到 CRUD_INCOMPLETE |
| 高 | GAP-001 | 查看对话报告 — NO_RULES | NO_RULES | 任务 T003 (查看对话报告) 检测到 NO_RULES |
| 高 | GAP-004 | 查看实时发音纠正 — NO_RULES | NO_RULES | 任务 T005 (查看实时发音纠正) 检测到 NO_RULES |
| 高 | GAP-031 | 查看个性化推荐 — NO_RULES | NO_RULES | 任务 T020 (查看个性化推荐) 检测到 NO_RULES |
| 高 | GAP-037 | 查看关键指标看板 — NO_RULES | NO_RULES | 任务 T025 (查看关键指标看板) 检测到 NO_RULES |
| 高 | GAP-045 | 查看AI对话质量评分 — NO_RULES | NO_RULES | 任务 T029 (查看AI对话质量评分) 检测到 NO_RULES |
| 高 | GAP-050 | 管理用户账户 — NO_RULES | NO_RULES | 任务 T033 (管理用户账户) 检测到 NO_RULES |
| 高 | GAP-056 | 登录账户 — NO_RULES | NO_RULES | 任务 T039 (登录账户) 检测到 NO_RULES |
| 中 | GAP-067 | 场景列表页 — NO_PRIMARY | NO_PRIMARY | 界面 S001 (场景列表页) 无主操作按钮 |
| 中 | GAP-068 | 场景详情页 — NO_PRIMARY | NO_PRIMARY | 界面 S002 (场景详情页) 无主操作按钮 |
| 中 | GAP-069 | AI对话页 — NO_PRIMARY | NO_PRIMARY | 界面 S003 (AI对话页) 无主操作按钮 |
| 中 | GAP-070 | 对话报告页 — NO_PRIMARY | NO_PRIMARY | 界面 S004 (对话报告页) 无主操作按钮 |
| 中 | GAP-073 | 记忆曲线复习页 — NO_PRIMARY | NO_PRIMARY | 界面 S007 (记忆曲线复习页) 无主操作按钮 |
| 中 | GAP-075 | 场景脚本编辑器 — NO_PRIMARY | NO_PRIMARY | 界面 S009 (场景脚本编辑器) 无主操作按钮 |
| 中 | GAP-078 | 审核队列页 — NO_PRIMARY | NO_PRIMARY | 界面 S010 (审核队列页) 无主操作按钮 |
| 中 | GAP-080 | 学习连胜与成就页 — NO_PRIMARY | NO_PRIMARY | 界面 S012 (学习连胜与成就页) 无主操作按钮 |
| 中 | GAP-092 | 关键指标看板 — NO_PRIMARY | NO_PRIMARY | 界面 S023 (关键指标看板) 无主操作按钮 |
| 中 | GAP-098 | AI对话质量评分页 — NO_PRIMARY | NO_PRIMARY | 界面 S027 (AI对话质量评分页) 无主操作按钮 |
| 中 | GAP-105 | 用户管理页 — NO_PRIMARY | NO_PRIMARY | 界面 S031 (用户管理页) 无主操作按钮 |
| 中 | GAP-115 | 登录页 — NO_PRIMARY | NO_PRIMARY | 界面 S037 (登录页) 无主操作按钮 |
| 高 | GAP-094 | 用户行为分析页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '创建自定义分析' 无失败反馈定义 |
| 高 | GAP-096 | A/B测试管理页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '创建A/B测试' 无失败反馈定义 |
| 高 | GAP-100 | 异常对话标注页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '提交标注' 无失败反馈定义 |
| 高 | GAP-102 | Prompt模板管理页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '创建新Prompt模板' 无失败反馈定义 |
| 高 | GAP-103 | Prompt模板管理页 — SILENT_FAILURE | SILENT_FAILURE | 操作 '发布Prompt到生产环境' 无失败反馈定义 |
| 高 | GAP-107 | 订阅与退款管理页 — HIGH_RISK_NO_CONFIRM | HIGH_RISK_NO_CONFIRM | 高风险任务 T034 (处理订阅与退款) 对应操作缺少二次确认 |
| 中 | GAP-005 | 查看发音详细报告 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T006 (查看发音详细报告) 检测到 NO_EXCEPTIONS |
| 中 | GAP-008 | 管理词汇本 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T008 (管理词汇本) 检测到 NO_EXCEPTIONS |
| 中 | GAP-010 | 管理词汇本 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T008 (管理词汇本) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-012 | 管理场景包 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T011 (管理场景包) 检测到 NO_EXCEPTIONS |
| 中 | GAP-014 | 管理场景标签 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T012 (管理场景标签) 检测到 NO_EXCEPTIONS |
| 中 | GAP-016 | 管理场景标签 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T012 (管理场景标签) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-018 | 查看排行榜 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T014 (查看排行榜) 检测到 NO_EXCEPTIONS |
| 中 | GAP-020 | 兑换积分商品 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T015 (兑换积分商品) 检测到 NO_EXCEPTIONS |
| 中 | GAP-024 | 查看个人学习档案 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T017 (查看个人学习档案) 检测到 NO_EXCEPTIONS |
| 中 | GAP-026 | 查看学习统计报告 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T018 (查看学习统计报告) 检测到 NO_EXCEPTIONS |
| 中 | GAP-038 | 分析用户行为 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T026 (分析用户行为) 检测到 NO_EXCEPTIONS |
| 中 | GAP-040 | 管理A/B测试 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T027 (管理A/B测试) 检测到 NO_EXCEPTIONS |
| 中 | GAP-041 | 管理A/B测试 — CRUD_INCOMPLETE | CRUD_INCOMPLETE | 任务 T027 (管理A/B测试) 检测到 CRUD_INCOMPLETE |
| 中 | GAP-042 | 生成运营报告 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T028 (生成运营报告) 检测到 NO_EXCEPTIONS |
| 中 | GAP-046 | 标注异常对话 — NO_EXCEPTIONS | NO_EXCEPTIONS | 任务 T030 (标注异常对话) 检测到 NO_EXCEPTIONS |
