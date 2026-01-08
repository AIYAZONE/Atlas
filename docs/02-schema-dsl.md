# RFC-003：Section / Block Schema DSL

## 设计目标

* 100% 兼容 Shopify Schema
* 增强：条件显示 / 版本 / 实验字段

## DSL 示例

```json
{
  "name": "Hero",
  "settings": [
    { "id": "title", "type": "text", "required": true },
    { "id": "image", "type": "image_picker" }
  ],
  "visibility": {
    "page": ["index", "product"],
    "abTest": "hero_v2"
  }
}
```
