## 已确认前提

* 选择方案A：单一 monorepo（MVP快），但用强边界隔离平台/主题/能力包。

## 核心区分（明天就能按这口径讲）

* 平台工程（Platform）：Atlas Builder/Admin/Java API/发布系统/渲染器框架/Schema 规范。

* 主题工程（Theme）：品牌视觉与页面组件实现（Header/Footer/营销页等），可版本化。

* 能力包（Feature Pack）：可插拔业务能力（commerce、tracking、cookie-consent）。

* 站点实例（Site）：平台里的“配置+内容+选用 theme\@version + 启用的 feature 列表”，不是一套独立代码仓库。

## 仓库内目录与依赖方向（MVP强约束）

* `apps/atlas-*`：平台应用

* `packages/atlas-sdk`：平台给主题/能力包用的 types/hooks（唯一允许依赖的平台包）

* `themes/*`：多个主题包（按品牌/设计体系）

* `features/*`：能力包（commerce、tracking、cookie-consent）

* `sites/*`：仅保存站点配置样例/seed，不放站点业务代码

* 依赖规则：

  * themes/features 只能依赖 `packages/atlas-sdk` 等“SDK层”

  * 平台 apps/packages 不能依赖任何 themes/features

  * 发布 worker 构建时按站点选择 theme+features 进行静态生成

## 两类站点如何在平台里“装配”

* 品牌展示站：`theme + tracking + cookie-consent`

* 品牌展示+销售站：`theme + commerce + tracking + cookie-consent`

* 站点记录字段：`theme_id@version`、`enabled_features[]`、`content_version`、`config_version`。

## 已落地的主干文档入口（以此为准）

* 工程边界与装配（主干口径）：[07\_平台与站点工程边界（MVP方案A）.md](./02_Technical_Architecture/07_平台与站点工程边界（MVP方案A）.md)
* 顶层架构与装配摘要：[07\_技术架构文档.md](./02_Technical_Architecture/07_技术架构文档.md)
* SLA 与发布审计口径：[10\_SLA与发布体系（99.9\_10000页）.md](./02_Technical_Architecture/10_SLA与发布体系（99.9_10000页）.md)
* 发布治理闭环（审计/回滚）：[10\_发布审计与回滚流程.md](./03_DevOps_Risk/10_发布审计与回滚流程.md)
