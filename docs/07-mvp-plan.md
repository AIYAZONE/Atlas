# MVP 最小实现清单（2–4 周可落地）

> 目标：**4 周内跑通「编辑 → 预览 → 发布 → Shopify Checkout」完整闭环**，不是功能齐全，而是架构正确。

## 14.1 MVP 范围定义（必须 / 禁止）

### ✅ 必须支持

* 单站点（绑定 1 个 Shopify Store）
* 3 种页面类型
  * 首页（index）
  * 产品页（product）
  * 普通内容页（page）
* Section / Block JSON Schema
* Shopify 产品数据读取
* 静态 HTML 输出
* CDN 访问

### ❌ 明确不做（第一阶段）

* 多语言
* 多站点
* 权限系统
* 主题市场
* A/B Test
* 高级动画

## 14.2 MVP 架构最小切面

```
[ Builder (React) ]
        ↓ draft JSON
[ Preview Renderer ]
        ↓ publish
[ SSG Builder ] → [ Static HTML ] → CDN
        ↑
[ Shopify Storefront API ]
```

> 任何「非必要服务」一律不上，避免系统复杂度失控。

## 14.3 MVP 模块拆解与实现要点

### 模块 A：Schema & Render Engine（Week 1）

#### A1. Page / Section / Block 数据结构

```ts
PageSchema = {
  type: 'index' | 'product' | 'page'
  sections: SectionInstance[]
}

SectionInstance = {
  id: string
  type: string
  settings: Record<string, any>
}
```

#### A2. Render Pipeline

1. JSON → AST
2. AST → HTML（函数式渲染）
3. 注入 Shopify 数据

> 不做 Diff，不做缓存，**先跑通**。

### 模块 B：Builder（Week 1–2）

#### B1. Builder 页面结构

* 左：Section 列表（3–5 个内置）
* 中：实时预览 iframe
* 右：Settings Panel（自动生成）

#### B2. 状态模型（最小版）

```ts
EditorState = {
  draft: PageSchema
  published?: PageSchema
}
```

> ❗不实现 Undo，仅支持 Draft / Publish。

### 模块 C：Shopify Adapter（Week 2）

#### C1. 必要 API

* product(handle)
* product.images
* product.variants
* price

#### C2. 数据策略

* 编辑态：实时 API
* 构建态：Build-time 拉取

### 模块 D：静态构建 & 发布（Week 3）

#### D1. 构建流程

```
build()
 ├─ 拉取 Shopify 产品
 ├─ 读取 Page JSON
 ├─ Render HTML
 └─ 输出 /dist
```

#### D2. 目录结构

```
/dist
 ├─ index.html
 ├─ products/{handle}.html
 └─ pages/{slug}.html
```

### 模块 E：CDN & 上线（Week 4）

* Cloudflare Pages / S3 + CloudFront
* HTML 强缓存
* JS / CSS hash

## 14.4 MVP 内置组件清单（极简）

| Section        | 说明           |
| -------------- | ------------ |
| Hero           | Banner + CTA |
| ProductMain    | 标题 / 价格 / 图片 |
| RichText       | 文本           |
| Image          | 单图           |
| CollectionGrid | 产品列表         |

## 14.5 MVP 验收标准（必须同时满足）

* 非开发人员可完成首页配置
* 产品页数据来自 Shopify
* 页面可被搜索引擎抓取
* Checkout 跳转 Shopify
* 构建后无 Node Runtime

## 14.6 2–4 周人力拆分建议

| 角色      | 工作                      |
| ------- | ----------------------- |
| 架构 / 主程 | Schema + Render         |
| 前端      | Builder UI              |
| 后端      | Shopify Adapter + Build |

> **3 人即可推进，不建议超过 4 人。**

## 14.7 MVP 成功后的下一步

一旦 MVP 跑通，下一阶段只做三件事：

1. Undo / History
2. Theme / Liquid 迁移工具
3. 增量构建
