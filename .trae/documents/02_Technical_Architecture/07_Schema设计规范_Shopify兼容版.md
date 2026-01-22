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
interface TemplatePageInstance {
  name?: string;       // Shopify 内部页面名称（可选）
  wrapper?: string;    // Atlas 扩展：页面根容器类名（可选）
  sections: Record<string, SectionInstance>; // 扁平化存储所有 Section
  order: string[];     // Section ID 的渲染顺序
}

interface PageRecord {
  id: string;          // 内部 UUID
  type: string;        // 页面类型 (index, product, page)
  status: 'draft' | 'published';
  seo?: SEOData;
  template: TemplatePageInstance; // 对齐 Shopify templates/*.json 的主体结构
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

  // Atlas 扩展字段（不参与 Shopify 导入导出）
  _id?: string;
  _label?: string;
}

interface BlockInstance {
  type: string;
  settings: Record<string, any>;

  // Atlas 扩展字段
  _id?: string;
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

## 3. 编辑器元信息字段（UI Meta）
在严格兼容 Shopify 核心结构的前提下，Atlas 允许补充一些“仅用于编辑器/渲染器”的元信息字段，以提升搭建体验与组件组织能力。

### 3.1 ComponentDefinition 扩展字段（可选）
- `class`：容器 class（用于 Shopify 兼容或渲染器容器样式）
- `tag`：渲染标签或渲染器提示（如 section 容器语义）
- `icon`：组件库图标标识
- `category`：组件库分类（用于编辑器分组/筛选）
- `presets`：默认预设（用于快速插入与初始化默认 settings/blocks）

### 3.2 SettingDefinition 扩展字段（可选）
- `info`：帮助文案（支持 t:）
- `placeholder`：占位提示（支持 t:）
- `options`：用于 select/radio 等枚举型字段的选项列表
- `min/max/step/unit`：用于 number/range 等数值型字段的约束与显示单位
- `accept`：用于 `video_url` 等类型的白名单（如 youtube/vimeo）

## 3. 字段类型 (Setting Types)
Atlas 支持 Shopify 原生的所有核心字段类型：

说明：下表为常用子集；完整列表以代码 `SettingType` 为准，见 [shopify-compatible.ts](file:///Users/brucewang/Documents/AIYA/Atlas/packages/schema/src/shopify-compatible.ts)。

| 类型 | 说明 | Atlas 对应控件 |
| :--- | :--- | :--- |
| `text` | 单行文本 | Input |
| `textarea` | 多行文本 | Textarea |
| `richtext` | 富文本 | Tiptap Editor |
| `number` | 数值输入 | Input |
| `image_picker` | 图片选择 | Media Library Modal |
| `color` | 颜色选择 | Color Picker |
| `color_background` | 背景色 | Color Picker |
| `url` | 链接 | Link Picker (Page/Product/External) |
| `video_url` | 视频链接 | Video URL Picker |
| `font_picker` | 字体选择 | Font Picker |
| `product` | 产品选择 | Shopify Product Picker |
| `collection` | 集合选择 | Shopify Collection Picker |
| `page` | 页面选择 | Page Picker |
| `blog` | 博客选择 | Blog Picker |
| `article` | 文章选择 | Article Picker |
| `checkbox` | 开关 | Switch |
| `radio` | 单选 | Radio Group |
| `select` | 下拉选 | Select |
| `range` | 滑动条 | Slider |
| `html` | 受控 HTML | HTML Editor |
| `liquid` | 迁移占位 | Placeholder |
| `header` | 分组标题 | Heading |
| `paragraph` | 说明文本 | Paragraph |

## 4. 高级字段类型与约束
### 4.1 高级类型（html/liquid）
- `html`：允许渲染器原样输出的受控 HTML（需做安全策略与白名单约束）
- `liquid`：仅用于迁移兼容的占位类型，MVP 默认不执行（避免服务端模板注入与跨站风险）

### 4.2 校验与安全边界
- Schema 校验：保存时必须按 SettingDefinition/BlockDefinition 校验字段类型与约束（min/max/options/accept 等）。
- 安全约束：任何可执行/可注入的内容（如 html/liquid）必须走白名单与清洗策略，避免 XSS/模板注入。

## 5. 多语言支持 (i18n)

Schema 中的文本字段（如 `label`, `info`, `group`）支持使用 `t:` 语法引用翻译键。

- **语法**: `t:<group>.<key>`
- **示例**: `label: "t:sections.hero.settings.title.label"`
- **解析**: 编辑器会根据当前站点的语言配置，从 `TranslationDefinition` 中查找对应的文本。

## 6. 迁移映射示例

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
