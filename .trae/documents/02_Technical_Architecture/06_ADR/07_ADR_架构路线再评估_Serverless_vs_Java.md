# ADR 007: 架构路线再评估 - Serverless (Supabase) vs Java (Spring Boot)

> **状态**: 提议中 (Proposed)
> **日期**: 2025-01-16
> **决策者**: 架构师 & 技术委员会
> **标签**: `Architecture`, `Backend`, `MVP`

## 1. 背景与痛点 (Context)

Jackery Atlas 项目正处于 MVP 启动阶段。原定的架构路线是 **Java Spring Boot + AWS ECS**。然而，在实际推进中发现了以下关键制约因素：

1. **架构师技术栈匹配度**: 架构师核心优势在前端与全栈 (Node/Vue)，对 Java 生态的深度治理（如 Spring Security, Maven, JVM 调优）掌控力较弱。
2. **团队配置**: 团队前端资源充足，但 Java 后端资源稀缺且单点依赖。
3. **MVP 交付压力**: 业务方期望在 8 周内看到可用的可视化编辑器与电商闭环。

我们需要重新评估：**是否应该在 MVP 阶段采用 Supabase + Vercel 的 Serverless 方案，以换取速度与掌控力？**

***

## 2. 选项对比 (Options)

### 选项 A: 坚持 Java + AWS (Current Plan)

* **架构**: Spring Boot API + PostgreSQL (RDS) + ECS Fargate + S3/CloudFront。

* **优点**:

  * **资产自有**: 代码与数据完全掌控，无 Vendor Lock-in。

  * **企业标准**: 符合 Jackery 现有的 IT 治理规范。

  * **生态成熟**: Java 在处理复杂电商逻辑（如订单状态机、支付网关对接）上有成熟模式。

* **缺点**:

  * **冷启动慢**: 需搭建 VPC, IAM, CI/CD, 数据库实例，预计耗时 1-2 周。

  * **黑盒风险**: 架构师无法深度 Review Java 代码，只能依赖单一后端开发者的自觉。

  * **运维重**: 需自行处理数据库备份、日志监控、容器扩缩容。

### 选项 B: 转向 Supabase + Vercel (Serverless)

* **架构**: Nuxt 3 (Fullstack) + Supabase (Auth/DB/Edge) + Vercel Hosting。

* **优点**:

  * **零运维 (NoOps)**: 鉴权、数据库、API 网关开箱即用，Day 1 即可开发业务。

  * **全栈掌控**: 架构师可直接 Review 基于 TypeScript 的后端逻辑和 PostgreSQL Schema。

  * **交付极速**: 省去 90% 的基础设施搭建时间，聚焦业务逻辑。

* **缺点**:

  * **Vendor Lock-in**: 深度依赖 Supabase 的 Auth 和 Realtime 能力，迁移成本非零。

  * **成本黑盒**: 随着流量激增，Serverless 账单可能不可控（但在 MVP 阶段概率极低）。

***

## 3. 深度权衡分析 (Trade-off Analysis)

### 3.1 掌控力维度

* **Java 路线**: 架构师 -> **失控**。对于核心的“数据模型实现”和“接口鉴权逻辑”，架构师难以通过代码审查发现隐患。

* **Supabase 路线**: 架构师 -> **掌控**。所有逻辑均为 JS/TS 或 SQL，架构师可亲自把关数据结构设计与安全策略 (RLS)。

### 3.2 迁移与可逆性

Supabase 本质是 **PostgreSQL** 的封装。

* 只要我们**不过度依赖** Supabase 的专有特性（如过度复杂的 Edge Functions），而是保持 Schema 的标准性。

* **未来迁移路径**: 将数据从 Supabase 导出 (pg\_dump) -> 导入 AWS RDS -> 用 Java 重写 API 层对接 DB。

* **结论**: 这是一个**可逆**的决策。

### 3.3 成本模型

* **MVP 阶段 (0-10k PV/day)**: Supabase/Vercel 的免费或 Pro 套餐 ($20/mo) 远低于 AWS NAT Gateway + ALB + RDS 的最低消费 ($100+/mo)。

* **Scale 阶段**: AWS 的边际成本优势才会显现。

***

## 4. 决策建议 (Recommendation)

鉴于**架构师对项目质量的最终责任**以及**MVP 的时效性要求**，建议：

1. **MVP 阶段 (Phase 1-2)**: **采用选项 B (Supabase + Vercel)**。

   * 利用 Supabase 快速落地 Auth 和 Database。

   * 利用 Nuxt 3 Server Routes 替代 Java API，实现轻量级后端。

   * **核心收益**: 架构师能看懂每一行代码，确保 Schema 设计不走样。

2. **设定“逃生舱” (Phase 3 触发条件)**:

   * 当日均订单量超过 1000 单，或需要集成复杂的 SAP/Salesforce 且 Node.js 库支持不佳时。

   * 启动 **Java 重构计划**：保持前端不变，仅替换后端 API 层，数据库迁移至 RDS。

***

## 5. 后续行动 (Next Steps)

如果接受此提议：

1. **文档回滚**: 恢复 `01_Phase1` 任务清单中关于 Supabase 的描述。
2. **基建调整**: 停止 AWS VPC 规划，注册 Supabase 组织账号。
3. **规范定义**: 制定《Supabase 使用规范》，严禁在客户端直接操作敏感数据，强制通过 Server Routes 或 RLS 访问。

