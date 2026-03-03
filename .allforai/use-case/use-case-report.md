# 用例集摘要

角色 5 个 · 功能区 12 个 · 任务 52 个 · 用例 151 条（正常流 52 / 异常流 58 / 边界 7 / 校验 26 / E2E 8） · E2E 链路问题 78 个


## R001 职场人士


### 认证


**T001 注册账号**（6 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC001 | 注册账号_正常流 | happy_path | 低 |
| UC002 | 注册账号_邮箱已存在 | exception | 低 |
| UC003 | 注册账号_校验_邮箱格式 | validation | 低 |
| UC004 | 注册账号_校验_密码长度 ≥ 8 | validation | 低 |
| UC005 | 注册账号_校验_两次密码一致 | validation | 低 |
| UC144 | [XV] 注册账号_并发注册相同邮箱 | concurrency | 高 |

**T002 登录账号**（7 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC006 | 登录账号_正常流 | happy_path | 高 |
| UC007 | 登录账号_密码错误 | exception | 高 |
| UC008 | 登录账号_账号被封禁 | exception | 高 |
| UC009 | 登录账号_校验_邮箱格式校验 | validation | 高 |
| UC010 | 登录账号_校验_密码非空 | validation | 高 |
| UC011 | 登录账号_校验_邮箱格式 | validation | 高 |
| UC012 | 登录账号_校验_密码非空 | validation | 高 |

**T003 刷新登录凭证**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC013 | 刷新登录凭证_正常流 | happy_path | 高 |
| UC014 | 刷新登录凭证_refresh_token 过期 | exception | 高 |
| UC145 | [XV] 刷新登录凭证_刷新后旧token立即失效 | timing | 高 |

**T004 退出登录**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC015 | 退出登录_正常流 | happy_path | 低 |
| UC016 | 退出登录_无异常定义 | exception | 低 |
| UC146 | [XV] 退出登录_退出后token立即失效 | timing | 高 |

**T046 获取当前用户信息**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC017 | 获取当前用户信息_正常流 | happy_path | 高 |
| UC018 | 获取当前用户信息_token 无效 | exception | 高 |
| UC019 | 获取当前用户信息_边界_JWT 必须有效 | boundary | 高 |

**T051 重置密码**（5 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC020 | 重置密码_正常流 | happy_path | 中 |
| UC021 | 重置密码_邮箱未注册 | exception | 中 |
| UC022 | 重置密码_链接过期 | exception | 中 |
| UC023 | 重置密码_边界_重置链接有效期限制 | boundary | 中 |
| UC024 | 重置密码_校验_邮箱格式 | validation | 中 |

### 场景学习


**T005 浏览学习场景列表**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC025 | 浏览学习场景列表_正常流 | happy_path | 高 |
| UC026 | 浏览学习场景列表_无匹配场景 | exception | 高 |

**T006 查看场景详情**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC027 | 查看场景详情_正常流 | happy_path | 高 |
| UC028 | 查看场景详情_场景不存在 | exception | 高 |

**T017 查看个性化场景推荐**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC029 | 查看个性化场景推荐_正常流 | happy_path | 高 |
| UC030 | 查看个性化场景推荐_新用户无历史 | exception | 高 |

### AI 对话


**T007 发起 AI 对话**（7 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC052 | 发起 AI 对话_正常流 | happy_path | 高 |
| UC053 | 发起 AI 对话_达到每日限额 | exception | 高 |
| UC054 | 发起 AI 对话_系统异常 | exception | 高 |
| UC055 | 发起 AI 对话_边界_免费用户每日 3 轮对话限制（CN001 | boundary | 高 |
| UC056 | 发起 AI 对话_边界_付费用户无限制 | boundary | 高 |
| UC147 | [XV] 发起AI对话_并发达到限额边界 | concurrency | 高 |
| UC154 | [XV] 发起AI对话_免费用户边界_第3轮对话后限额 | boundary | 高 |

**T008 发送文本消息并接收 AI 回复**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC057 | 发送文本消息并接收 AI 回复_正常流 | happy_path | 高 |
| UC058 | 发送文本消息并接收 AI 回复_LLM 调用超时 | exception | 高 |
| UC059 | 发送文本消息并接收 AI 回复_网络断开 | exception | 高 |
| UC060 | 发送文本消息并接收 AI 回复_校验_消息非空 | validation | 高 |

