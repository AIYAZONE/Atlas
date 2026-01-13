/**
 * Jackery Atlas Schema Definition (Shopify Compatible)
 * 
 * 核心设计目标：
 * 1. 严格兼容 Shopify Theme 2.0 数据结构，确保 `templates/*.json` 可直接导入。
 * 2. 提供 TypeScript 类型支持，用于 Builder 和 Renderer。
 */

// ==========================================
// 1. Page Structure (Instance Data)
// 对应 Shopify 的 templates/*.json 文件
// ==========================================

export interface PageInstance {
  name?: string;       // 页面名称 (Shopify 内部使用)
  wrapper?: string;    // 包装器类名 (div#PageContainer)
  sections: Record<string, SectionInstance>; // 扁平化存储所有 Section
  order: string[];     // Section ID 的渲染顺序
}

/**
 * Section 实例数据
 * 对应 template JSON 中的 section 对象
 */
export interface SectionInstance {
  type: string;        // 组件类型 (对应 ComponentDefinition.type)
  disabled?: boolean;  // 是否禁用
  settings: Record<string, any>; // Section 全局配置值
  blocks?: Record<string, BlockInstance>; // 子 Block 实例 (扁平化)
  block_order?: string[]; // Block ID 的渲染顺序
  
  // Atlas 扩展字段 (非 Shopify 原生，用于内部管理)
  _id?: string;        // 内部 UUID
  _label?: string;     // 编辑器中显示的别名
}

/**
 * Block 实例数据
 * 对应 template JSON 中的 block 对象
 */
export interface BlockInstance {
  type: string;        // Block 类型 (对应 BlockDefinition.type)
  settings: Record<string, any>; // Block 配置值
  
  // Atlas 扩展字段
  _id?: string;
}


// ==========================================
// 2. Component Definition (Schema)
// 对应 Shopify Liquid 文件中的 {% schema %}
// ==========================================

export interface ComponentDefinition {
  type: string;        // 组件唯一标识 (如 "hero-banner")
  name: string;        // 编辑器显示名称
  class?: string;      // 容器 CSS 类名
  tag?: 'section' | 'div' | 'article' | 'header' | 'footer'; // 渲染 HTML 标签
  limit?: number;      // 页面内最大添加次数
  
  settings: SettingDefinition[]; // 全局配置项定义
  blocks?: BlockDefinition[];    // 允许的子 Block 定义
  presets?: PresetDefinition[];  // 默认预设 (用于“添加章节”菜单)
  
  // Atlas 扩展元数据
  icon?: string;       // 编辑器图标
  category?: string;   // 组件分类
}

export interface BlockDefinition {
  type: string;        // Block 标识 (如 "slide")
  name: string;        // 显示名称
  limit?: number;      // 该 Section 内最大数量
  settings: SettingDefinition[]; // Block 配置项定义
}

export interface PresetDefinition {
  name: string;        // 预设名称
  settings?: Record<string, any>; // 默认 settings
  blocks?: Array<{     // 默认 blocks (注意这里是数组，导入时需转为 map + order)
    type: string;
    settings?: Record<string, any>;
  }>;
}


// ==========================================
// 3. Setting Types (Field Definitions)
// 对应 Shopify settings 中的 type 属性
// ==========================================

export type SettingType = 
  | 'text' | 'textarea' | 'richtext' 
  | 'number' | 'range'
  | 'checkbox' | 'radio' | 'select'
  | 'color' | 'color_background'
  | 'image_picker' | 'video_url' | 'url'
  | 'font_picker' | 'collection' | 'product' | 'page' | 'blog' | 'article'
  | 'html' | 'liquid' | 'header' | 'paragraph'; // 辅助展示类型

export interface SettingDefinition {
  type: SettingType;   // 字段类型
  id: string;          // 数据存储 key
  label: string;       // 编辑器标签
  default?: any;       // 默认值
  info?: string;       // 帮助文本
  placeholder?: string;
  
  // 类型特定的配置项
  options?: Array<{ label: string; value: string }>; // for select/radio
  min?: number;        // for range/number
  max?: number;        // for range/number
  step?: number;       // for range/number
  unit?: string;       // for range
  accept?: string[];   // for video_url (youtube, vimeo)
}


// ==========================================
// 4. Localization Definition (i18n)
// 站点级多语言定义与管理
// ==========================================

/**
 * 翻译键定义 (Schema)
 * 用于在编辑器中管理翻译键的元数据
 */
export interface TranslationDefinition {
  id: string;          // 键路径 (如 "general.search.placeholder")
  label: string;       // 编辑器显示的字段名 (如 "搜索框占位符")
  type: 'text' | 'richtext' | 'plural'; // 翻译类型
  description?: string; // 语境说明 (给翻译人员看)
  default: string | { one: string; other: string }; // 默认文案
  variables?: string[]; // 支持的变量 (如 ["count", "name"])
}

/**
 * 翻译组定义
 * 用于在编辑器中对翻译键进行分类管理
 */
export interface TranslationGroup {
  id: string;          // 组 ID (如 "general", "cart")
  name: string;        // 组显示名
  items: (TranslationDefinition | TranslationGroup)[]; // 支持嵌套分组
}

/**
 * 站点语言配置 (Site Locale Config)
 * 存储在数据库中的站点级配置
 */
export interface SiteLocaleConfig {
  default_locale: string;       // 默认语言 (e.g. "en")
  published_locales: string[];  // 已发布语言列表 (e.g. ["en", "zh-CN"])
  
  // 翻译数据 (存储层)
  // 结构：{ "en": { "general.search.submit": "Search" }, "zh-CN": { ... } }
  // 注意：这里存储的是扁平化后的 key-value，或者嵌套结构，取决于 jds-i18n 的要求
  translations: Record<string, LocaleDictionary>; 
}

/**
 * 单个语言的翻译字典
 * 对应 locales/*.json 文件结构
 */
export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary;
}
