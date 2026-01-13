# 向 Strapi 学习优化 Atlas 的产品与架构（含 MVP 路线）

## 背景与目标
- 在不改变既定“Vue/Nuxt + Supabase + 纯静态发布 + 电商闭环”的 MVP 路线下，引入 Strapi 的成熟理念（内容类型、组件、动态区、媒体库、RBAC、插件、GraphQL），提升可配置性、安全性与演进能力。

## 核心理念（通俗解释）
- 内容类型（Content Type）：结构化数据模板（如文章、页面、产品），定义字段、校验与关系。
- 组件（Component）：可复用的子结构（如图文块/轮播），可嵌入到内容类型字段。
- 动态区（Dynamic Zone）：页面中的可插拔区域，允许放入多种组件，像乐高拼装。
- 媒体库（Media Library）：统一管理图片/视频等资源，提供元数据与多规格处理。
- RBAC（角色-权限）：按角色细化到内容类型与操作（读/写/发布），默认安全策略。
- 插件（Plugin）：在核心之外扩展字段、组件、校验、数据源与发布流程。
- API 模式：REST（写入/简单读）与 GraphQL（聚合/灵活查询）并存，前端友好。

## 现状映射与落地
- DSL 统一：现有 Section/Block DSL → 抽象为“内容类型 + 组件 + 动态区”，由 schema 包产出 JSON 作为唯一真源。
- 应用分层：builder 提供可视化建模与拖拽，preview 实时渲染，site-runtime 负责 SSG 输出。
- 数据与 API：Supabase/PostgREST 保留 CRUD；边缘函数承接 Shopify 代理与订单 Webhook；后续 NestJS 接管复杂编排。

## 渐进式改造（保持既定 MVP）
### Phase 1：内容模型统一 + RBAC 基线 + 媒体库（低风险优先）
- 内容：把 DSL 统一到 Content Type + Component + Dynamic Zone；支持草稿/发布与版本号。
- 权限：基于角色生成 RLS 策略模板（Admin/Editor/Publisher/Viewer/Service）。
- 媒体：S3 管理、上传即生成多规格（thumb/webp/avif），元数据入库，CDN 缓存策略。
- 验收：可视化建模能保存并渲染；不同角色操作边界正确；图片上传、引用与构建产物回滚可用。

### Phase 2：电商闭环与发布治理
- 购物车与结算：边缘函数代理 Storefront，checkout webUrl 跳转；价格/库存拉取缓存。
- 订单：Admin Webhook 入库到规范化表；订单查询与状态更新。
- 发布：构建产物版本化、审计日志、CloudFront 失效与一键回滚。
- 验收：购物车、结算、订单流程串通；发布有审计与回滚成功记录。

### Phase 3：i18n 与插件体系
- i18n：内容字段按 locale；slug/SEO 随语言；构建按语言分层输出与路由前缀。
- 插件：定义 Plugin API（字段/组件/校验/渲染器/数据源/发布钩子），隔离扩展与核心。
- 验收：同一页面多语言编辑与渲染正常；至少一个插件通过生命周期钩子接入可用。

### Phase 4：GraphQL（只读）与可观测性
- GraphQL 只读：启用 pg_graphql 或后续 NestJS GraphQL 做聚合查询，前端复杂视图更友好。
- 可观测性：发布耗时、构建错误、队列积压、函数失败率、审计事件指标看板。
- 验收：前端一个聚合视图走 GraphQL；监控面板可视、告警阈值生效。

## 时间与风险评估（对齐 4–6 周的现实性）
- 建议节奏：Phase 1（2 周）→ Phase 2（2 周）→ Phase 3（1–2 周）→ Phase 4（1 周并行/收尾）。
- 风险与缓解：
  - 团队技术储备/架构/细节未定 → 以 Schema 真源与 RBAC 模板先落地，减少不确定面；
  - 每阶段设验收用例与演示，严控范围避免蔓延。

## 成本与收益
- 成本：梳理模型与权限策略、媒体派生任务与发布版本化。
- 收益：统一数据与渲染抽象、默认安全、可插拔扩展，后续演进后端更平滑。

## 文档与 CLI
- 文档：内容模型规范、字段命名、校验与关系约定；发布与回滚流程手册；权限矩阵清单。
- CLI：atlas-cli 支持 init/generate/migrate/publish/seed；turbo 编排 lint/type-check/test。

## 后续演进（不影响 MVP）
- NestJS + Prisma 接管复杂鉴权与编排；REST + GraphQL 统一网关与 OpenAPI；事件驱动（SQS/EventBridge）；缓存层（Redis）。

## 交付物清单
- 文档：本文件（架构与路线），权限矩阵与 RLS 策略模板、媒体与 CDN 策略、发布审计与回滚流程、Content Type Builder 数据流、Plugin API 草案与示例。
