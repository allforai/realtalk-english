# RealTalk English — 项目结构报告

> 生成时间: 2026-02-28 | 模式: new | 来源: product-map.json

## 项目概览

| 配置项 | 值 |
|--------|-----|
| 子项目数 | 3 |
| Monorepo | 手动管理 (Python + TypeScript 混合) |
| 认证策略 | JWT |
| 模块数 | 14 |
| 任务数 | 45 |
| 角色数 | 7 |

## 子项目列表

### sp-001: api-backend (API 后端)

| 配置 | 值 |
|------|-----|
| 框架 | FastAPI + SQLAlchemy |
| 语言 | Python |
| 数据库 | PostgreSQL |
| 架构 | 三层架构 (Handler → Service → Repository) |
| 端口 | 8000 |
| 路径 | ./apps/api-backend |
| 模块 | 全部 14 个 (所有业务 API) |
| 角色 | R001-R007 (全部) |

**选型理由**: FastAPI async 原生支持 SSE streaming (TS001), Azure Speech SDK 有 Python 包 (TS002), FSRS 有 Python 包 (TS004)。三层架构因 CRUD 为主 + 外部 SDK 集成, 不需要 DDD 复杂度。

**Spike SDK 依赖**:
- TS001: `openai` + `langchain`
- TS002: `azure-cognitiveservices-speech-sdk`
- TS004: `py-fsrs`

---

### sp-002: admin-web (管理后台)

| 配置 | 值 |
|------|-----|
| 框架 | Next.js 14 (App Router) + Tailwind CSS |
| 语言 | TypeScript |
| 状态管理 | Zustand (分模块 store) |
| 服务端缓存 | TanStack Query |
| 端口 | 3000 |
| 路径 | ./apps/admin-web |
| 模块 | M001, M002, M007, M008, M009, M010, M011, M014 (8 个) |
| 角色 | R004 内容运营, R005 AI训练师, R006 数据运营, R007 系统管理员 |

**选型理由**: Next.js 匹配 React 生态, SSR 表格性能好。Zustand 轻量适合中型 admin。

---

### sp-003: mobile-app (移动端)

| 配置 | 值 |
|------|-----|
| 框架 | React Native + Expo |
| 语言 | TypeScript |
| 端口 | 8081 |
| 路径 | ./apps/mobile-app |
| 模块 | M001-M007, M011-M014 (11 个) |
| 角色 | R001 职场人士, R002 英语爱好者, R003 新移民 |

**选型理由**: RevenueCat Expo 原生支持 (TS003), expo-notifications 零配置推送 (TS006), Expo Go Preview API 加速开发。

**Spike SDK 依赖**:
- TS003: `react-native-purchases`
- TS006: `expo-notifications`

---

## 模块分配矩阵

| 模块 | 后端 | Admin | Mobile |
|------|:----:|:-----:|:------:|
| M001 场景对话 | ✅ | ✅ | ✅ |
| M002 发音纠正 | ✅ | ✅ | ✅ |
| M003 记忆曲线 | ✅ | - | ✅ |
| M004 游戏化与轻社交 | ✅ | - | ✅ |
| M005 学习档案与进度 | ✅ | - | ✅ |
| M006 角色场景推荐 | ✅ | - | ✅ |
| M007 订阅与付费 | ✅ | ✅ | ✅ |
| M008 运营数据看板 | ✅ | ✅ | - |
| M009 AI质量监控 | ✅ | ✅ | - |
| M010 用户管理与系统配置 | ✅ | ✅ | - |
| M011 注册登录与个人设置 | ✅ | ✅ | ✅ |
| M012 首次体验 | ✅ | - | ✅ |
| M013 推送与通知 | ✅ | - | ✅ |
| M014 用户反馈 | ✅ | ✅ | ✅ |
| **合计** | **14** | **8** | **11** |

**模块覆盖率: 14/14 = 100%**
