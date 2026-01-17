# Atlas 项目架构决策分析报告：Serverless 演进与成本优势

本报告旨在深入分析 Atlas 项目在 `feature/arch-serveless` 分支中所采取的架构决策，并总结其在部署与运维成本上的核心优势。

## 1. 核心架构决策：从 Java/AWS 转向 Serverless (ADR 007)

在项目启动阶段，Atlas 团队做出了一个关键的战略调整：**在 MVP 阶段放弃原定的 Java Spring Boot + AWS ECS 路线，转而采用 Supabase + Vercel 的 Serverless 架构**。

### 1.1 决策背景与动机
*   **掌控力与质量保证**：架构师的核心优势在于前端与全栈（Node/Vue）。转向 Serverless 后，架构师能够深度 Review 每一行 TypeScript 代码和 SQL Schema，消除了 Java 后端开发中的“黑盒风险”。
*   **交付速度压力**：业务方要求在 8 周内交付。Serverless 方案省去了 VPC、IAM、CI/CD 等基础设施的繁琐搭建过程，实现了“Day 1 开发”。
*   **资源优化**：在后端资源稀缺的情况下，利用前端团队的 TypeScript 能力实现全栈开发，极大缓解了人力瓶颈。

### 1.2 “逃生舱”计划：决策的可逆性
团队并未盲目追求 Serverless，而是设定了清晰的**迁移路径**：
*   **标准 PostgreSQL**：Supabase 本质是 PostgreSQL，数据结构保持标准性。
*   **触发条件**：当日均订单 > 1000 或需要复杂企业级集成时，启动 Java 重构。
*   **低迁移成本**：保持前端渲染逻辑不变，仅需替换 API 层并将数据导出至 AWS RDS。

---

## 2. 部署与运维成本优势总结

通过采用 Serverless 架构，Atlas 在部署和运维方面获得了显著的竞争优势：

### 2.1 部署成本 (Deployment Costs)
| 维度 | 传统架构 (Java + AWS) | Serverless 架构 (Supabase + Vercel) | 优势说明 |
| :--- | :--- | :--- | :--- |
| **基础设施搭建** | 需 1-2 周搭建 VPC/ALB/ECS/RDS | 开箱即用，分钟级配置 | **极速冷启动**，节省大量高薪人力成本。 |
| **CI/CD 复杂度** | 需编写复杂的 Dockerfile 与 Jenkins/GitLab 脚本 | Vercel 原生集成，Git Push 即可部署 | **自动化程度高**，降低了 DevOps 门槛。 |
| **环境一致性** | 需手动管理开发/测试/生产环境配置 | 预览分支 (Preview Branches) 自动生成 | **零成本环境隔离**，提升测试效率。 |

### 2.2 运维成本 (Operational Costs - NoOps)
*   **零数据库运维**：Supabase 托管了 PostgreSQL 的备份、扩容和高可用，团队无需关注数据库底层的补丁升级或性能调优。
*   **按需扩缩容**：Vercel Edge Functions 和 Supabase 自动处理并发流量，无需预估实例数量或配置复杂的 Auto Scaling 策略。
*   **安全治理简化**：利用 **PostgreSQL RLS (Row Level Security)** 在数据库层面强制执行多租户隔离，减少了应用层鉴权逻辑的维护工作量。
*   **监控集成**：内置的日志和指标监控，省去了搭建 Prometheus/Grafana 等监控体系的初期投入。

### 2.3 财务成本 (Financial Impact)
*   **MVP 阶段低成本**：在低流量阶段，Serverless 方案的月支出（约 $20-$50）远低于 AWS 基础组件（NAT Gateway + ALB + RDS）的最低消费（约 $100+）。
*   **按量计费**：避免了为闲置资源付费，实现了真正的“Pay-as-you-go”。

---

## 3. 结论

Atlas 项目的 `feature/arch-serveless` 分支不仅是一次技术选型的更迭，更是一次**以业务交付为导向的架构治理实践**。通过牺牲一定的供应商独立性（Vendor Lock-in），换取了极高的交付速度和架构师的绝对掌控力。同时，通过“逃生舱”计划保留了未来向企业级 Java 架构平滑演进的能力，实现了**速度、安全与成本**的最佳平衡。
