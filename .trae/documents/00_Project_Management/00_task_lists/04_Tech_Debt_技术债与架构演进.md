# Tech Debt & Architecture Evolution (Ongoing)

> **目标**: 持续偿还技术债务，保持架构的先进性与可维护性。
> **执行策略**: 每个 Sprint 预留 20% 的 Story Points 用于处理此类任务。

## 1. Schema 演进 (Schema Evolution)

### 1.1 迁移引擎
- [ ] **Migration Pipeline**: 实现 Schema 版本控制与自动迁移脚本执行器。
- [ ] **Snapshot Testing**: 建立 Schema 变更的快照测试，防止破坏性更新。

### 1.2 类型系统
- [ ] **Strict Types**: 将全项目 TypeScript 升级至 Strict Mode。
- [ ] **Shared Types**: 抽离 `packages/types`，统一前后端数据契约。

---

## 2. 自动化测试 (Testing)

### 2.1 覆盖率提升
- [ ] **Unit Test**: 核心工具类 (Utils, Parsers) 单元测试覆盖率 > 90%。
- [ ] **Component Test**: 使用 Cypress/Storybook 对基础 UI 组件进行交互测试。

### 2.2 视觉回归
- [ ] **Visual Regression**: 引入 Percy 或 Playwright 截图对比，监控 UI 意外变更。

---

## 3. 开发者体验 (DX)

### 3.1 CLI 工具链
- [ ] **Atlas CLI**: 开发 `atlas create theme` 等脚手架命令，加速新项目初始化。
- [ ] **Local Dev**: 优化 `docker-compose` 配置，实现一键启动完整本地环境（含 DB, MinIO）。

### 3.2 文档工程
- [ ] **Auto Docs**: 集成 TypeDoc/Swagger，自动生成 API 与 SDK 文档。
- [ ] **Storybook**: 完善组件库文档，提供在线交互 Playground。

---

## 4. 合规与安全 (Compliance)

### 4.1 隐私合规
- [ ] **Cookie Consent**: 升级 Cookie Banner，支持按地区动态加载策略。
- [ ] **Data Export**: 实现 GDPR 要求的数据导出与物理删除接口。

### 4.2 安全加固
- [ ] **Dependency Audit**: 定期运行 `npm audit` 与 Snyk 扫描。
- [ ] **Secret Management**: 迁移至 AWS Secrets Manager 管理敏感配置。
