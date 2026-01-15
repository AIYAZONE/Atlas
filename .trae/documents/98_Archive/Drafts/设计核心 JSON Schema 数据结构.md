# Schema 优化设计方案 (Shopify 兼容版)

> 已合并至主干规范文档：[07_Schema设计规范_Shopify兼容版.md](../../02_Technical_Architecture/07_Schema设计规范_Shopify兼容版.md)。本文件仅作历史参考，不再维护。

## 1. 核心策略：对齐 Shopify DSL
为了最大化未来的迁移便利性，我们的 Schema 设计将**严格对齐 Shopify Theme 2.0 的数据结构**。这样做的好处是：
1.  **迁移零成本**：可以直接导入 Shopify 导出的 `templates/*.json` 文件，甚至无需转换。
2.  **概念复用**：团队成员熟悉的 Settings/Blocks/Presets 概念直接沿用。
3.  **双向互通**：未来如果需要回退到 Shopify，数据结构也是兼容的。

## 2. 优化后的数据结构定义 (TypeScript)

### 2.1 页面 (Page) -> 对应 Shopify `templates/*.json`
Shopify 的 JSON 模板结构由 `sections` 对象（定义所有 section 数据）和 `order` 数组（定义渲染顺序）组成。我们在 Atlas 中可以采用更现代的数组结构，但字段名保持兼容。

```typescript
interface Page {
  id: string;
  name: string;        // 对应 Shopify template name
  type: string;        // 页面类型 (index, product, page)
  sections: Record<string, SectionInstance>; // 扁平化存储所有 Section
  order: string[];     // Section ID 的渲染顺序
  // ... 其他 Atlas 专属元数据 (SEO, status 等)
}
```

### 2.2 Section 实例 (SectionInstance)
这是最关键的兼容点。Shopify 的 Section 实例结构如下：
```json
{
  "type": "hero-banner",
  "settings": { "title": "Hello" },
  "blocks": {
    "block-1": { "type": "slide", "settings": { "image": "..." } }
  },
  "block_order": ["block-1"]
}
```

**Atlas 定义：**
```typescript
interface SectionInstance {
  type: string;        // 对应 ComponentDefinition.key (如 "hero-banner")
  disabled?: boolean;  // Shopify 支持禁用 section
  settings: Record<string, any>; // 扁平化的配置项
  blocks?: Record<string, BlockInstance>; // 扁平化存储子 Block
  block_order?: string[]; // Block ID 的渲染顺序
}

interface BlockInstance {
  type: string;        // 对应 Block Definition key
  settings: Record<string, any>; // Block 自身的配置
}
```

### 2.3 组件定义 (ComponentDefinition) -> 对应 Shopify `{% schema %}`
我们将 Shopify 的 Liquid Schema 映射为 TypeScript 接口，作为编辑器的配置源。

```typescript
interface ComponentDefinition {
  type: string;        // 唯一标识 (如 "hero-banner")
  name: string;        // 显示名称
  class?: string;      // 容器类名 (Shopify 兼容)
  limit?: number;      // 限制添加次数
  settings: SettingDefinition[]; // 全局配置
  blocks?: BlockDefinition[];    // 允许的子 Block 类型
  presets?: Preset[];            // 默认预设
}

interface BlockDefinition {
  type: string;        // Block 标识 (如 "slide")
  name: string;
  limit?: number;
  settings: SettingDefinition[];
}

interface SettingDefinition {
  type: SettingType;   // Shopify 原生类型
  id: string;          // 对应 settings key
  label: string;
  default?: any;
  options?: Array<{ label: string; value: string }>; // for select/radio
  info?: string;       // 帮助文本
}

// 严格对齐 Shopify 原生 Setting 类型
type SettingType = 
  | 'text' | 'textarea' | 'richtext' 
  | 'number' | 'checkbox' | 'radio' | 'select'
  | 'color' | 'image_picker' | 'video_url' | 'url'
  | 'html' | 'liquid'; // 高级类型 (Atlas 可暂不支持 liquid)
```

## 3. 迁移友好性分析
| Shopify 概念 | Atlas 概念 | 迁移路径 |
| :--- | :--- | :--- |
| `templates/index.json` | `Page` | **直接导入**：只需解析 JSON，Atlas 后端可直接存储 `sections` 和 `order`。 |
| `settings_data.json` | `ThemeSettings` | **直接导入**：全局主题设置 (Colors, Typography) 可直接映射。 |
| `{% schema %}` | `ComponentDefinition` | **脚本转换**：编写一个简单的 Parser，将 Liquid 文件中的 Schema JSON 提取出来，直接转为 Atlas 的 TS/JSON 定义。 |
| `{{ section.settings.id }}` | `props.settings.id` | **代码重写**：Vue 组件中直接使用 `props.settings` 访问数据，逻辑完全一致。 |

## 4. 行动计划 (调整后)
1.  **Write**: 创建 `packages/schema/src/shopify-compatible.ts`，定义上述**严格兼容**的数据结构。
2.  **Write**: 创建一个 `docs/migration-example.md`，展示一段真实的 Shopify JSON 如何无损映射到 Atlas Schema。
3.  **Task**: 定义一组基础的 Setting Types (如 `image_picker`, `color`) 的 Zod 校验规则，确保数据合法性。

**结论**：通过严格对齐 Shopify 的 `settings` + `blocks` (扁平化 + 顺序数组) 结构，而非自定义的 `component-list` 嵌套结构，我们可以实现**零摩擦迁移**。这是最稳健的“Schema 先行”策略。
