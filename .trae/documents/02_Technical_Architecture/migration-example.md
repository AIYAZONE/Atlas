# Shopify to Atlas 迁移映射示例

本文档展示了 Shopify 原生数据结构如何无损映射到 Atlas Schema。

## 1. Schema 定义映射
**Shopify Liquid Schema** (`sections/hero.liquid`)
```json
{% schema %}
{
  "name": "Hero Banner",
  "tag": "section",
  "class": "section-hero",
  "max_blocks": 3,
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Heading",
      "default": "Welcome"
    }
  ],
  "blocks": [
    {
      "type": "slide",
      "name": "Slide",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" }
      ]
    }
  ]
}
{% endschema %}
```

**Atlas Component Definition** (`packages/schema/src/components/hero.ts`)
```typescript
import { ComponentDefinition } from '../shopify-compatible';

export const HeroBanner: ComponentDefinition = {
  type: "hero-banner", // 对应文件名
  name: "Hero Banner",
  tag: "section",
  class: "section-hero",
  settings: [
    {
      type: "text",
      id: "title",
      label: "Heading",
      default: "Welcome"
    }
  ],
  blocks: [
    {
      type: "slide",
      name: "Slide",
      limit: 3, // 对应 max_blocks
      settings: [
        { type: "image_picker", id: "image", label: "Image" }
      ]
    }
  ]
};
```

---

## 2. 页面数据映射
**Shopify Template JSON** (`templates/index.json`)
```json
{
  "sections": {
    "hero_1": {
      "type": "hero-banner",
      "settings": {
        "title": "Summer Sale"
      },
      "blocks": {
        "slide_1": {
          "type": "slide",
          "settings": { "image": "shopify://shop_images/summer.jpg" }
        },
        "slide_2": {
          "type": "slide",
          "settings": { "image": "shopify://shop_images/winter.jpg" }
        }
      },
      "block_order": [
        "slide_1",
        "slide_2"
      ]
    }
  },
  "order": [
    "hero_1"
  ]
}
```

**Atlas Page Instance** (Stored in DB)
> **完全一致！** Atlas 后端直接存储上述 JSON 对象。
> 区别仅在于 Atlas 可能会在 API 响应中解析 `shopify://` 协议的图片链接为 CDN URL。

---

## 3. 前端消费 (Vue 组件)
在 Vue 组件中，我们直接接收 `settings` 和 `blocks` 作为 Props。

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { SectionInstance } from '@atlas/schema';

const props = defineProps<{
  settings: Record<string, any>;
  blocks?: Record<string, any>;
  block_order?: string[];
}>();

// 解析排序后的 Blocks
const orderedBlocks = computed(() => {
  if (!props.block_order || !props.blocks) return [];
  return props.block_order.map(id => props.blocks![id]);
});
</script>

<template>
  <section class="section-hero">
    <h1>{{ settings.title }}</h1>
    
    <div class="slides">
      <div v-for="(block, index) in orderedBlocks" :key="index" class="slide">
        <!-- 假设有一个 image-render 组件处理 shopify:// 链接 -->
        <AtlasImage :src="block.settings.image" />
      </div>
    </div>
  </section>
</template>
```