**T009 发送语音消息并获取发音评估**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC061 | 发送语音消息并获取发音评估_正常流 | happy_path | 高 |
| UC062 | 发送语音消息并获取发音评估_语音识别失败 | exception | 高 |
| UC063 | 发送语音消息并获取发音评估_音频过短 | exception | 高 |
| UC064 | 发送语音消息并获取发音评估_校验_消息非空 | validation | 高 |

**T010 结束对话并查看报告**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC065 | 结束对话并查看报告_正常流 | happy_path | 高 |
| UC066 | 结束对话并查看报告_对话已结束 | exception | 高 |

**T011 查看历史对话列表**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC067 | 查看历史对话列表_正常流 | happy_path | 中 |
| UC068 | 查看历史对话列表_无历史 | exception | 中 |

**T022 对话中自动收集生词**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC069 | 对话中自动收集生词_正常流 | happy_path | 高 |
| UC070 | 对话中自动收集生词_已存在词汇 | exception | 高 |
| UC071 | 对话中自动收集生词_校验_消息非空 | validation | 高 |

### 词汇复习


**T012 复习今日到期词汇卡**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC080 | 复习今日到期词汇卡_正常流 | happy_path | 高 |
| UC081 | 复习今日到期词汇卡_无到期卡片 | exception | 高 |

**T013 查看复习统计摘要**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC082 | 查看复习统计摘要_正常流 | happy_path | 中 |
| UC083 | 查看复习统计摘要_无异常定义 | exception | 低 |

**T023 手动添加词汇到生词本**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC084 | 手动添加词汇到生词本_正常流 | happy_path | 中 |
| UC085 | 手动添加词汇到生词本_已存在 | exception | 中 |

### 成就激励


**T014 查看学习连续天数**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC086 | 查看学习连续天数_正常流 | happy_path | 高 |
| UC087 | 查看学习连续天数_断签 | exception | 高 |

**T015 恢复断签连续天数**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC088 | 恢复断签连续天数_正常流 | happy_path | 中 |
| UC089 | 恢复断签连续天数_本月已恢复过 | exception | 中 |
| UC090 | 恢复断签连续天数_边界_每月最多恢复 1 次 | boundary | 中 |

**T016 查看成就列表**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC091 | 查看成就列表_正常流 | happy_path | 中 |
| UC092 | 查看成就列表_无异常定义 | exception | 低 |

### 通知


**T018 查看通知列表**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC093 | 查看通知列表_正常流 | happy_path | 中 |
| UC094 | 查看通知列表_无通知 | exception | 中 |

**T019 标记通知已读**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC095 | 标记通知已读_正常流 | happy_path | 中 |
| UC096 | 标记通知已读_无异常定义 | exception | 低 |

**T020 管理推送通知偏好**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC097 | 管理推送通知偏好_正常流 | happy_path | 低 |
| UC098 | 管理推送通知偏好_无异常定义 | exception | 低 |

### 订阅


**T021 订阅付费方案**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC099 | 订阅付费方案_正常流 | happy_path | 高 |
| UC100 | 订阅付费方案_支付失败 | exception | 高 |
| UC101 | 订阅付费方案_Webhook 验证失败 | exception | 高 |

### 新手引导


**T052 新手引导**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC141 | 新手引导_正常流 | happy_path | 中 |
| UC142 | 新手引导_用户跳过引导 | exception | 中 |
| UC143 | 新手引导_校验_至少选择一个目标 | validation | 中 |

## R004 内容运营


### 场景学习


**T024 创建学习场景草稿**（6 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC031 | 创建学习场景草稿_正常流 | happy_path | 高 |
| UC032 | 创建学习场景草稿_必填字段缺失 | exception | 高 |
| UC033 | 创建学习场景草稿_校验_标题必填 | validation | 高 |
| UC034 | 创建学习场景草稿_校验_描述必填 | validation | 高 |
| UC035 | 创建学习场景草稿_校验_难度必选 | validation | 高 |
| UC036 | 创建学习场景草稿_校验_至少一个对话节点 | validation | 高 |

**T025 编辑学习场景**（5 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC037 | 编辑学习场景_正常流 | happy_path | 高 |
| UC038 | 编辑学习场景_非 draft 状态 | exception | 高 |
| UC039 | 编辑学习场景_校验_标题必填 | validation | 高 |
| UC040 | 编辑学习场景_校验_描述必填 | validation | 高 |
| UC148 | [XV] 编辑学习场景_并发编辑冲突 | concurrency | 高 |

