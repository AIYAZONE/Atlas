# Phase 3: 平台化、插件与生态 (Month 6-12)

> **目标**: 将 Atlas 转化为可扩展的 PaaS 平台，支持多租户隔离、插件化扩展以及与外部企业系统的深度集成。
> **前提**: Phase 2 业务功能已完备，系统需应对多站点/多品牌带来的规模化挑战。

## 1. 插件化架构 (Plugin Architecture)

### 1.1 核心机制
- [ ] **Plugin Loader**: 实现基于 `atlas-plugin.json` 的插件发现与加载机制。
- [ ] **UI Slots**: 在 Builder 编辑器中定义插槽（侧边栏、工具栏、设置面板），支持插件注入 Vue 组件。
- [ ] **Sandbox**: 实现插件逻辑的沙箱隔离，通过 `AtlasSDK` 暴露有限的 API 能力。

### 1.2 插件市场
- [ ] **Registry**: 建立内部插件注册中心，管理插件版本与元数据。
- [ ] **Installation Flow**: 实现“一键安装/卸载”插件的 UI 交互与数据变更逻辑。

---

## 2. 外部系统集成 (External Integration)

### 2.1 通用数据桥接 (Universal Data Bridge)
- [ ] **Adapter Interface**: 定义 `ICommerceAdapter`, `ICustomerAdapter` 标准接口。
- [ ] **ERP Integration**: 开发 SAP Adapter 原型，拉取实时库存与价格。
- [ ] **CRM Integration**: 开发 Salesforce Adapter，同步会员等级与权益。

### 2.2 数据同步与聚合
- [ ] **BFF Layer**: 在 Java 后端实现数据聚合层，合并 Shopify 商品数据与 ERP 库存数据。
- [ ] **Async Sync**: 引入 RabbitMQ/Kafka，异步处理非实时数据的双向同步。

---

## 3. 多租户与安全 (Multi-Tenancy & Security)

### 3.1 资源隔离
- [ ] **RLS Policy**: 在 PostgreSQL 中实施 Row Level Security，按 `site_id` 强制隔离数据。
- [ ] **S3 Partitioning**: 重构 S3 存储路径，按 `brand/site` 进行物理隔离。

### 3.2 权限与审计
- [ ] **RBAC**: 实现细粒度的角色权限控制（如：内容编辑、发布管理员、开发者）。
- [ ] **Audit Log**: 全链路记录敏感操作（发布、配置变更、数据导出），支持审计查询。

---

## 4. 规模化构建 (Scale Build)

### 4.1 构建效率
- [ ] **Remote Caching**: 启用 Turborepo 远程缓存，加速 CI/CD 构建。
- [ ] **Partial Build**: 实现仅重新构建受影响页面的局部发布策略。

### 4.2 实验平台
- [ ] **A/B Testing**: 集成 A/B 测试 SDK，支持组件级变体测试。
