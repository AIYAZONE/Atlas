> 状态：已归档（该方案被新版“后端总体设计”取代）
## 关于 Lambda
- AWS Lambda 是无服务器函数计算服务：按需触发、自动扩缩、无需管理服务器
- 适合短时、无状态任务（如页面预览渲染、图像处理、Webhook 轻处理）
- 约束：执行时长/内存限制、冷启动延迟；不适用于长时间或高并发持续任务

## 修订原则
- 能用 TypeScript/Node 的模块尽量用 TS；Java 仅保留必要边界
- 保持前后分离与纯静态发布，S3 + CloudFront 不变

## 模块语言调整
- atlas-renderer：TypeScript（保持）
- atlas-builder：前端 TS；预览渲染优先用 Lambda + TS CLI（若不想用 Lambda，可改为 ECS Fargate 上的 TS 预览服务）
- atlas-publisher：编排用 Step Functions；构建 Worker 用 TypeScript（ECS Fargate 运行）
- atlas-commerce：TypeScript（Node/Fastify），对接 Storefront GraphQL + Admin Webhooks
- atlas-api（API 网关）：TypeScript（Fastify/Nest，REST + OpenAPI）
- atlas-auth：Keycloak；TS 中间件（OIDC/JWT）
- atlas-storage：TypeScript（pg/SQL；JSONB）；Redis/S3 抽象

## 部署与选项
- 预览实现：
  - 选项 A（推荐）：Lambda + TS CLI（低成本、按需、无服务器）
  - 选项 B：ECS Fargate 上的 TS 预览服务（无冷启动，适合稳定高并发）
- 其他：TS 服务与 Worker 运行于 ECS Fargate；静态站点 S3 + CloudFront；Keycloak 独立部署

## 文档更新范围
- 架构设计.md：模块职责与语言映射、部署图两种预览实现选项
- 技术架构文档.md：补充 Commerce/Publisher 的 API/Webhook；TS 数据层说明

## 迁移路径
- Phase A：落地 atlas-commerce（TS）与预览（选 A 或 B）；保留 Java 边界
- Phase B：publisher 协调迁移至 Step Functions + TS Worker；移除 Java 协调器
- Phase C：API 网关切换为 TS；逐步淘汰剩余 Java 模块

## 风险与权衡
- Lambda 冷启动 vs ECS 常驻：按业务特性选型
- TS 服务治理与性能优化需要经验；通过标准化日志/指标/限流解决

## 验收
- TS 服务（commerce/publisher/api/preview）稳定运行并达标
- 文档与实现一致，包含两种预览选项与明确职责边界
