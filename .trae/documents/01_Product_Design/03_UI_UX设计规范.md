# Jackery Atlas UI/UX 设计规范 (Final)

> **设计语言**: Pro-Dark Industrial —— 专为深色场景下的电商数据精准呈现而生。
> **单一事实来源 (SSOT)**: 本文档整合了所有交互原则与视觉资产。

## 1. 设计原则 (Principles)
- **编辑即结果 (WYSIWYG)**: 预览渲染与生产环境保持 100% 一致。
- **配置驱动 (Schema-Driven)**: 属性面板基于 JSON Schema 自动生成，而非硬编码。
- **非破坏性 (Non-Destructive)**: 严格区分草稿与发布版本，支持一键回滚。
- **可访问性 (Accessibility)**: 遵循 WCAG 2.1 AA 标准，全键盘可达。

---

## 2. 视觉规范 (Visual Design Tokens)

### 2.1 色彩系统 (Color Palette)
| 类别 | 变量名 (Code) | HEX | 应用场景 |
|---|---|---|---|
| **底色** | `bg-primary` | `#0D0F12` | 画布底层、代码编辑器背景 |
| **层级** | `bg-secondary` | `#1A1D21` | 主界面背景、侧边栏、属性面板 |
| **卡片** | `surface-2` | `#262A2E` | 卡片背景、弹窗背景 |
| **品牌** | `brand-blue` | `#2D60FF` | 核心按钮、选中高亮、进度条 |
| **点缀** | `brand-orange` | `#FF6B00` | Jackery 品牌点缀、重要警告 |
| **状态** | `status-success` | `#00E676` | 构建成功、Live 状态 |
| **文本** | `text-primary` | `#FFFFFF` | 标题、正文 |
| **文本** | `text-muted` | `#9BA1A6` | 标签、占位符、非激活态 |
| **边框** | `border-thin` | `#2A2E33` | 分割线、表单边框 |

### 2.2 字体排印 (Typography)
- **Sans-Stack**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Mono-Stack**: `'JetBrains Mono', 'Fira Code', monospace`

| 层级 | 规格 | 用途 |
|---|---|---|
| H1 | 24px Semi-bold | 页面标题 |
| H2 | 18px Semi-bold | 模块/Section 标题 |
| Body | 14px Regular | 正文、属性面板标签 |
| Small | 12px Medium | 小字、状态信息 |

### 2.3 间距与布局 (Spacing & Layout)
- **基础单位**: `4px` (Scale: 4/8/12/16/24/32)
- **圆角**: `4px` (Soft-Industrial)
- **面板宽度**:
    - 左侧导航: `64px`
    - 组件面板: `240px`
    - 属性面板: `300px`

---

## 3. 核心组件规范 (Component Specs)

### 3.1 按钮 (Buttons)
- **Primary**: `brand-blue` 背景 + 白字，用于“保存”、“发布”。
- **Secondary**: 透明背景 + 边框 + 白字，用于“预览”、“取消”。
- **Ghost**: 无背景无边框，仅图标，用于侧边栏切换、删除操作。

### 3.2 输入控件 (Inputs)
- **Text/Select**: `bg-primary` 背景，1px solid `border-thin`，高度 36px。
- **Switch**: 宽度 24px，激活时背景色为 `brand-blue`。

### 3.3 编辑器画布 (Canvas)
- **选中框**: 2px solid `brand-blue`，右上角附带悬浮操作标签（Delete/Move）。
- **占位线**: 2px dashed `brand-blue`，用于标示拖拽放置区域。

---

## 4. 交互模式 (Interaction Patterns)

### 4.1 布局架构
- **左侧**: 组件库（Section/Block 分类、搜索、拖拽源）。
- **中间**: 画布（iframe 实时预览、选中高亮、标尺/网格）。
- **右侧**: 属性面板（基于 DSL 自动生成，支持校验与依赖显示）。
- **顶部**: 工具栏（设备切换 Desktop/Mobile、保存、发布）。

### 4.2 关键交互
- **全屏切换**: 编辑 ↔ 预览采用 `cubic-bezier(0.4,0,0.2,1)` 过渡，时长 300ms。
- **数据绑定**: 已绑定 Shopify 数据的字段显示 **Sync** 徽标，悬停显示来源商品信息。
- **发布反馈**: 
    - 单页发布：顶部显示进度环。
    - 全局发布：底部控制台滚动 Monospace 日志流。

### 4.3 购物车与结算
- **加入购物车**: Toast 成功提示 + Mini Cart 自动展开。
- **结算跳转**: 明确的 External Link 图标，点击后全屏 Loading 并跳转 Shopify Checkout。

---

## 5. 可访问性 (Accessibility)
- **键盘导航**: 所有可交互元素必须具备 `:focus-visible` 样式。
- **对比度**: 文本与背景对比度至少达到 4.5:1 (AA 级)。
- **语义化**: 按钮必须有 `aria-label`，表单控件必须关联 `<label>`。
