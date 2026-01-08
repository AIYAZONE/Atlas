# 系统架构文档

## 1. 总体架构

```
[ Editor App ]
      ↓
[ Page Schema JSON ]
      ↓
[ Static Generator ]
      ↓
[ HTML Assets ] → CDN → User
      ↑
[ Shopify Storefront API ]
```

## 2. 子系统划分

| 模块              | 说明             |
| --------------- | -------------- |
| Builder UI      | 可视化编辑器         |
| Schema Engine   | 页面 / 组件数据模型    |
| Render Engine   | JSON → HTML    |
| Shopify Adapter | Shopify API 适配 |
| Publish System  | 构建 & 发布        |
| CDN Layer       | 全球加速           |

## 3. 技术选型建议

### 前端

* React + TypeScript
* Zustand / Redux
* Tailwind / CSS Variables

### 渲染

* 自研 SSG 或基于 Astro / Next SSG

### 后端

* Node.js / Bun
* PostgreSQL（元数据）
* Redis（构建缓存）

## 4. 工程级落地架构

### CI/CD

* PR → Builder 单元测试
* Merge → SSG 构建
* Build → CDN 上传

### 增量构建

* 页面级 hash
* 产品变更仅重建关联页

### CDN

* HTML：强缓存 + 版本号
* API：边缘缓存
