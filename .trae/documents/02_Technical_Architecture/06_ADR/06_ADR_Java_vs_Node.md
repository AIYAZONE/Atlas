# ADR 006: 核心后端技术栈选型（Java vs Node.js）

> **⚠️ DEPRECATION WARNING (2025-01-16)**
> **本文档的结论仅适用于 Scale 阶段 (Phase 3+)。**
> **MVP 阶段 (Phase 1-2) 请遵循 [ADR 007: 架构路线再评估 - Serverless vs Java](./07_ADR_架构路线再评估_Serverless_vs_Java.md)。**

> **状态**: 已接受 (Accepted) -> **部分取代 (Superseded by ADR 007)**
> **日期**: 2024-12-25

你提到的那段（“Java 对外唯一入口 + Node 只做渲染/预览/构建发布”）就是我对你们奉行 MVP 理念下的**推荐方案**；可以直接按它作为最终口径推进。

## 要达成的最终口径（一句话）
- **对外后端 = Java**（统一鉴权/权限/CRUD/Webhook/业务编排）
- **渲染与发布链路 = Node/TypeScript**（Preview + Renderer + Publisher Worker），只在服务侧运行，前台仍保持“纯静态交付”。

## 我将做的文档统一改动（不改实现，只改架构描述与图）
### 1) 统一图表集（09_架构设计图表.md）
- 把所有 `NestJS` 节点/标题统一替换为 `Java Backend`（可标注 Spring Boot）。
- 在“系统整体分层架构图 / 组件图 / 前后端分离图 / 部署图”中明确：
  - Java：API、Auth、Commerce、Webhook、写 DB
  - Node：Preview、Publisher Worker、只读 DB、写 S3/刷新 CDN
- 保持你当前 Mermaid 渲染器的兼容子集（避免 `flowchart`、避免括号/斜杠/加号/HTML）。

### 2) 技术架构文档（07_技术架构文档.md）
- `Future 后端 (NestJS)` 改为 `MVP 后端 (Java)` 或 `后端（Java）`，并把“前端直连 DB”的表述改成“前端只调 Java API”。
- `Commerce 服务职责（NestJS）` 改为 `Commerce 服务职责（Java）`。

### 3) 后端总体设计（08_后端总体设计.md）
- 把“后续演进：NestJS + Prisma”调整为“后续演进：Java 企业级后端（Spring Boot 生态）”。
- 保留 Node/TS Worker 的定位（构建发布/渲染），强调它是内部子系统。

### 4) 权限与路线图等口径文件（轻量一致性修正）
- `07_权限矩阵与RLS策略模板.md` 里提到 `NestJS Guards` 的地方，改成 Java 等价（Spring Security/Policy）。
- `00_项目概览与路线图.md` 等提到“引入 NestJS 中间层(BFF)”的地方，改成“引入 Java BFF/网关”。

## 验证标准（改完即算完成）
- 文档中不再出现“Future: NestJS”作为主要后端口径；统一为“Java 对外 + Node 内部渲染构建”。
- 09 中所有关键图能在你当前 Mermaid 渲染器下正常渲染。
- “纯静态发布、前台无 Node Runtime”口径保持不变（Node 只在服务侧用于预览/构建）。

确认后我就按以上清单逐文件更新，并把所有图的命名同步到 Java+Node 的 MVP 最小混合方案。