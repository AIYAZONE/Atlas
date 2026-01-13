## 目标

* **MVP 阶段**：采用 Supabase (BaaS) 快速落地，聚焦业务闭环，极速交付

* **后续阶段**：演进为“成熟、先进、广泛使用”的企业级 TypeScript 后端方案 (NestJS + Prisma)，部署在 AWS ECS Fargate

* 始终保持前后分离与纯静态发布，S3 + CloudFront 架构不变

## MVP 阶段：Supabase Serverless 架构

* **核心理念**：利用 Supabase 托管能力解决 90% 的 CRUD 与 Auth，仅用少量代码处理 Commerce 逻辑

* **架构映射**：

  * **Database**: Supabase Postgres (JSONB 存储 Schema)

  * **Auth**: Supabase Auth (GoTrue)，支持邮箱/社交登录

  * **API (CRUD)**: 前端 Builder (Vue 3) 直接调用 Supabase Client (PostgREST)，配合 RLS (Row Level Security) 控制权限

  * **Commerce**: **Supabase Edge Functions** (TypeScript/Deno)

    * 代理 Shopify Storefront API (Cart/Checkout)

    * 处理 Shopify Admin Webhooks (Order Sync)

  * **Publisher**: **ECS Task** (Node/TS CLI)，连接 Supabase DB 读取数据生成静态站

## 后续演进：企业级后端栈（NestJS + Prisma）

* **触发条件**：业务逻辑复杂度超越 BaaS 能力，或需要完全私有化部署

* **技术栈**：

  * 框架：NestJS（模块化、DI、Swagger、生态成熟）

  * 数据层：Prisma + 原生 SQL（接管 Supabase DB 或迁移至自建 RDS）

  * 缓存与队列：ioredis（ElastiCache）、AWS SDK（SQS/EventBridge）

  * 认证：Keycloak (替代 Supabase Auth)

* **迁移路径**：

  1. 引入 NestJS 作为中间层，接管前端对 DB 的直接访问
  2. 将 Edge Functions 逻辑迁移至 NestJS Commerce 模块
  3. (可选) 将数据导出至自建数据库

## 模块与项目结构（NestJS - Future）

* apps/

  * api-gateway：统一入口（REST + OpenAPI）、鉴权、路由编排

  * commerce：产品/价格/购物车/结算/订单 Webhook；Shopify Storefront GraphQL + Admin Webhooks 适配

  * preview：常驻预览服务（调用 TS 渲染库）

  * publisher-orchestrator：构建编排（接收队列消息、触发构建任务）

* libs/

  * renderer：TS 渲染库（前端/构建共享）

  * storage：Prisma 客户端与仓储抽象；部分复杂查询使用 SQL 封装

  * auth：OIDC/JWT 中间件与守卫（Guards）

  * adapters-shopify：防腐层（Anti-Corruption）

## 部署与运行

* 所有 NestJS 应用运行于 ECS Fargate；水平扩展；滚动发布

* 构建 Worker 仍使用 TS CLI（docker 化），由 SQS/EventBridge 触发；与 orchestrator 分离

* 预览为常驻 NestJS 应用（无冷启动），对接 renderer

* 静态站点：S3 + CloudFront；Route53/ACM；VPC/IAM/SSM（最小权限）

## 数据与事件

* PostgreSQL on EC2：规范化（orders/order\_items/customers/inventory）、JSONB（attributes/pricing rules）

* Redis：购物车/会话；短期缓存

* SQS/EventBridge：订单创建、支付状态、库存变更事件；死信队列与重试策略

## 演进路线（不含 Lambda）

* Phase 1：落地 api-gateway、commerce、preview（NestJS）；闭环（查看→加购→Checkout→订单）

* Phase 2：publisher-orchestrator + TS worker（ECS）；S3 上传与 CloudFront Invalidate；完善观测与告警

* Phase 3：按需拆分高吞吐模块（commerce/publisher）；引入 Step Functions（若编排复杂度需要）

* Phase 4：（后续）替代 Shopify 的 Catalog/Order；支付接入 PSP（Stripe/Adyen）保持合规（不持卡数据）

## 风险与缓解

* NestJS 学习曲线：提供脚手架与规范模板（模块/守卫/拦截器/管道）；从 api-gateway 开始迁入

* Prisma 与复杂 SQL：约定“80% Prisma + 20% SQL 封装”；统一在 libs/storage 管理

* 事件一致性与幂等：使用幂等键、重试与死信队列；关键路径设计为可回滚

## 文档修订（确认后执行）

* 架构设计.md：将后端栈更新为 NestJS；模块职责与部署图（ECS 常驻预览）

* 技术架构文档.md：API 契约（Swagger）、数据层（Prisma+SQL）、事件流（SQS/EventBridge）、观测指标

* 产品路线图.md：保留替代 Shopify 为后续里程碑；当前聚焦企业级稳定落地

## 验收标准

* NestJS 服务在 ECS 稳定运行（P95 延迟、错误率达标）；预览与构建链路可观测

* Commerce 闭环稳定；订单 Webhook 入库；告警与重试机制完善

* 文档与实现一致，清晰可维护，满足“成熟、先进、企业级、业界广泛使用”的诉求

