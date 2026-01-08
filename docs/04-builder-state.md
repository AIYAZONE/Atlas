# RFC-004：Builder 状态管理

## 核心状态

```ts
EditorState = {
  draft: PageSchema
  published: PageSchema
  history: PageSchema[]
}
```

## 能力

* Undo / Redo：基于 immutable diff
* Draft：未发布状态
* Publish：生成静态构建任务
