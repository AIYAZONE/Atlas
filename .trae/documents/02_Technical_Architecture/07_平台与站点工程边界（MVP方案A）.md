# 平台/主题/能力包/站点实例：MVP 方案A工程边界与装配

## 1. 背景与目标
- Atlas 是平台能力：用于创建多个站点，并发布为面向消费者的外部静态站点。
- 站点来自平台内的模板与组件搭建生成，但仍会包含 C 端站点独有业务逻辑（促销、埋点、合规、A/B、个性化等）。
- 目标：在一个 monorepo 内，清晰区分“平台工程”与“站点（主题/能力）工程”，让多站点、多主题可规模化交付与回滚。

## 2. 四个核心概念（必须区分）
### 2.1 Platform（平台工程）
平台提供“建站与发布能力”，跨站复用，变更应谨慎且可治理。
- Builder/Admin：可视化搭建、站点管理
- Java API：鉴权、RBAC、审计、发布入口、配置中心
- Schema/i18n 规范：字段类型、校验、翻译键定义与数据结构
- 渲染器框架层：把 Page JSON + 数据注入组件树并输出 HTML（不包含品牌组件实现）
- 发布体系：jobId 异步、版本化产物、原子切换、回滚

### 2.2 Theme（主题工程）
主题是“可复用的一套站点呈现与交互实现”，可版本化。
- 组件实现：Header/Footer、营销页组件、基础布局、主题样式与资源
- 站点体验逻辑：动效、交互、SEO 模板、页面级结构
- 主题配置：色板、字体、导航样式、组件默认 preset

### 2.3 Feature Pack（能力包）
能力包是“可插拔业务能力”，用于装配不同类型站点。
- `tracking`：埋点框架与事件规范
- `cookie-consent`：合规弹窗、地域策略、同意态持久化
- `commerce`：展示+销售能力（PDP/PLP/cart/checkout 相关 UI 与数据适配）

### 2.4 Site（站点实例）
站点实例不是一套独立工程，而是平台中的“配置 + 内容 + 选用版本”的组合体。
- `site_id`
- `theme_id@version`
- `enabled_features[]`（如 `["tracking","cookie-consent"]` 或加上 `commerce`）
- `content_version`（页面内容哈希/版本）
- `config_version`（导航/域名/地区策略等）

## 3. 两类站点怎么装配（你当前需求的直接答案）
### 3.1 品牌展示类站点（多个）
- 默认装配：`theme + tracking + cookie-consent`
- 典型页面：品牌首页、产品集合展示页、活动落地页、内容页

### 3.2 品牌展示 + 销售类站点（多个）
- 默认装配：`theme + commerce + tracking + cookie-consent`
- 额外能力：PDP/PLP、价格库存展示、促销信息、购物车与结算跳转（由平台 Java 统一代理外部电商能力）

## 4. 工程组织（方案A：单一 monorepo，强边界隔离）
### 4.1 目录建议
- `apps/atlas-builder`：平台编辑器
- `apps/atlas-admin`：平台管理后台
- `apps/atlas-api`：Java API（对外唯一入口）
- `packages/atlas-sdk`：平台对主题/能力包提供的类型与 hooks（唯一允许依赖的平台 SDK）
- `packages/schema`：Schema 与校验规范
- `packages/publisher`：发布 worker / 构建执行
- `themes/*`：主题包（按品牌/设计体系划分）
- `features/*`：能力包（commerce、tracking、cookie-consent）
- `sites/*`：站点 seed/示例配置（不放业务代码）

### 4.2 依赖方向（必须强制）
- themes/features 只能依赖 `packages/atlas-sdk`（以及必要的通用工具包）。
- 平台 apps/packages 不能依赖任何 themes/features。
- 发布 worker 在构建时按站点选择 `theme@version + features@versions`，完成静态生成。

## 5. “C 端站点独有业务逻辑”放哪里（避免污染平台）
### 5.1 放主题里（适合：强品牌/强页面体验）
- 与视觉与页面结构强相关的逻辑：布局、SEO 模板、页面动效、组件交互。

### 5.2 放能力包里（适合：可复用的业务能力）
- commerce、tracking、cookie-consent、A/B、推荐、会员权益等。
- 判断准则：是否会被多个站点复用；是否希望按站点“开关化”。

### 5.3 平台只做“接口与治理”，不做“业务实现”
- 平台提供扩展点与运行时注入机制（SDK/hooks），并对发布/审计/回滚负责。
- 平台不直接承载站点业务组件实现，避免被某个站点需求拖着走。

## 6. 版本化与发布记录（支撑多站点治理）
- 发布审计记录建议包含：
  - `site_id`
  - `theme_id`、`theme_version`
  - `feature_versions`（每个 feature pack 的版本）
  - `content_version`、`config_version`
- 回滚即回到上一条“完整组合版本”，确保外部站点一致性。

