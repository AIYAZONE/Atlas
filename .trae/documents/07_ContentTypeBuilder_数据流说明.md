# Content Type Builder 数据流说明

## 数据模型
- ContentType：id、name、fields[]、relations[]、locales[]、version、status
- Field：id、type（text/number/richtext/media/component/enum/...）、options、validators[]
- Component：id、schema（嵌套字段集）、version
- DynamicZone：允许多组件列表，按顺序排列

## 流程概览
- Builder UI 编辑 → 校验与预览 → 保存到 schema 真源 → 更新内容条目 → 渲染器生成页面 → 构建发布

## 交互步骤
- 打开类型或页面 → 载入最新 schema 与内容
- 编辑字段/组件/动态区 → 本地校验与预览渲染
- 保存 → 写入 schema 包（JSON）与数据库内容
- 预览 → renderer 读 schema + content 生成视图
- 发布 → 触发构建，产出静态页面并版本化

## 校验与版本
- 校验：字段类型、必填、范围、正则、关系引用存在性
- 版本：schema 与内容分别版本；发布绑定具体版本号
- 差异：展示 schema 版本 diff 与回滚

## 渲染数据
- 输入：schema.json、content.json、媒体元数据
- 输出：组件树 AST → Vue 组件 → HTML（SSG/SSR）
- 缓存：按 schema+content 哈希缓存渲染结果

## 关系与引用
- 内容间关系（如产品→分类）在渲染时可聚合
- 媒体引用计数与断联预警在保存/构建阶段写入
