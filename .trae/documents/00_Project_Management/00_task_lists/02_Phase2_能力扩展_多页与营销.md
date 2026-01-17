# Phase 2: 能力扩展与营销增强 (Month 3-6)

> **目标**: 在 MVP 单页闭环的基础上，扩展多页面支持、增强营销组件能力，并初步引入性能优化与国际化基础。
> **前提**: Phase 1 MVP 核心链路已稳定上线。

## 1. 多页面系统 (Multi-Page System)

### 1.1 路由与模板绑定
- [ ] **Schema 扩展**: 在 `PageInstance` 中增加 `type` 字段 (home/product/collection/page/blog)。
- [ ] **路由层升级**: Nuxt 动态路由适配 `/collections/:handle` 和 `/blogs/:id`。
- [ ] **数据源绑定**: 扩展 `shopify-adapter` 支持 Collection 和 Blog 数据拉取。

### 1.2 落地页 (Landing Page) 构建器
- [ ] **空白画布模式**: 支持不继承全局 Header/Footer 的独立营销页。
- [ ] **SEO 增强**: 页面级 Meta Tags (Title, Description, OG Image) 可视化配置。

---

## 2. 营销组件库 (Marketing Components)

### 2.1 促销类组件
- [ ] **Countdown Timer**: 倒计时组件（支持绝对时间/相对时间）。
- [ ] **Coupon Popup**: 优惠券弹窗（支持复制 Code、集成 Klaviyo 表单）。
- [ ] **Announcement Bar**: 顶部通告栏（支持轮播、多样式）。

### 2.2 推荐与社交
- [ ] **Product Recommendations**: 基于 Shopify 推荐 API 的相关商品推荐。
- [ ] **Instagram Feed**: 接入 Instagram Basic Display API 展示图片流。

---

## 3. 性能优化 (Performance)

### 3.1 构建策略升级
- [ ] **ISR (Incremental Static Regeneration)**: 实现按页面粒度的增量构建（利用 Nuxt ISR 或自定义 Worker）。
- [ ] **Critical CSS**: 提取关键 CSS 内联，减少 FCP 时间。

### 3.2 资源优化
- [ ] **Image Lazy Load**: 全站图片实现原生懒加载 + 占位图。
- [ ] **Font Optimization**: 字体子集化 (Subsetting) 与预加载策略。

---

## 4. 多语言基础 (i18n Foundation)

### 4.1 架构准备
- [ ] **Config Center**: 建立 `SiteLocaleConfig` 表，存储多语言配置。
- [ ] **Runtime 集成**: 引入 `jds-i18n` 或 `vue-i18n`，实现前端文案替换。

### 4.2 路由策略
- [ ] **Sub-path Routing**: 实现 `/en-us/`, `/jp/` 等子路径路由分发。
- [ ] **Hreflang**: 自动生成多语言 SEO 标签。
