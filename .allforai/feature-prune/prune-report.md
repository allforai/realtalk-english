# 功能剪枝报告

策略: aggressive

## 总览

| 分类 | 数量 |
|------|------|
| CORE（必须保留）| 21 |
| DEFER（推迟）| 31 |
| CUT（移除）| 0 |

## DEFER 清单

| 任务 | 频次 | 理由 | 建议重评时间 |
|------|------|------|-------------|
| 注册账号 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=低；类别=basic；被业务流引用；护栏保护(basic基本功能+rules=2,exceptions=1)；策略=aggressive | 3个月后 |
| 退出登录 | 低 | 频次=低；场景=none；复杂度匹配=over_engineered；风险=低；类别=basic；护栏保护(basic基本功能)；策略=aggressive | 3个月后 |
| 查看历史对话列表 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；策略=aggressive | 3个月后 |
| 查看复习统计摘要 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 恢复断签连续天数 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=中；类别=core；护栏保护(risk=中+rules=2,exceptions=1)；策略=aggressive | 3个月后 |
| 查看成就列表 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；策略=aggressive | 3个月后 |
| 查看通知列表 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=basic；策略=aggressive | 3个月后 |
| 标记通知已读 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=basic；策略=aggressive | 3个月后 |
| 管理推送通知偏好 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=低；类别=basic；护栏保护(basic基本功能)；策略=aggressive | 3个月后 |
| 订阅付费方案 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=basic；被业务流引用；护栏保护(basic基本功能+risk=高+营收相关+rules=3,exceptions=2)；策略=aggressive | 3个月后 |
| 手动添加词汇到生词本 | 中 | 频次=中；场景=none；复杂度匹配=match；风险=低；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 提交场景审核 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=中；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 审核学习场景 | 中 | 频次=中；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 设置指标预警阈值 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=中；类别=core；被业务流引用；护栏保护(risk=中+rules=1,exceptions=1)；策略=aggressive | 3个月后 |
| 封禁用户 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=basic；被业务流引用；护栏保护(basic基本功能+risk=高+rules=4,exceptions=1)；策略=aggressive | 3个月后 |
| 解封用户 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=中；类别=basic；被业务流引用；护栏保护(basic基本功能+risk=中+rules=2,exceptions=1)；策略=aggressive | 3个月后 |
| 查看系统健康状态 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=basic；策略=aggressive | 3个月后 |
| 管理场景包 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；策略=aggressive | 3个月后 |
| 管理场景标签 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；策略=aggressive | 3个月后 |
| 管理 Prompt 模板 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=高；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 查看发音分析报告 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 管理订阅方案 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=basic；护栏保护(basic基本功能+risk=高+营收相关)；策略=aggressive | 3个月后 |
| 管理系统配置 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=basic；护栏保护(basic基本功能+risk=高)；策略=aggressive | 3个月后 |
| 处理用户投诉 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=中；类别=basic；被业务流引用；策略=aggressive | 3个月后 |
| 查看用户反馈 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=basic；被业务流引用；策略=aggressive | 3个月后 |
| 查看用户行为分析 | 中 | 频次=中；场景=secondary；复杂度匹配=match；风险=低；类别=core；被业务流引用；策略=aggressive | 3个月后 |
| 管理 A/B 测试 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=core；被业务流引用；护栏保护(risk=高+rules=2,exceptions=1)；策略=aggressive | 3个月后 |
| 生成/导出运营报告 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=低；类别=core；被业务流引用；护栏保护(rules=1,exceptions=1)；策略=aggressive | 3个月后 |
| 管理角色权限 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=高；类别=basic；护栏保护(basic基本功能+risk=高+rules=2,exceptions=1)；策略=aggressive | 3个月后 |
| 重置密码 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=中；类别=basic；护栏保护(basic基本功能+risk=中+rules=2,exceptions=2)；策略=aggressive | 3个月后 |
| 新手引导 | 低 | 频次=低；场景=secondary；复杂度匹配=over_engineered；风险=低；类别=core；被业务流引用；护栏保护(rules=2,exceptions=1)；策略=aggressive | 3个月后 |

## CORE 清单

| 任务 | 频次 | 理由 |
|------|------|------|
| 登录账号 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 刷新登录凭证 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 浏览学习场景列表 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看场景详情 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 发起 AI 对话 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 发送文本消息并接收 AI 回复 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 发送语音消息并获取发音评估 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 结束对话并查看报告 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 复习今日到期词汇卡 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看学习连续天数 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看个性化场景推荐 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 对话中自动收集生词 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 创建学习场景草稿 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 编辑学习场景 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看 AI 质量评分概览 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看低分对话并分析 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看核心指标仪表盘 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 搜索用户 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 查看用户详情 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 检测异常对话 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
| 获取当前用户信息 | 高 | 高频受保护（frequency=高）— 策略=aggressive |