**T026 提交场景审核**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC041 | 提交场景审核_正常流 | happy_path | 中 |
| UC042 | 提交场景审核_非 draft 状态 | exception | 中 |
| UC043 | 提交场景审核_校验_标题必填 | validation | 中 |
| UC044 | 提交场景审核_校验_描述必填 | validation | 中 |

**T027 审核学习场景**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC045 | 审核学习场景_正常流 | happy_path | 高 |
| UC046 | 审核学习场景_非 review 状态 | exception | 高 |
| UC047 | 审核学习场景_校验_驳回原因必填 | validation | 高 |
| UC149 | [XV] 审核学习场景_并发审核冲突 | concurrency | 高 |

**T037 管理场景包**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC048 | 管理场景包_正常流 | happy_path | 中 |
| UC049 | 管理场景包_无异常定义 | exception | 低 |

**T038 管理场景标签**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC050 | 管理场景标签_正常流 | happy_path | 中 |
| UC051 | 管理场景标签_无异常定义 | exception | 低 |

## R005 AI 训练师


### AI 对话


**T029 查看低分对话并分析**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC072 | 查看低分对话并分析_正常流 | happy_path | 高 |
| UC073 | 查看低分对话并分析_无低分对话 | exception | 高 |

**T039 检测异常对话**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC074 | 检测异常对话_正常流 | happy_path | 高 |
| UC075 | 检测异常对话_无异常定义 | exception | 低 |

**T041 查看发音分析报告**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC076 | 查看发音分析报告_正常流 | happy_path | 中 |
| UC077 | 查看发音分析报告_无异常定义 | exception | 低 |

### AI 质量


**T028 查看 AI 质量评分概览**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC104 | 查看 AI 质量评分概览_正常流 | happy_path | 高 |
| UC105 | 查看 AI 质量评分概览_无异常定义 | exception | 低 |

**T040 管理 Prompt 模板**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC106 | 管理 Prompt 模板_正常流 | happy_path | 高 |
| UC107 | 管理 Prompt 模板_无异常定义 | exception | 低 |
| UC150 | [XV] 管理Prompt模板_并发修改模板 | concurrency | 高 |

## R006 数据运营


### AI 对话


**T049 生成/导出运营报告**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC078 | 生成/导出运营报告_正常流 | happy_path | 中 |
| UC079 | 生成/导出运营报告_数据范围过大 | exception | 中 |

### 数据运营


**T030 查看核心指标仪表盘**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC108 | 查看核心指标仪表盘_正常流 | happy_path | 高 |
| UC109 | 查看核心指标仪表盘_无异常定义 | exception | 低 |
| UC110 | 查看核心指标仪表盘_校验_阈值为正数 | validation | 高 |

**T031 设置指标预警阈值**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC111 | 设置指标预警阈值_正常流 | happy_path | 中 |
| UC112 | 设置指标预警阈值_无效阈值 | exception | 中 |
| UC113 | 设置指标预警阈值_边界_alerts API 设置阈值 | boundary | 中 |
| UC114 | 设置指标预警阈值_校验_阈值为正数 | validation | 中 |

**T047 查看用户行为分析**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC115 | 查看用户行为分析_正常流 | happy_path | 中 |
| UC116 | 查看用户行为分析_数据不足 | exception | 中 |

**T048 管理 A/B 测试**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC117 | 管理 A/B 测试_正常流 | happy_path | 高 |
| UC118 | 管理 A/B 测试_流量不足 | exception | 高 |
| UC151 | [XV] 管理A/B测试_并发测试配置冲突 | concurrency | 高 |

## R007 系统管理员


### 订阅


**T042 管理订阅方案**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC102 | 管理订阅方案_正常流 | happy_path | 高 |
| UC103 | 管理订阅方案_无异常定义 | exception | 低 |

### 用户管理


**T032 搜索用户**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC119 | 搜索用户_正常流 | happy_path | 高 |
| UC120 | 搜索用户_无匹配 | exception | 高 |

**T033 查看用户详情**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC121 | 查看用户详情_正常流 | happy_path | 高 |
| UC122 | 查看用户详情_用户不存在 | exception | 高 |
| UC123 | 查看用户详情_校验_封禁原因必填 | validation | 高 |

