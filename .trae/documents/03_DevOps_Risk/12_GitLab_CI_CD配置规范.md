# Atlas GitLab CI/CD 配置规范

> 本文档定义了 Atlas 项目在 GitLab CI 上的流水线标准，确保代码质量与发布稳定性。

## 1. 流水线阶段 (Stages)

```yaml
stages:
  - lint
  - test
  - build
  - deploy-preview
  - deploy-prod
```

---

## 2. 核心任务定义

### 2.1 Lint & Type Check
```yaml
lint:
  stage: lint
  script:
    - pnpm install
    - pnpm lint
    - pnpm type-check
  only:
    - merge_requests
```

### 2.2 Unit Testing
```yaml
test:
  stage: test
  script:
    - pnpm test:unit
  artifacts:
    reports:
      junit: report.xml
```

### 2.3 Build (Dockerized)
使用 Docker 镜像确保构建环境一致。
```yaml
build:
  stage: build
  image: node:20-alpine
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
```

---

## 3. 部署策略

### 3.1 预览部署 (Preview Deployment)
- **触发条件**：每个 Merge Request。
- **目标**：独立的 S3 Path (e.g., `s3://atlas-preview/mr-$CI_MERGE_REQUEST_IID/`)。
- **反馈**：将预览 URL 以评论形式发回到 MR。

### 3.2 生产部署 (Production Deployment)
- **触发条件**：`main` 分支 Tag。
- **审核**：需要 Maintainer 手动确认。
- **原子切换**：更新 CloudFront Origin 或修改 S3 路径映射。

---

## 4. 环境变量管理 (Variables)

- `AWS_ACCESS_KEY_ID`: S3/CloudFront 权限（Masked）。
- `SHOPIFY_API_KEY`: Shopify 接入凭证。
- `DATABASE_URL`: 用于集成测试的临时数据库地址。

---

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
