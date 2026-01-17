# Supabase 安全与开发规范 (Security & Development Guide)

> **目标**: 确保在使用 Serverless 架构 (Supabase + Vercel) 时的安全性、数据一致性与未来可迁移性。
> **核心原则**: 所有的业务逻辑必须在服务端（Edge Functions/RLS）闭环，**严禁**客户端直接操作非用户私有数据。

## 1. 数据库访问策略 (RLS Policy)

Supabase 的核心安全机制是 PostgreSQL 的 Row Level Security (RLS)。

### 1.1 强制开启 RLS
- 所有新建的 Table 必须默认执行 `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`。
- 严禁使用 `service_role` key 在客户端绕过 RLS，该 Key 仅允许在 Vercel Edge Functions 中使用。

### 1.2 访问规则模板
- **Public Read (公开读)**: 适用于 `sites`, `pages` (已发布状态)。
  ```sql
  CREATE POLICY "Public sites are viewable by everyone" 
  ON sites FOR SELECT USING ( status = 'published' );
  ```
- **Owner Write (拥有者写)**: 适用于 `user_profiles`, `orders`。
  ```sql
  CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING ( auth.uid() = id );
  ```

---

## 2. 客户端开发规范 (Client-Side)

### 2.1 数据获取
- **推荐**: 使用 `useSupabase` 组合式函数封装数据请求。
- **禁止**: 在组件 `onMounted` 中直接编写复杂的 SQL 拼接逻辑。

### 2.2 敏感操作
- **禁止**: 客户端直接调用 `supabase.from('orders').insert(...)`。
- **强制**: 必须调用后端 API (Vercel Edge Function)，例如 `/api/checkout/create`。
  - 原因：需要服务端校验库存、计算价格、签名支付参数，这些逻辑不能暴露给前端。

---

## 3. 服务端开发规范 (Edge Functions)

### 3.1 职责边界
- **Vercel Edge Functions** (`/server/api/*`) 承担以下职责：
  - 支付网关签名 (Shopify/Stripe)
  - 敏感数据写入 (订单创建、库存扣减)
  - 第三方 API 密钥管理 (OpenAI, SendGrid)

### 3.2 环境变量
- 所有 API Keys (如 `SHOPIFY_ADMIN_TOKEN`) 必须存储在 Vercel Environment Variables 中，严禁硬编码。

---

## 4. 迁移友好性设计 (Migration Readiness)

为了确保未来能顺利迁移到 Java + RDS：

1.  **Schema First**: 数据库表结构变更必须通过 SQL Migration 脚本管理（存放于 `packages/database/migrations`），禁止在 Supabase Dashboard 手动随意修改。
2.  **No Supabase-Specific Types**: 尽量使用标准的 PostgreSQL 类型（JSONB, TEXT），避免过度依赖 Supabase 独有的 Extension。
3.  **API Decoupling**: 前端调用 API 时，路径应保持 RESTful 风格（如 `/api/v1/pages`），而非直接暴露 Supabase SDK 的调用细节。
