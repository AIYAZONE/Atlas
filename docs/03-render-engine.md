# RFC-002：Shopify JSON → Render Engine

## 输入

```json
{
  "sections": {
    "hero": {
      "type": "hero",
      "settings": { "title": "Hello" }
    }
  },
  "order": ["hero"]
}
```

## 中间层（Normalized AST）

```ts
interface Node {
  id: string
  type: string
  settings: Record<string, any>
  children?: Node[]
}
```

## 渲染流程

1. JSON → AST Normalize
2. AST → Component Resolver
3. Component + Settings → 静态 HTML

> Render Engine **不感知 Shopify，只认 AST**。
