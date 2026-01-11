# Jackery Atlas

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

## 技术栈 (Vue 3 全家桶)

基于团队核心优势与架构匹配度，本项目坚定选择 **Vue 3 生态**。

| 层级 | 技术选型 | 说明 |
| --- | --- | --- |
| **Builder UI** | **Vue 3** (Composition API) | 利用响应式系统处理复杂的 Schema 编辑与拖拽 |
| **Framework** | **Nuxt 3** | 提供一流的 SSG 能力、文件路由与自动化导入 |
| **State** | **Pinia** | 类型安全的全局状态管理，替代 Vuex/Zustand |
| **Styling** | **TailwindCSS** | 原子化 CSS，提升构建效率与样式复用 |
| **Language** | **TypeScript** | 全链路类型安全，尤其是 Schema 定义 |

> **决策背景**：拒绝了 Shopify Hydrogen (React)，因为 Vue 的响应式模型更适合构建可视化编辑器，且符合团队现有的技术栈积累。

## Monorepo 结构设计（RFC-001）

```
repo/
 ├─ apps/
 │   ├─ builder/          # 可视化编辑器 (Vue 3 SPA)
 │   ├─ preview/          # 实时预览 iframe (Vue 3)
 │   └─ site-runtime/     # 生产站点 (Nuxt 3 SSG)
 ├─ packages/
 │   ├─ schema/           # Section / Block DSL (TS)
 │   ├─ renderer/         # JSON → Vue Render Engine
 │   ├─ shopify-adapter/  # Shopify Storefront API
 │   ├─ migrator/         # Theme / Liquid 迁移工具
 │   └─ utils/
 └─ infra/
     ├─ ci/
     ├─ cdn/
     └─ deploy/
```

## 核心原则

* **Schema First**：JSON Schema 是页面的唯一真理。
* **Static Output**：最终产物必须是纯静态 HTML，无 Node 运行时依赖。
* **Type Safe**：从 API 到 UI 组件的全链路 TypeScript 类型覆盖。

## MVP 验收标准

* 非开发人员可完成首页配置
* 产品页数据来自 Shopify
* 页面可被搜索引擎抓取
* Checkout 跳转 Shopify
* 构建后无 Node Runtime
