# Content Type Builder 数据流说明 (Shopify 兼容版)

## 1. 核心数据模型

Atlas 采用 Shopify Theme 2.0 兼容的数据模型，以实现无缝迁移。

* **Component Definition** (`{% schema %}`):

  * `type`: 组件唯一标识 (e.g. `hero-banner`)

  * `settings`: 全局配置字段 (e.g. `title`, `background_color`)

  * `blocks`: 允许的子块类型定义 (e.g. `slide`)

  * `presets`: 默认预设配置

* **Section Instance** (Template JSON Section):

  * `type`: 引用 Component Definition

  * `settings`: 实际配置值 (Key-Value)

  * `blocks`: 子块实例 Map (Key: UUID, Value: BlockInstance)

  * `block_order`: 子块渲染顺序数组 (UUID\[])

* **Page Instance** (Template JSON):

  * `sections`: 页面内所有 Section 的 Map

  * `order`: Section 渲染顺序数组

## 2. 流程概览

Builder UI 编辑 → 实时 Schema 校验 → 乐观更新与预览 (`postMessage`) → 调用 Java API 保存（Postgres `pages` table）→ 触发 SSG 构建

## 3. 交互步骤详细

1. **初始化**: Editor 加载页面数据 (`PageInstance`) 和所有可用组件的 Schema (`ComponentDefinition[]`).
2. **编辑操作**:

   * **修改 Setting**: 更新 `section.settings[key]`，通过 `postMessage` 发送全量/增量数据给 Preview iframe。

   * **添加 Block**: 生成新 UUID，在 `blocks` map 中添加实例，并 push 到 `block_order`。

   * **排序**: 修改 `order` (Section) 或 `block_order` (Block) 数组。
3. **实时预览**:

   * Preview iframe 监听 `message` 事件。

   * Vue 组件接收新的 props (`settings`, `blocks`, `block_order`) 并触发响应式重绘。
4. **保存**:

   * Editor 将当前的 `PageInstance` JSON 提交到后端 API。

   * 后端进行 Schema 校验并存入 PostgreSQL。
5. **发布**:

   * 用户点击发布，触发发布任务（Java 调用 Node Worker 或投递队列）。

   * Builder Worker 拉取最新 Page Data，执行 `nuxt generate`。

## 4. 校验与约束

* **字段类型校验**: 确保 `settings` 值符合 Schema 定义的 `type` (e.g. number 必须是数字)。

* **数量限制**: 检查 `max_blocks` 限制。

* **引用完整性**: 确保 `block_order` 中的 ID 在 `blocks` 中存在。

## 5. 渲染数据流

* **输入**: `PageInstance` JSON

* **转换**:

  ```typescript
  // 伪代码：将扁平结构转换为渲染树
  const renderTree = page.order.map(sectionId => {
    const section = page.sections[sectionId];
    const orderedBlocks = section.block_order.map(blockId => section.blocks[blockId]);
    return { ...section, blocks: orderedBlocks };
  });
  ```

* **输出**: Vue 组件树 → 静态 HTML

## 6. 多语言数据流

* **定义**: 开发者定义 `TranslationSchema`。

* **配置**: 运营在 Editor 中修改翻译，存入 `site_locale_config`。

* **消费**: 应用启动时注入 `jds-i18n`，组件中使用 `$t('key')` 或 Schema 中的 `t:` 引用自动解析。