**T034 封禁用户**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC124 | 封禁用户_正常流 | happy_path | 高 |
| UC125 | 封禁用户_已封禁用户 | exception | 高 |
| UC126 | 封禁用户_校验_封禁原因必填 | validation | 高 |
| UC152 | [XV] 封禁用户_封禁期间用户活动处理 | timing | 高 |

**T035 解封用户**（3 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC127 | 解封用户_正常流 | happy_path | 中 |
| UC128 | 解封用户_未封禁用户 | exception | 中 |
| UC129 | 解封用户_校验_封禁原因必填 | validation | 中 |

### 系统管理


**T036 查看系统健康状态**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC130 | 查看系统健康状态_正常流 | happy_path | 中 |
| UC131 | 查看系统健康状态_DB 不可达 | exception | 中 |

**T043 管理系统配置**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC132 | 管理系统配置_正常流 | happy_path | 高 |
| UC133 | 管理系统配置_无异常定义 | exception | 低 |

**T044 处理用户投诉**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC134 | 处理用户投诉_正常流 | happy_path | 中 |
| UC135 | 处理用户投诉_无异常定义 | exception | 低 |

**T045 查看用户反馈**（2 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC136 | 查看用户反馈_正常流 | happy_path | 中 |
| UC137 | 查看用户反馈_无异常定义 | exception | 低 |

**T050 管理角色权限**（4 条用例）

| ID | 标题 | 类型 | 优先级 |
|----|------|------|--------|
| UC138 | 管理角色权限_正常流 | happy_path | 高 |
| UC139 | 管理角色权限_不可删除内置角色 | exception | 高 |
| UC140 | 管理角色权限_边界_权限变更审计日志 | boundary | 高 |
| UC153 | [XV] 管理角色权限_权限变更生效延迟 | timing | 高 |

## 端到端用例

| ID | 标题 | 类型 | 关联流 | 步骤数 |
|----|------|------|--------|--------|
| E2E-F001-01 | 用户认证与入门_正常流 | e2e | F001 | 7 |
| E2E-F002-01 | 核心学习循环_正常流 | e2e | F002 | 9 |
| E2E-F003-01 | 场景内容生命周期_正常流 | e2e | F003 | 4 |
| E2E-F004-01 | AI 质量保障循环_正常流 | e2e | F004 | 5 |
| E2E-F005-01 | 订阅付费链路_正常流 | e2e | F005 | 3 |
| E2E-F006-01 | 用户管理与合规_正常流 | e2e | F006 | 4 |
| E2E-F007-01 | 数据驱动运营循环_正常流 | e2e | F007 | 5 |
| E2E-F008-01 | 用户投诉处理_正常流 | e2e | F008 | 2 |

## E2E 链路验证

