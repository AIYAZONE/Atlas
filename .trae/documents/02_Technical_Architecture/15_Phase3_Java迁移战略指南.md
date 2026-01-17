# Phase 3: Java 迁移战略指南 (Migration Strategy)

> **目标**: 在 MVP (Serverless) 阶段通过严格的工程规范，确保未来向 Phase 3 (Java + AWS) 的平滑迁移，避免重写级重构。
> **核心思想**: **Decouple (解耦)** —— 将业务逻辑与 Supabase 基础设施解耦。

---

## 1. 数据库层 (Data Layer)

### 1.1 Schema 标准化
- **规范**: 仅使用标准 PostgreSQL 特性。
- **禁止**: 
  - 依赖 Supabase 特有的 `auth.users` 表进行强外键关联（Java 迁移后 Auth 系统会变）。
  - 使用 Supabase Storage 的 SQL 扩展功能。
- **迁移策略**:
  - 在 Java 迁移时，使用 `pg_dump` 导出数据结构与内容。
  - 用户 ID (UUID) 保持不变，确保数据关联性在切换 Auth Provider 后依然有效。

### 1.2 存储过程与触发器
- **规范**: **禁止**编写复杂的 PL/pgSQL 业务逻辑。
- **原因**: 业务逻辑应在应用层（Java/Node）实现，数据库层逻辑难以测试且迁移成本极高。
- **例外**: 仅允许简单的 `updated_at` 自动更新触发器。

---

## 2. API 接口层 (Interface Layer)

### 2.1 前端调用封装 (Adapter Pattern)
前端严禁直接依赖 `supabase-js` 进行业务交互。必须封装一层 Service Adapter。

**错误示范 (Direct Coupling):**
```typescript
// components/OrderList.vue
const { data } = await supabase.from('orders').select('*');
```

**正确示范 (Decoupled Service):**
```typescript
// services/order-service.ts
export const getOrders = async () => {
  // MVP 阶段：调用 Supabase
  return await supabase.from('orders').select('*');
  
  // Phase 3 阶段：只需修改此处，调用 Java API
  // return await fetch('/api/v1/orders');
}
```
**收益**: 迁移时，只需重写 `services/` 目录下的实现，UI 组件层 **零感知**。

### 2.2 API 契约 (Contract First)
- **规范**: Edge Functions 的输入输出必须符合 RESTful 标准，不要直接透传 Supabase 的错误对象。
- **工具**: 使用 TypeScript Interface 定义所有 API 的 Request/Response 结构，这将在未来直接转化为 Java POJO 类。

---

## 3. 鉴权与用户层 (Auth Layer)

### 3.1 JWT 标准化
- **现状**: Supabase 使用标准 JWT (HS256)。
- **迁移目标**: Keycloak / Spring Security (RS256)。
- **策略**: 
  - 前端获取 Token 后，仅通过 `Authorization: Bearer <token>` 头传递给后端。
  - 不要在前端解析 JWT 的私有 Claims（如 `app_metadata`），仅依赖 `sub` (UserID) 和 `exp`。

### 3.2 用户数据同步
- **挑战**: Supabase `auth.users` 表不可直接导出。
- **对策**: 
  - 维护一张独立的 `public.profiles` 表，存储所有业务相关的用户信息（昵称、头像、角色）。
  - 迁移时，只需将 `profiles` 表迁移至新库，Auth Provider 的切换仅需让用户重置密码或重新登录。

---

## 4. 业务逻辑层 (Business Logic)

### 4.1 逻辑下沉 (Edge Functions as Proto-Services)
- **规范**: 任何涉及“计算”、“校验”、“事务”的逻辑，必须写在 Vercel Edge Functions 中。
- **映射关系**:
  - MVP: `Edge Function (TypeScript)` -> Phase 3: `Java Service (Spring Boot)`
  - MVP: `Supabase RLS` -> Phase 3: `Java Security Filter`

### 4.2 单元测试 (Testable Logic)
- **要求**: 核心业务逻辑（如价格计算、折扣应用）必须抽离为纯 TypeScript 函数，并编写 Vitest 测试用例。
- **收益**: 这些测试用例可以直接用于验证 Java 重写后的逻辑是否正确（输入输出一致性测试）。

---

## 5. 迁移触发检查清单 (Migration Checklist)

当满足以下任一条件时，启动 Java 迁移计划：

- [ ] **规模阈值**: 日均订单量 > 1000 或 日均 PV > 500,000。
- [ ] **成本阈值**: Supabase/Vercel 月账单超过 $500。
- [ ] **功能瓶颈**: 需要集成 SOAP 协议的旧版 ERP，或需要复杂的分布式事务支持。
- [ ] **合规要求**: 数据必须私有化部署在特定 VPC 内。
