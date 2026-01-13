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

## 数据结构约束

* FieldType：输入/输出类型、可选项与默认值

* Component：schema（字段集）与渲染器（接收 props → 产出 AST/HTML）

* Validator：校验规则返回错误列表

* DataSource：统一方法（connect/query/close）

## 示例：注册一个轮播组件

```ts
registerComponent(
  'Carousel',
  {
    fields: [
      { id: 'items', type: 'component-list', component: 'CarouselItem' },
      { id: 'autoplay', type: 'boolean', default: true },
      { id: 'interval', type: 'number', default: 3000 }
    ]
  },
  function render(props) {
    return {
      type: 'Carousel',
      children: props.items.map(item => ({ type: 'CarouselItem', props: item }))
    }
  }
)
```

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

