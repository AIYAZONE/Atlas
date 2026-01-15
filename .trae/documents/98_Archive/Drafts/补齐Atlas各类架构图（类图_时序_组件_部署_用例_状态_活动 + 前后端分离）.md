## 你补充的要求：系统整体架构图（分层视角）
会新增一张“系统整体分层架构图（Layered Architecture）”，风格类似你给的示例：从上到下按层展示“用户/应用/能力/技术/基础设施”，并标出 Atlas 在每一层的核心组成与边界。

## 目标与范围
1. 补齐可直接落到文档里的架构图：系统整体分层架构图、类图、时序图、组件图、部署图、用例图、状态图、活动图。
2. 额外提供“前后端系统分离图”：在哪里分离、哪里连接、用什么接口/通道连接。
3. 同时覆盖两套形态：MVP（Supabase）与演进（NestJS/ECS），并在图中显式区分（避免混写）。

## 现状依据（将复用，保证图与文档一致）
- 顶层架构与接口/路由： [07_技术架构文档.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/02_Technical_Architecture/07_%E6%8A%80%E6%9C%AF%E6%9E%B6%E6%9E%84%E6%96%87%E6%A1%A3.md)
- 后端演进与部署形态： [08_后端总体设计.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/02_Technical_Architecture/08_%E5%90%8E%E7%AB%AF%E6%80%BB%E4%BD%93%E8%AE%BE%E8%AE%A1.md)
- 类型/数据模型真源： [shopify-compatible.ts](file:///Users/ht-2502/Documents/HB-Code/Atlas/packages/schema/src/shopify-compatible.ts)
- 仓库当前图主要使用 Mermaid，将继续用 Mermaid（flowchart/classDiagram/sequenceDiagram/stateDiagram-v2）。

## 将新增/补齐的图（按“从全局到细节”的阅读顺序）
### 1) 系统整体分层架构图（新增，符合你示例那种分层表达）
- 分层建议（可在图中用 subgraph 表达）：
  - 用户层：访客/消费者、运营/内容编辑、管理员/开发者
  - 接入层（渠道/端）：静态站点（Static HTML Runtime）、Builder/Editor、Admin
  - 应用层（应用子系统）：Preview、Publisher、Commerce API、Shopify Adapter、Auth
  - 能力层（核心能力域）：页面建模与Schema、渲染与构建、发布与CDN、i18n配置中心、交易闭环（Cart/Checkout/Order）
  - 技术与数据层：Postgres(JSONB)/RLS、Edge Functions、Redis/SQS/EventBridge（未来）、对象存储S3、Shopify API/Webhook
  - 基础设施与治理：CloudFront/CDN、ECS Fargate、监控日志（CloudWatch/OTel/Prom）、安全（OIDC/IAM/SSM）
- 图中会同时标注 MVP 与 Future 走向：
  - MVP：前端直连 Supabase（CRUD+RLS）+ Functions
  - Future：前端 → NestJS API（不再直连 DB），NestJS 下接 DB/队列/缓存

### 2) 组件图（逻辑/边界）
- Builder、Preview、Publisher、Static Site Runtime、Supabase（DB/Auth/PostgREST）、Edge Functions、Shopify API、CDN/S3 的关系。

### 3) 前后端分离图（边界与连接点，重点回答“哪里分离、哪里连接”）
- 分离边界：浏览器端（Builder/Admin/Runtime） vs 服务端（Supabase/Edge Functions/Worker/NestJS）。
- 连接点：Supabase Client（CRUD+RLS）、Functions Invoke、Shopify Proxy（GraphQL/REST）、Shopify Webhook、Worker 直连 DB、静态站点通过 CDN 交付。
- Phase 2/3 会把“前端直连 Supabase”替换为“前端请求 NestJS API”。

### 4) 用例图
- 参与者：访客、运营、管理员、构建系统（Worker/Orchestrator）、Shopify。
- 用例：编辑页面/保存草稿/预览/发布/访问页面/加购/结算/订单回写与查询。

### 5) 时序图（关键链路，至少 3 条）
- 编辑保存（含 RLS 权限拦截点）
- 预览（调用预览服务/函数，产出预览结果）
- 发布（触发构建→Worker→S3→CDN Invalidate）
- 交易闭环（Cart/Checkout→Webhook→入库/查询）

### 6) 类图（以现有 TS interface 为准）
- PageInstance / SectionInstance / BlockInstance
- ComponentDefinition / BlockDefinition / SettingDefinition / PresetDefinition
- i18n：TranslationGroup/Definition、SiteLocaleConfig、LocaleDictionary

### 7) 状态图
- 页面状态：draft/published/archived（或按文档现有字段命名）
- 构建状态：idle/queued/building/deployed/failed

### 8) 活动图
- 发布流水线：触发→拉取数据→渲染→上传→失效缓存→完成/失败（回滚/重试点）。

### 9) 部署图（两套）
- MVP：Supabase + Edge Functions + ECS Publisher Worker + S3/CloudFront
- Future：NestJS（ECS）+ RDS/Redis/SQS/EventBridge + S3/CloudFront（含 Shopify 适配层与 Keycloak）。

## 落地位置（文档组织方式）
- 在 [09_架构设计图表.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/02_Technical_Architecture/09_%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E5%9B%BE%E8%A1%A8.md) 增加“系统整体分层架构图”作为第一张图，并新增其余图的章节与 Mermaid 代码块，形成“统一图表集”。
- 在 [07_技术架构文档.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/02_Technical_Architecture/07_%E6%8A%80%E6%9C%AF%E6%9E%B6%E6%9E%84%E6%96%87%E6%A1%A3.md) 补上指向“图表集”的链接，避免重复维护。

## 质量校验
1. 每张图都能以 Mermaid 正常渲染（classDiagram/sequenceDiagram/stateDiagram-v2/flowchart）。
2. 命名与边界不与现有文档冲突；MVP 与 Future 的差异在图中明确标识。
3. “前后端分离图”必须能一眼看出：分离点、连接点、协议/调用方式。

确认这个计划后，我会按上述顺序把图补进文档，并确保全局分层图与你给的示例同类可读。