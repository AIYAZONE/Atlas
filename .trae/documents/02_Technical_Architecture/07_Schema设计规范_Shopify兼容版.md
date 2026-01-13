# Schema 设计规范 (Shopify 兼容版)

> 本文档描述了 Atlas 系统的核心数据模型。设计目标是严格兼容 Shopify Theme 2.0 架构，以实现低成本迁移和双向互通。

## 1. 核心设计原则

- **Schema First**: 所有的 UI 组件必须先定义 Schema (ComponentDefinition)，编辑器根据 Schema 动态生成表单。
- **Shopify Compatible**: 数据结构严格对齐 Shopify 的 `templates/*.json` (实例) 和 `{% schema %}` (定义)。
- **Flat Structure**: 摒弃递归嵌套，采用“Section 扁平列表”和“Block 扁平列表 + 顺序数组”的结构。

## 2. 数据模型定义

### 2.1 页面 (Page)
对应 Shopify 的 `templates/*.json` 文件。Atlas 数据库存储完整的 Page 对象。

```typescript
interface PageInstance {
  id: string;          // 内部 UUID
  name?: string;       // 页面名称
  type: string;        // 页面类型 (index, product, page)
  sections: Record<string, SectionInstance>; // 扁平化存储所有 Section
  order: string[];     // Section ID 的渲染顺序
  
  // Atlas 扩展字段
  status: 'draft' | 'published';
  seo: SEOData;
}
```

### 2.2 Section 实例
对应 Shopify Template JSON 中的 section 对象。

```typescript
interface SectionInstance {
  type: string;        // 组件类型 (如 "hero-banner")
  disabled?: boolean;  // 是否禁用
  settings: Record<string, any>; // 全局配置值
  blocks?: Record<string, BlockInstance>; // 子 Block 实例 (扁平化)
  block_order?: string[]; // Block ID 的渲染顺序
}
```

### 2.3 组件定义 (Component Definition)
对应 Shopify Liquid 文件中的 `{% schema %}` 标签。

```typescript
interface ComponentDefinition {
  type: string;        // 组件唯一标识
  name: string;        // 编辑器显示名称
  limit?: number;      // 页面内最大添加次数
  settings: SettingDefinition[]; // 全局配置项定义
  blocks?: BlockDefinition[];    // 允许的子 Block 定义
  presets?: PresetDefinition[];  // 默认预设
}

interface SettingDefinition {
  type: SettingType;   // 字段类型 (text, image_picker, etc.)
  id: string;          // 数据 key
  label: string;       // 显示标签 (支持 t: 翻译键)
  default?: any;
}
```

## 3. 字段类型 (Setting Types)
Atlas 支持 Shopify 原生的所有核心字段类型：

| 类型 | 说明 | Atlas 对应控件 |
| :--- | :--- | :--- |
| `text` | 单行文本 | Input |
| `textarea` | 多行文本 | Textarea |
| `richtext` | 富文本 | Tiptap Editor |
| `image_picker` | 图片选择 | Media Library Modal |
| `color` | 颜色选择 | Color Picker |
| `url` | 链接 | Link Picker (Page/Product/External) |
| `product` | 产品选择 | Shopify Product Picker |
| `collection` | 集合选择 | Shopify Collection Picker |
| `checkbox` | 开关 | Switch |
| `select` | 下拉选 | Select |
| `range` | 滑动条 | Slider |

## 4. 多语言支持 (i18n)

Schema 中的文本字段（如 `label`, `info`, `group`）支持使用 `t:` 语法引用翻译键。

- **语法**: `t:<group>.<key>`
- **示例**: `label: "t:sections.hero.settings.title.label"`
- **解析**: 编辑器会根据当前站点的语言配置，从 `TranslationDefinition` 中查找对应的文本。

## 5. 迁移映射示例

### Shopify Template JSON
```json
{
  "sections": {
    "hero_1": {
      "type": "hero-banner",
      "settings": { "title": "Summer Sale" },
      "blocks": {
        "slide_1": { "type": "slide", "settings": { "image": "img_1.jpg" } }
      },
      "block_order": ["slide_1"]
    }
  },
  "order": ["hero_1"]
}
```

### Atlas Page Data (DB)
Atlas 直接存储上述 JSON 结构，仅在 API 输出层可能做轻微的格式化（如将 `shopify://` 链接转换为 CDN URL）。
