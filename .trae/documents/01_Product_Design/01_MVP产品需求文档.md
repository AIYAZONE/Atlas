# Jackery Atlas MVP 产品需求文档

## 范围（必须/明确不做）

* 必须：单站点；首页/产品页/内容页；Section/Block JSON Schema；Shopify 产品数据读取；静态 HTML 输出；CDN 访问；购物车 + 结算 + 订单闭环（Shopify 打通）

* 明确不做：多语言/多站点/权限系统/主题市场/A-B Test/高级动画

## 用户故事（示例）

* 作为编辑者，我可以在组件库中拖拽 Section 到画布，并在右侧属性面板配置，从而生成首页内容

* 作为编辑者，我可以在产品页中绑定 Shopify 产品 handle，让渲染器展示标题/价格/图片

* 作为编辑者，我可以发布草稿并查看构建状态，完成后在 CDN 上访问到静态页面

* 作为用户，我可以将产品加入购物车、查看购物车、进入 Shopify Checkout 完成支付，订单在系统内可被记录与展示

## 验收标准

* 非开发人员可完成首页配置并发布

* 产品页数据来自 Shopify

* 页面可被搜索引擎抓取（静态 HTML）

* 购物车可用；Checkout 跳转 Shopify 并完成支付；订单通过 Webhook 进入系统并可查询

* 构建后无 Node Runtime

## 详细功能模块

### 用户角色
| 角色  | 注册方式 | 核心权限           |
| --- | ---- | -------------- |
| 编辑者 | 邮箱注册 | 页面编辑、预览、发布     |
| 管理员 | 邀请注册 | 系统配置、用户管理、站点设置 |

### 页面功能矩阵
| 页面名称  | 模块名称  | 功能描述                     |
| ----- | ----- | ------------------------ |
| 编辑器页面 | 组件库   | 提供Section/Block组件拖拽、组件搜索 |
| 编辑器页面 | 画布区域  | 实时预览iframe、组件选中、属性编辑     |
| 编辑器页面 | 属性面板  | 根据选中组件动态生成配置表单           |
| 预览页面  | 设备切换  | 桌面/平板/手机预览模式切换           |
| 发布管理  | 构建任务  | 触发静态构建、查看构建状态            |
| 站点管理  | 页面列表  | 页面创建、编辑、删除、复制            |
| 站点管理  | SEO设置 | 页面标题、描述、关键词配置            |

## 关键流程

```
[ Builder (Vue 3) ]
        ↓ draft JSON
[ Preview Renderer (Vue) ]
        ↓ publish
[ SSG Builder ] → [ Static HTML ] → CDN
        ↑
[ Shopify Storefront API ]
```

## 模块与接口（MVP）

* Schema & Render Engine

  * Page/Section/Block：JSON 模型与函数式渲染

  * Render Pipeline：JSON→AST→组件解析→静态 HTML

* Builder

  * 组件库/画布/属性面板；实时预览 iframe

  * 状态：draft、published（不做 Undo）

* Shopify Adapter

  * product(handle)/images/variants/price

  * 编辑态实时 API；构建态 build-time 拉取

* Commerce（Shopify Storefront API）

  * Cart API：创建购物车、添加/移除项、更新数量、获取总计

  * Checkout：获取 checkout webUrl 并跳转；支持折扣码与备注传递

  * Webhook（订单）：订单创建/支付成功推送到后端，持久化并可查询

* 构建与发布

  * build()：拉取产品→读取 Page JSON→渲染 HTML→输出 /dist

  * 目录：/dist/index.html、/dist/products/{handle}.html、/dist/pages/{slug}.html

## 非功能需求

* 性能：编辑器首屏 ≤3s；静态站点首屏 ≤1s；构建单页 ≤30s

* 安全：认证与 RBAC（后续）；最小权限的存储与发布

* 可访问性：WCAG 2.1 AA；语义化 HTML；键盘可达

* 合规：不在前端持久化敏感支付信息；订单由 Shopify 结算与托管

## 风险与边界

* Shopify API 限额与延迟；需缓存与退避

* 渲染与 Schema 严格一致性；通过文档与测试保障

* Checkout 最终页由 Shopify 控制；本系统通过 Webhook/客户登录实现订单查询闭环

