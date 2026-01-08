# 迁移方案 RFC

## RFC-005：Shopify Theme 自动迁移

### 输入

* theme.liquid
* templates/*.json
* sections/*.liquid

### 输出

* Page JSON
* Section DSL
* React/Vue 组件骨架

### 迁移流程

1. Liquid AST 解析
2. 提取 HTML + Settings
3. 转换为组件 Render 函数

---

## RFC-006：Liquid → React / 非 React 映射

### 可迁移

| Liquid           | 对应                     |
| ---------------- | ---------------------- |
| section.settings | props                  |
| for / if         | JS 表达式                 |
| product          | Shopify Storefront API |

### 不可自动迁移

* 复杂 include
* 自定义 filter

---

## RFC-007：真实迁移成本评估

| 项目   | 成本     |
| ---- | ------ |
| 普通主题 | 1-2 人周 |
| 定制主题 | 3-6 人周 |
| 大型主题 | 1-2 人月 |
