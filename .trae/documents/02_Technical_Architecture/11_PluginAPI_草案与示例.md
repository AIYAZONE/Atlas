# Plugin API 草案与示例

## 目标

* 提供统一扩展点以注册字段、组件、校验器、渲染器、数据源与发布钩子，隔离核心与扩展。

## 插件清单与生命周期

* 插件清单：id、name、version、capabilities（fields/components/validators/renderers/data-sources/hooks）

* 生命周期钩子：onRegister、onRender、onPublish、onAfterBuild

## 注册接口（草案）

* registerFieldType(type, options)

* registerComponent(name, schema, renderer)

* registerValidator(name, fn)

* registerRenderer(name, fn)

* registerDataSource(name, adapter)

* registerHook(event, handler) // event: 'onRegister'|'onRender'|'onPublish'|'onAfterBuild'

> 说明：现行 Schema 模型对齐 Shopify Theme 2.0：组件 schema 推荐采用 ComponentDefinition（settings/blocks/presets），字段 type 以 SettingType 为准。不存在 `component-list`；需要“可重复子项/列表项”时使用 blocks + block_order 表达。`registerFieldType` 如保留，建议仅用于扩展编辑器控件/元信息与校验能力，落盘结构仍需映射到 SettingType 或 blocks 体系。

## 数据结构约束

* SettingDefinition / SettingType：字段类型集合遵循 Shopify Theme 2.0 兼容定义（如 text/checkbox/select/image_picker/range 等），并支持 default/options/min/max/step 等约束。

* ComponentDefinition：组件 schema 由 settings（全局配置项）+ blocks（可重复子项定义，可选）+ presets（默认预设，可选）构成。

* SectionInstance / BlockInstance：页面实例数据使用扁平化结构；可重复子项使用 blocks（map）+ block_order（顺序数组）表达（不使用递归嵌套）。

* Renderer：渲染器以 SectionInstance 为主要输入，结合 schema 与运行时上下文产出 AST/HTML。

* Validator：校验规则返回错误列表

* DataSource：统一方法（connect/query/close）

## 示例：注册一个轮播组件

```ts
registerComponent(
  'Carousel',
  {
    type: 'carousel',
    name: 'Carousel',
    settings: [
      { id: 'autoplay', type: 'checkbox', label: 'Autoplay', default: true },
      { id: 'interval', type: 'number', label: 'Interval (ms)', default: 3000, min: 1000, max: 10000, step: 500 }
    ],
    blocks: [
      {
        type: 'slide',
        name: 'Slide',
        settings: [
          { id: 'image', type: 'image_picker', label: 'Image' },
          { id: 'link', type: 'url', label: 'Link' }
        ]
      }
    ],
    presets: [{ name: 'Default', blocks: [{ type: 'slide' }, { type: 'slide' }] }]
  },
  function render(section) {
    const orderedBlocks =
      section.block_order?.map(id => section.blocks?.[id]).filter(Boolean) ?? [];

    return {
      type: 'Carousel',
      props: section.settings,
      children: orderedBlocks.map(block => ({
        type: 'CarouselSlide',
        props: block.settings
      }))
    }
  }
)
```

## 兼容与迁移说明

* 旧草案中的 `schema.fields[]` 概念可视为 Shopify 兼容模型里的 `settings[]`（字段类型集合以 SettingType 为准，例如布尔开关使用 `checkbox`）。

* 旧草案中的“组件列表/可重复子项”不使用递归嵌套；在现行模型里应迁移为 `blocks`（map）+ `block_order`（顺序数组），每个 block 相当于一个列表项。

## 示例：渲染钩子与发布钩子

```ts
registerHook('onRender', async (ctx) => {
  // ctx: { content, locale, route, assets }
  // 可进行内容预处理或注入额外数据
});

registerHook('onPublish', async (ctx) => {
  // ctx: { version, manifest, routes }
  // 可触发外部通知或额外产物生成
});
```

## 安全与治理

* 插件运行沙箱化与资源限额；权限声明（可访问的数据域与操作）

* 审计：插件注册、执行与失败事件记录

## 包管理与版本

* 插件版本语义化；破坏性变更需迁移脚本与兼容层

* 组织内部插件与第三方插件区分与签名
