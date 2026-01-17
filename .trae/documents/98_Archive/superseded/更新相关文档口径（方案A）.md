## 结论（是否要更新）
需要更新。当前“方案A：平台/主题/能力包/站点实例”的装配与版本化口径已在主干文档里成立，但仍有几份“周边文档”沿用旧的发布审计字段或保留了“待执行”段落，会造成口径不一致。

## 必更文档（保证口径一致）
1) `/Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/区分平台工程与站点工程（Atlas）.md`
- 将“我将要在仓库里做的改动（你确认后执行）”改为“已落地的改动/入口”，并链接到：
  - `02_Technical_Architecture/07_平台与站点工程边界（MVP方案A）.md`
  - `02_Technical_Architecture/07_技术架构文档.md`（装配摘要段）
  - `02_Technical_Architecture/10_SLA与发布体系（99.9_10000页）.md`（审计口径段）

2) `/Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/03_DevOps_Risk/10_发布审计与回滚流程.md`
- 在“审计记录”里补齐装配组合字段：`site_id`、`theme_id/theme_version`、`feature_versions`、`content_version`、`config_version`。
- 在“回滚流程”里明确：回滚基于上一条审计记录的“完整装配组合版本”，避免部分回退造成站点不一致。
- 增加到主干口径文档与 SLA 文档的交叉链接，形成闭环。

3) `/Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/01_Product_Design/06_全链路MVP交互流程.md`
- 第 4 节“发布与部署”的“审计”字段从 `actor/org/version/routes_count/duration/status` 扩展为“装配组合版本审计”（保留原字段 + 增补 theme/feature/content/config 版本）。
- 引用发布治理文档时强调“组合版本审计/组合版本回滚”。

## 可选更新（提高可讲述性，不改也不影响一致性）
- `/Users/ht-2502/Documents/HB-Code/Atlas/.trae/documents/00_Project_Management/00_架构演示提纲_30分钟.md`
  - 在“架构全景”或“发布体系与SLA”部分加 1 条：多站点多主题装配口径入口（链接到 07_平台与站点工程边界）。

## 验证方式
- 完成上述修改后，做一次全文检索（audit/发布审计/theme_version/feature_versions 等关键字）确认没有遗留旧口径描述。
- 确认 INDEX 不需要额外补链（当前已包含主干文档入口）。

如果你确认该计划，我将按‘必更文档’先完成一致性修订，再做‘可选更新’。