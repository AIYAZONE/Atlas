## 目标
- 为 Atlas 当前架构与工作流定义一组实用技能，覆盖建站、发布、治理与演示沟通。
- 输出对应指导文档内容（可直接落盘为多个 SKILL.md），待你确认后我来创建到 `.trae/skills/`。

## 技能清单（名称 / 作用 / 触发时机 / 主要输入输出）
### 1) publish-orchestrator
- 作用：创建发布任务、查询进度、重试/取消、执行版本指针切换与回滚。
- 触发：当用户发起“单页/全站发布”、“查看发布状态”、“回滚版本”。
- 输入：site_id、scope(single/all)、reason、target_version 或 change_set_hash。
- 输出：jobId、进度摘要、成功/失败报告、回滚确认。

### 2) site-creator
- 作用：在平台里创建站点实例，选择 theme@version、启用 features、初始化 i18n/locales。
- 触发：当用户需要“新建品牌站/新建品牌展示+销售站”。
- 输入：site_key、theme_id@version、enabled_features[]、locales、domain。
- 输出：站点配置清单、创建成功摘要与后续操作建议。

### 3) theme-registry-manager
- 作用：管理主题版本与能力包版本（登记、查询、设为可用/不可用），并生成发布可消费的 artifact 说明。
- 触发：当需要“升级 Header/Footer 版本”、“切换 theme 版本”、“上架/下架 feature pack”。
- 输入：theme_id、version、artifact_url 或 package 名称、变更说明。
- 输出：版本登记结果、可用性状态、供发布调度引用的版本列表。

### 4) i18n-key-manager
- 作用：管理 TranslationSchema 与翻译值（key 的定义/分组/变量约束、按 locale 的值），并提示增量发布范围。
- 触发：当用户“新增/修改翻译键”、“批量导入导出 i18n”。
- 输入：group、keys[]、variables[]、locales、storage_mode(flat/tree)。
- 输出：校验结果、更新清单、受影响页面集合建议。

### 5) schema-validator
- 作用：校验 Page/Section/Block 实例与 ComponentDefinition/SettingDefinition 的一致性（类型/约束/安全）。
- 触发：当用户“保存页面/批量检查页面完整性/预发布校验”。
- 输入：page_instance JSON、component_definitions、规则选项（html/liquid 策略）。
- 输出：错误列表、修复建议、可自动修复项、是否可发布标记。

### 6) preview-runner
- 作用：触发页面预览（Java API 转 Node Preview），并收敛预览地址与渲染耗时指标。
- 触发：当用户“查看预览/批量预览验收”。
- 输入：site_id、page_id、locale、device。
- 输出：预览链接、耗时指标、错误快照。

### 7) commerce-adapter-tester
- 作用：对 showcase+commerce 站点的 cart/checkout/webhook 做集成自测（限流与幂等策略演练）。
- 触发：当“上线前自测电商闭环”或“排障 429/回放失败”。
- 输入：storefront_api_key、scenarios（add-to-cart、checkout、webhook payload）。
- 输出：用例结果、限流/重试次数统计、幂等命中率、问题定位报告。

### 8) cdn-release-controller
- 作用：对版本化产物进行指针切换、可选边缘重写启停（只用于全局片段微改），并出具回滚预案。
- 触发：当“发布完成切换版本/快速回滚/评估边缘重写”。
- 输入：release_version、prev_version、rewrite_switch(bool)、risk_notes。
- 输出：切换结果、回滚步骤与 ETA、边缘重写风险提示。

### 9) audit-reporter
- 作用：生成发布审计报告（site_id、theme_version、feature_versions、content/config 版本与操作者）、导出供评审。
- 触发：当“上线评审/事故复盘/合规抽查”。
- 输入：site_id、time_range、filters。
- 输出：报告 Markdown/CSV、关键指标汇总与结论。

### 10) demo-guide
- 作用：根据“30 分钟演示提纲”，快速给出演示顺序与跳转链接（07/08/09/10 等）。
- 触发：当“准备架构演示/需要一键导航”。
- 输入：duration、audience、focus_sections。
- 输出：演示清单与链接、每段要讲的句子。

## 指导文档模板（每个技能的 SKILL.md 内容要点）
- name：技能唯一名（如 "publish-orchestrator"）
- description：简明描述“做什么 + 何时用”（200 字内）
- 内容结构：
  - 使用场景（触发条件）
  - 输入参数（字段/格式）
  - 输出内容（结构/示例）
  - 操作步骤（1-3 步）
  - 风险与限制（如权限、SLA 边界、只读/写操作说明）
  - 相关文档链接（07/08/09/10 等）

## 交付方式
- 我将根据上面的技能清单，逐个生成 SKILL.md 内容并创建到 `.trae/skills/<skill-name>/SKILL.md`。
- 你可以先确认名单与描述是否匹配你的团队流程；确认后我就批量落盘。