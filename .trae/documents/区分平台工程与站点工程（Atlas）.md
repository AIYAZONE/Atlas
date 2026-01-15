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

## 我将要在仓库里做的改动（你确认后执行）

1. 新增一份主干文档：《平台/主题/能力包/站点实例：MVP方案A工程边界与装配》
2. 在《07\_技术架构文档.md》补一段“多站点多主题装配”摘要与链接
3. 在《10\_SLA与发布体系（99.9\_10000页）.md》补充发布记录口径：包含 theme\_version/feature\_versions
4. 更新 INDEX.md：增加上述新文档入口

