# Atlas 多语言管理系统设计规范

> 本文档描述了 Atlas 如何在兼容 `jds-i18n` 运行时包的基础上，构建动态的翻译定义与编辑管理系统。

## 1. 核心理念

我们采用 **"配置中心 (Config Center)"** 模式：
- **Atlas 编辑器**：负责定义有哪些翻译键（Schema），并提供可视化界面供运营修改翻译值（Data）。
- **jds-i18n**：负责在前端运行时消费这些数据，进行文案渲染。

## 2. 数据结构设计

### 2.1 翻译键定义 (Translation Schema)
为了让运营能看懂每个 Key 的含义，我们需要一份 Schema 来描述翻译键。这份数据可以硬编码在代码中，也可以存储在数据库中。

```typescript
const CartTranslationSchema: TranslationGroup = {
  id: "cart",
  name: "购物车",
  items: [
    {
      id: "general.title",
      label: "购物车标题",
      type: "text",
      default: "Your Cart"
    },
    {
      id: "general.empty",
      label: "空状态文案",
      type: "richtext",
      default: "Your cart is currently empty."
    },
    {
      id: "general.item_count",
      label: "商品数量",
      type: "plural",
      description: "使用 {{ count }} 变量",
      default: {
        one: "{{ count }} item",
        other: "{{ count }} items"
      },
      variables: ["count"]
    }
  ]
};
```

### 2.2 存储结构 (Runtime Data)
Atlas 后端将存储全量的翻译数据，结构如下：

```json
{
  "site_id": "jackery-us",
  "default_locale": "en",
  "published_locales": ["en", "de", "fr"],
  "translations": {
    "en": {
      "cart": {
        "general": {
          "title": "Your Cart",
          "item_count": { "one": "{{ count }} item", "other": "{{ count }} items" }
        }
      }
    },
    "de": {
      "cart": {
        "general": {
          "title": "Ihr Warenkorb",
          "item_count": { "one": "{{ count }} Artikel", "other": "{{ count }} Artikel" }
        }
      }
    }
  }
}
```

## 3. 集成流程 (Adapter Pattern)

### 3.1 注入到 jds-i18n
在 Nuxt 应用启动或页面加载时，我们从 Atlas API 获取上述 JSON，并注入到 `jds-i18n` 实例中。

```typescript
// plugins/i18n.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { data } = await useFetch('/api/atlas/translations');
  
  const i18n = createJdsI18n({
    locale: data.default_locale,
    messages: data.translations // 直接注入 Atlas 管理的数据
  });
  
  nuxtApp.vueApp.use(i18n);
});
```

### 3.2 编辑器交互
在 Atlas Builder 中，新增一个 **"Translation"** 面板：
1.  **左侧树**：根据 `TranslationSchema` 渲染分类树（如 Cart > General）。
2.  **中间表单**：点击某个 Key，右侧显示 Label、Description 和多语言输入框。
3.  **实时预览**：修改文案后，通过 `postMessage` 通知 Preview iframe 更新 `jds-i18n` 的 messages 数据，实现即时生效。

## 4. 优势
1.  **运营自主性**：运营可以随时修改文案，无需依赖开发发版。
2.  **类型安全**：Schema 定义了变量约束，编辑器可以校验用户是否误删了 `{{ count }}` 变量。
3.  **无缝兼容**：底层运行时逻辑完全复用现有的 `jds-i18n`，改造成本极低。
