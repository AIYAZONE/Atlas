# Atlas GitLab CI/CD 配置规范

## 1. 概览

Atlas 项目采用 **Serverless (Vercel)** 部署架构。GitLab CI/CD 主要负责代码质量检查、测试执行以及触发 Vercel 的部署钩子。

* **Vercel**: 托管前端 SPA (Builder/Admin) 和 Serverless Functions。

* **Supabase**: 托管数据库和 Auth，CI 仅负责 Schema 迁移脚本的执行。

***

## 2. 流水线阶段 (Stages)

```yaml
stages:
  - lint      # 代码风格与类型检查
  - test      # 单元测试与快照测试
  - deploy    # 部署至 Vercel (Preview/Prod)
```

## 3. Vercel 部署策略

由于 Vercel 深度集成了 Git 部署，我们采用 `vercel-cli` 进行手动触发以保持对流程的控制。

### 3.1 预览环境 (Preview)

* **触发条件**: Merge Request 更新

* **命令**: `vercel pull --yes && vercel build && vercel deploy --prebuilt`

* **输出**: 在 MR 评论中回写 Preview URL

### 3.2 生产环境 (Production)

* **触发条件**: `main` 分支合并

* **命令**: `vercel deploy --prod`

* **保护**: 需要 `manual` 确认步骤

***

## 4. 环境变量管理 (Variables)

* `AWS_ACCESS_KEY_ID`: S3/CloudFront 权限（Masked）。

* `SHOPIFY_API_KEY`: Shopify 接入凭证。

* `DATABASE_URL`: 用于集成测试的临时数据库地址。

***

## 5. 缓存优化

利用 GitLab Runner 的分布式缓存：

```yaml
cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store
```