| E2E ID | Flag | 节点 | 描述 | 严重级 |
|--------|------|------|------|--------|
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T001 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T002 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T003 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T052 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 5 | seq 5 task T017 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 6 | seq 6 task T006 缺少 prerequisites | 低 |
| E2E-F001-01 | UNVERIFIABLE_PRECONDITION | seq 7 | seq 7 task T007 缺少 prerequisites | 低 |
| E2E-F001-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「user_id」在上游 task 中无语义匹配 | 中 |
| E2E-F001-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「user_level」在上游 task 中无语义匹配 | 中 |
| E2E-F001-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「learning_goal」在上游 task 中无语义匹配 | 中 |
| E2E-F001-01 | WEAK_TERMINAL | seq 7 | 最后节点 task T007 无 outputs.messages/states 且 main_fl | 中 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T005 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T006 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T007 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T008 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 5 | seq 5 task T010 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 6 | seq 6 task T022 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 7 | seq 7 task T012 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 8 | seq 8 task T013 缺少 prerequisites | 低 |
| E2E-F002-01 | UNVERIFIABLE_PRECONDITION | seq 9 | seq 9 task T023 缺少 prerequisites | 低 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「scenario_id」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「scenario_id」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「conversation_id」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「text_content」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「conversation_id」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 5→6 | 交接数据「conversation_id」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | MISSING_HANDOFF_DATA | seq 5→6 | 交接数据「new_words」在上游 task 中无语义匹配 | 中 |
| E2E-F002-01 | WEAK_TERMINAL | seq 9 | 最后节点 task T023 无 outputs.messages/states 且 main_fl | 中 |
| E2E-F003-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T024 缺少 prerequisites | 低 |
| E2E-F003-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T025 缺少 prerequisites | 低 |
| E2E-F003-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T026 缺少 prerequisites | 低 |
| E2E-F003-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T027 缺少 prerequisites | 低 |
| E2E-F003-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「scenario_id」在上游 task 中无语义匹配 | 中 |
| E2E-F003-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「content」在上游 task 中无语义匹配 | 中 |
| E2E-F003-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「scenario_id」在上游 task 中无语义匹配 | 中 |
| E2E-F003-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「scenario_id」在上游 task 中无语义匹配 | 中 |
| E2E-F003-01 | WEAK_TERMINAL | seq 4 | 最后节点 task T027 无 outputs.messages/states 且 main_fl | 中 |
| E2E-F004-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T028 缺少 prerequisites | 低 |
| E2E-F004-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T029 缺少 prerequisites | 低 |
| E2E-F004-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T039 缺少 prerequisites | 低 |
| E2E-F004-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T040 缺少 prerequisites | 低 |
| E2E-F004-01 | UNVERIFIABLE_PRECONDITION | seq 5 | seq 5 task T041 缺少 prerequisites | 低 |
| E2E-F004-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「threshold」在上游 task 中无语义匹配 | 中 |
| E2E-F004-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「date_range」在上游 task 中无语义匹配 | 中 |
| E2E-F004-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「anomaly_flags」在上游 task 中无语义匹配 | 中 |
| E2E-F004-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「problem_patterns」在上游 task 中无语义匹配 | 中 |
| E2E-F004-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「improvement_plan」在上游 task 中无语义匹配 | 中 |
| E2E-F005-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T007 缺少 prerequisites | 低 |
| E2E-F005-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T021 缺少 prerequisites | 低 |
| E2E-F005-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T021 缺少 prerequisites | 低 |
| E2E-F005-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「subscription_plans」在上游 task 中无语义匹配 | 中 |
| E2E-F005-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「user_id」在上游 task 中无语义匹配 | 中 |
| E2E-F005-01 | WEAK_TERMINAL | seq 3 | 最后节点 task T021 无 outputs.messages/states 且 main_fl | 中 |
| E2E-F006-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T032 缺少 prerequisites | 低 |
| E2E-F006-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T033 缺少 prerequisites | 低 |
| E2E-F006-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T034 缺少 prerequisites | 低 |
| E2E-F006-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T035 缺少 prerequisites | 低 |
| E2E-F006-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「user_id」在上游 task 中无语义匹配 | 中 |
| E2E-F006-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「user_id」在上游 task 中无语义匹配 | 中 |
| E2E-F006-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「ban_reason」在上游 task 中无语义匹配 | 中 |
| E2E-F006-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「user_id」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T030 缺少 prerequisites | 低 |
| E2E-F007-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T031 缺少 prerequisites | 低 |
| E2E-F007-01 | UNVERIFIABLE_PRECONDITION | seq 3 | seq 3 task T047 缺少 prerequisites | 低 |
| E2E-F007-01 | UNVERIFIABLE_PRECONDITION | seq 4 | seq 4 task T048 缺少 prerequisites | 低 |
| E2E-F007-01 | UNVERIFIABLE_PRECONDITION | seq 5 | seq 5 task T049 缺少 prerequisites | 低 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「metric_type」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「threshold」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「date_range」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 2→3 | 交接数据「user_segment」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 3→4 | 交接数据「experiment_config」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「report_type」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「date_range」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | MISSING_HANDOFF_DATA | seq 4→5 | 交接数据「format」在上游 task 中无语义匹配 | 中 |
| E2E-F007-01 | WEAK_TERMINAL | seq 5 | 最后节点 task T049 无 outputs.messages/states 且 main_fl | 中 |
| E2E-F008-01 | UNVERIFIABLE_PRECONDITION | seq 1 | seq 1 task T044 缺少 prerequisites | 低 |
| E2E-F008-01 | UNVERIFIABLE_PRECONDITION | seq 2 | seq 2 task T045 缺少 prerequisites | 低 |
| E2E-F008-01 | MISSING_HANDOFF_DATA | seq 1→2 | 交接数据「feedback_type」在上游 task 中无语义匹配 | 中 |

> 排序验证共发现 78 个链路问题

> 完整字段见 .allforai/use-case/use-case-tree.json
> 决策日志见 .allforai/use-case/use-case-decisions.json
