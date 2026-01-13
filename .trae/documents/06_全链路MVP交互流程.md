# Jackery Atlas MVP 全链路交互流程

## 概述
- 目标：在不改变既定 MVP（可视化搭建 + 纯静态发布 + 电商闭环）的基础上，明确端到端交互与系统边界。
- 参考文档：架构与路线 [07_向Strapi学习优化Atlas_架构与路线.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/07_%E5%90%91Strapi%E5%AD%A6%E4%B9%A0%E4%BC%98%E5%8C%96Atlas_%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%B7%AF%E7%BA%BF.md)、权限与安全 [07_权限矩阵与RLS策略模板.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/07_%E6%9D%83%E9%99%90%E7%9F%A9%E9%98%B5%E4%B8%8ERLS%E7%AD%96%E7%95%A5%E6%A8%A1%E6%9D%BF.md)、媒体与CDN [10_媒体与CDN策略规范.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/10_%E5%AA%92%E4%BD%93%E4%B8%8ECDN%E7%AD%96%E7%95%A5%E8%A7%84%E8%8C%83.md)、发布治理 [10_发布审计与回滚流程.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/10_%E5%8F%91%E5%B8%83%E5%AE%A1%E8%AE%A1%E4%B8%8E%E5%9B%9E%E6%BB%9A%E6%B5%81%E7%A8%8B.md)。

## 1. 站点初始化（Setup & Integration）
- 站点配置：填写 Shopify 域名与 API 密钥，保存到配置中心（只读给前端；写由边缘函数代理）。
- 全局组件：编辑 Header/Footer/Cookie Banner，写入 schema 真源并预览生效。
- 权限校验：Admin/Editor 可编辑；Publisher/Viewer 只读。

## 2. 内容生产（Content Creation）
- 新建页面：选择首页/产品页/集合页/活动页，生成内容条目（draft，version=1）。
- 拖拽构建：从组件库选择 Section/Component 放入 Dynamic Zone。
- 数据绑定：通过 Shopify 数据选择器绑定商品数据（标题/价格/图片）。
- 校验与预览：本地校验字段与关系，Preview 渲染器读取 schema+content 实时渲染。
- 保存：写入 schema 包（JSON）与数据库内容；版本号自增。
- 审核：提交审核进入工作流（Editor 发起，Publisher/Admin 审批）。
- 参考：数据流说明 [07_ContentTypeBuilder_数据流说明.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/07_ContentTypeBuilder_%E6%95%B0%E6%8D%AE%E6%B5%81%E8%AF%B4%E6%98%8E.md)。

## 3. 媒体上传与派生（Media & Derivatives）
- 上传：经 STS 或边缘函数直传 S3，写入 media 元数据表。
- 派生：触发队列生成多规格图（thumb/web/retina，webp/avif），写入变体键与哈希。
- 引用：编辑器保存或渲染时记录 media_ref；断联扫描定期提示清理。
- 访问：公开媒体走长缓存，私有媒体签名 URL；CDN 只刷新 HTML，不强刷静态资源。
- 参考：策略规范 [10_媒体与CDN策略规范.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/10_%E5%AA%92%E4%BD%93%E4%B8%8ECDN%E7%AD%96%E7%95%A5%E8%A7%84%E8%8C%83.md)。

## 4. 发布与部署（Build & Deploy）
- 即时预览：查看桌面与移动渲染效果；校验通过方可发起发布。
- 单页/全站发布：生成版本号（schema+content 哈希），构建静态 HTML。
- 上传：dist→S3（/releases/{version}）；路由清单记录文件与校验。
- 刷新：CloudFront Invalidate 刷新 HTML；静态资源走内容哈希不刷新。
- 审计：记录 actor/org/version/routes_count/duration/status；支持一键回滚。
- 参考：发布治理 [10_发布审计与回滚流程.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/10_%E5%8F%91%E5%B8%83%E5%AE%A1%E8%AE%A1%E4%B8%8E%E5%9B%9E%E6%BB%9A%E6%B5%81%E7%A8%8B.md)。

## 5. 电商购物车与结算（Cart & Checkout）
- 加购：前端调用边缘函数/Storefront API 更新购物车。
- 结算：生成 checkout webUrl 并跳转 Shopify。
- 状态：价格/库存读取可缓存，失败降级提示。
- 权限：匿名可加购；结算由 Shopify 承接。

## 6. 订单 Webhook 与入库（Order Sync）
- 回传：支付完成后，Shopify Admin Webhook 推送订单到边缘函数。
- 入库：写入规范化 orders/order_items/customers 表，关联 org_id。
- 查询：管理后台订单列表可筛选查看，维持业务闭环。

## 7. 国际化（i18n）
- 内容：字段按 locale 存储，slug/SEO 随语言；语言回退策略可选。
- 构建：按语言分层输出，路由加前缀。
- 验收：同一页面多语言可独立编辑与发布。

## 8. 权限与审批（RBAC & Workflow）
- 角色：Admin/Editor/Publisher/Viewer/Service；矩阵到资源与操作。
- RLS：按 org_id 隔离与发布只读，细粒度权限由工作流与后端网关保障。
- 审批：草稿→审核→发布→失效；发布/回滚需审批人确认。
- 参考：权限模板 [07_权限矩阵与RLS策略模板.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/07_%E6%9D%83%E9%99%90%E7%9F%A9%E9%98%B5%E4%B8%8ERLS%E7%AD%96%E7%95%A5%E6%A8%A1%E6%9D%BF.md)。

## 9. 插件生命周期钩子（Plugin Hooks）
- 注册：字段/组件/校验器/渲染器/数据源/发布钩子。
- 钩子：onRegister/onRender/onPublish/onAfterBuild。
- 应用：在渲染前注入数据、发布后生成额外产物或通知。
- 参考：扩展草案 [11_PluginAPI_草案与示例.md](file:///Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/11_PluginAPI_%E8%8D%89%E6%A1%88%E4%B8%8E%E7%A4%BA%E4%BE%8B.md)。

## 10. 可观测性与告警（Observability）
- 指标：构建耗时、上传速率、刷新条目、失败率、Webhook 成功率。
- 告警：失败阈值触发通知（邮件/IM），记录审计事件。
- 仪表盘：构建中心与订单同步面板集中展示。
