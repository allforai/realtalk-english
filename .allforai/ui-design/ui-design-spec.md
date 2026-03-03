# UI 设计规格

> 风格: Material Design 3
> 生成时间: 2026-03-03T16:21:44Z
> 产品: 让每个人都敢开口说英语 — 通过场景对话×记忆曲线闭环，把哑巴英语变成自信表达

## 设计语言基础

### 配色系统

- 主色 (Primary): #6750A4
- 次色 (Secondary): #625B71
- 强调色 (Tertiary): #7D5260
- 背景: #FFFBFE
- 表面 (Surface): #FFFBFE
- 表面变体: #E7E0EC
- 功能色: 成功 #2E7D32 · 警告 #ED6C02 · 错误 #B3261E

### 排版

- Display: 57px / 400
- Headline: 32px / 400
- Title: 22px / 500
- Body: 16px / 400 / 行高 24px
- Label: 14px / 500
- 字体推荐: 'Roboto', 'Noto Sans SC', sans-serif

### 组件规范

- 圆角: 12px
- 间距系统: 4px 基准 (4/8/12/16/24/32)
- 按钮: Filled (主操作) / Outlined (次要) / Text (辅助)
- 卡片: Elevated (阴影) / Filled (填充) / Outlined (边框)
- 输入框: 默认 outlined，聚焦态主色边框
- 导航: Bottom navigation (C端) / Navigation rail (B端)

### 推荐组件库

- 首选: Flutter Material 3
- 备选: MUI (React)

---

## 界面规格

### 模块: 其他

#### 登录页（S001）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 登录 (Filled Button)
  - 注册 (Outlined Button)
  - 忘记密码 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 首页（S002）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 点击推荐场景 (Filled Button)
  - 查看连续天数详情 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景列表页（S003）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 筛选场景 (Filled Button)
  - 点击场景卡片 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景详情页（S004）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 开始对话 (Filled Button)
  - 返回列表 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### AI 对话界面（S005）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 发送文本消息 (Filled Button)
  - 录制语音 (Filled Button)
  - 结束对话 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 对话报告页（S006）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 查看详细报告 (Filled Button)
  - 再来一次 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 词汇复习页（S007）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 翻转卡片 (Filled Button)
  - 评分（Again/Hard/Good/Easy） (Filled Button)
  - 查看复习统计 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 成就与连续天数页（S008）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 恢复断签 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 通知中心（S009）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 点击通知 (Outlined Button)
  - 管理通知偏好 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 管理后台仪表盘（S010）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 查看指标 (Filled Button)
  - 设置预警阈值 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景列表（管理端）（S011）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 新建场景 (Filled Button)
  - 点击编辑 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景创建页（S012）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 保存草稿 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景编辑页（S013）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 保存修改 (Filled Button)
  - 提交审核 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 审核队列页（S014）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 查看审核详情 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景审核详情页（S015）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 批准发布 (Outlined Button)
  - 驳回 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### AI 质量监控页（S016）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 查看评分概览 (Filled Button)
  - 筛选低分对话 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 用户管理列表页（S017）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 搜索用户 (Filled Button)
  - 查看用户详情 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 用户详情页（S018）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 封禁用户 (Outlined Button)
  - 解封用户 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景包管理页（S019）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 场景标签管理页（S020）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 异常对话检测页（S021）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### Prompt 模板管理页（S022）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 发音分析页（S023）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 用户行为分析页（S024）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### A/B 测试管理页（S025）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 报告导出页（S026）[professional] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 订阅管理页（S027）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 系统设置页（S028）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 角色权限管理页（S029）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 投诉处理页（S030）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 用户反馈页（S031）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 注册页（S032）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 提交注册 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 重置密码页（S033）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 发送重置链接 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 新手引导页（S034）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 选择学习目标 (Outlined Button)
  - 跳过引导 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 付费墙页（S035）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 选择方案并支付 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 历史对话列表页（S036）[consumer] [core]

**界面目的**: 支撑关联任务

**功能类别**: 核心功能

**布局模式**: 单列卡片流

**主要操作**:
  - 点击查看对话 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 管理后台登录页（S037）[consumer]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 单列卡片流

**主要操作**:
  - 登录 (Filled Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转

#### 系统健康状态页（S038）[professional]

**界面目的**: 支撑关联任务

**功能类别**: 基本功能

**布局模式**: 侧边导航 + 内容区（表格/列表导向）

**主要操作**:
  - 查看状态 (Outlined Button)

**关键状态设计**:
  - 空态: 插图 + 引导文案 + CTA 按钮
  - 加载中: 骨架屏 (shimmer)
  - 错误: Snackbar (错误色) + 重试按钮
  - 成功: Snackbar (成功色) / 页面跳转


---

## XV 交叉验证：高严重度可用性问题

| 位置 | 问题 | 建议 |
|------|------|------|
| S001 | Missing error state for invalid credentials | Add inline error messages for form fields in addition to the Snackbar. |
| S005 | Missing state for processing/generating AI response | Add a specific loading state (e.g., typing indicator) for the AI response. |

## XV 交叉验证：设计一致性

### 不一致问题

- **首页, 管理后台仪表盘**: End-user home and admin dashboard likely require different navigation patterns and density but may share the same base template since no module distinction is defined.
- **场景列表页, 场景列表（管理端）**: User-facing content list and admin management list likely need different table/list treatments (read-only vs CRUD) but appear structurally identical in inventory.
- **AI 对话界面, 异常对话检测页**: Real-time conversational UI and admin monitoring screen have very different interaction models yet no differentiation in layout/system tokens is indicated.
- **成就与连续天数页, 用户行为分析页**: Gamified user progress screen and analytics dashboard both likely require distinct visualization density and chart styling but share the same design foundation.

### 缺失设计令牌

- **on_success**: Success states (e.g., achievements, approvals) need accessible foreground color on success backgrounds.
- **error_container**: Error banners, dialogs, and inline validation require container/background variants beyond a single error color.
- **warning_container**: Warning states (e.g., review queues, moderation alerts) need background + foreground pairings.
- **outline**: Dividers, input borders, and data tables require a neutral outline/border token not defined.
- **surface_container_levels**: Admin dashboards and nested cards require multiple elevation surface tokens (e.g., surface_container_low/high).
- **state_hover**: Web (MUI) requires hover state color tokens for buttons, list items, and table rows.
- **state_focus**: Accessible focus indicators are not defined for keyboard navigation.
- **state_disabled**: Disabled button/input foreground and background tokens are missing.

---

## 模式一致性记录

| Pattern Group | 对齐项目 | 调整说明 |
|--------------|---------|----------|
| scenario-approval | 状态标签颜色 | 审批流状态标签统一：待审=amber/yellow, 通过=green, 拒绝=red |
| scenario-crud | 操作按钮位置 | 统一到右上角主操作 + 行内次操作 (顶部操作栏+数据表格+跳转详情页编辑) |
