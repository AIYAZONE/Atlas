# shopify-compatible-site-builder

## 项目目标

* 内部自用 Headless + Static Site Builder
* 与 Shopify Theme JSON 高度兼容
* 可视化编辑 + 纯静态发布
* 不依赖 Shopify Theme / Liquid Runtime

## 核心能力

* Shopify JSON Template → 前端组件渲染
* Section / Block Schema DSL
* 可视化 Builder（Undo / Draft / Publish）
* 静态构建 + CDN 发布

## 系统边界

* **Shopify**：继续负责 Product / Collection / Inventory / Checkout / Payment / Order
* **本系统**：负责 页面编辑、模板系统、静态站点生成、SEO、性能、CDN

## 技术栈（可替换）

> **不强制 React**，但以下是推荐矩阵

| 层级            | React 方案     | 非 React 可选             |
| ------------- | ------------ | ---------------------- |
| Builder UI    | React        | Vue 3 / Svelte         |
| Render Engine | React        | Preact / Solid / Astro |
| SSG           | Next / Astro | Astro / Eleventy       |
| State         | Zustand      | Pinia / XState         |

> 核心约束：**组件必须是可序列化、可静态渲染的函数组件模型**。

## Monorepo 结构设计（RFC-001）

```
repo/
 ├─ apps/
 │   ├─ builder/          # 可视化编辑器
 │   ├─ preview/          # 实时预览
 │   └─ site-runtime/     # 生产站点（SSG）
 ├─ packages/
 │   ├─ schema/           # Section / Block DSL
 │   ├─ renderer/         # JSON → UI Render Engine
 │   ├─ shopify-adapter/  # Shopify API / Webhook
 │   ├─ migrator/         # Theme / Liquid 迁移工具
 │   └─ utils/
 └─ infra/
     ├─ ci/
     ├─ cdn/
     └─ deploy/
```

## 关于“必须用 React 吗？”

**结论：不必须。**

### 什么时候用 React

* Builder 复杂交互
* 人才储备

### 什么时候不用 React

* 只做 SSG：Astro / Solid
* 更极致性能：Preact / Svelte

### 不可妥协的约束

* Render Engine 必须框架无关
* Schema / AST 是唯一真理

## MVP 验收标准

* 非开发人员可完成首页配置
* 产品页数据来自 Shopify
* 页面可被搜索引擎抓取
* Checkout 跳转 Shopify
* 构建后无 Node Runtime
