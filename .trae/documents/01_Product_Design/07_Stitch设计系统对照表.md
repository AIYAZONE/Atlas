# Stitch → Atlas UI 设计系统对照表

> **目标**: 建立 Stitch 设计元素到 Atlas 组件的映射，确保 UI 实现与设计输出对齐  
> **范围**: 核心组件、设计令牌、交互规范、响应式布局

---

## 1. 对照表结构说明

### 输出格式
- **组件对照表**: Stitch 组件名 ↔ Atlas 组件名 + 属性映射
- **设计令牌表**: 颜色、字体、间距等设计系统变量
- **交互映射表**: 事件、状态、动效的行为对照
- **响应式对照表**: 断点、布局、栅格系统映射

### 使用说明
1. **设计阶段**: 使用此表确保 Stitch 设计符合 Atlas 规范
2. **开发阶段**: 开发者按此表实现组件和样式
3. **验收阶段**: 按此表检查 UI 实现的一致性

---

## 2. 组件对照表

### 2.1 基础组件

| Stitch 组件 | Atlas 组件 | 属性映射 | 备注 |
|-------------|------------|----------|------|
| `Button` | `UiButton` | `variant="filled/outline/ghost"` → `class="btn-filled/btn-outline/btn-ghost"` | 支持尺寸、状态、禁用 |
| `Card` | `UiCard` | `padding="sm/md/lg"` → `class="p-4/p-6/p-8"` | 支持阴影、边框、圆角 |
| `Input` | `UiInput` | `type="text/email/password"` → 原生 input 属性 | 支持校验、错误状态 |
| `Select` | `UiSelect` | `options={[]}` → `option` 元素 | 支持搜索、多选 |
| `Checkbox` | `UiCheckbox` | `checked={boolean}` → `v-model` | 支持禁用、不确定状态 |
| `Radio` | `UiRadio` | `options={[]}` → `option` 元素 | 支持禁用、默认选中 |
| `Switch` | `UiSwitch` | `on={boolean}` → `v-model` | 支持尺寸、颜色 |
| `Badge` | `UiBadge` | `variant="success/warning/error"` → 颜色类 | 支持尺寸、圆角 |
| `Avatar` | `UiAvatar` | `src={url}` → `img` 元素 | 支持尺寸、占位符 |
| `Icon` | `UiIcon` | `name={string}` → SVG 图标库 | 支持尺寸、颜色 |

### 2.2 布局组件

| Stitch 组件 | Atlas 组件 | 属性映射 | 备注 |
|-------------|------------|----------|------|
| `Container` | `UiContainer` | `maxWidth="sm/md/lg/xl"` → Tailwind 容器类 | 响应式最大宽度 |
| `Grid` | `UiGrid` | `cols={number}` → CSS Grid | 支持间距、对齐 |
| `Flex` | `UiFlex` | `direction="row/column"` → Flexbox | 支持换行、对齐 |
| `Stack` | `UiStack` | `spacing="sm/md/lg"` → 间距类 | 垂直或水平堆叠 |
| `Divider` | `UiDivider` | `orientation="horizontal/vertical"` → 分割线 | 支持颜色、粗细 |

### 2.3 导航组件

| Stitch 组件 | Atlas 组件 | 属性映射 | 备注 |
|-------------|------------|----------|------|
| `Navbar` | `UiNavbar` | `position="sticky/fixed"` → 定位类 | 支持品牌、菜单、搜索 |
| `Sidebar` | `UiSidebar` | `open={boolean}` → 展开状态 | 支持折叠、覆盖 |
| `Breadcrumb` | `UiBreadcrumb` | `items={[]}` → 面包屑列表 | 支持分隔符、首页 |
| `Tabs` | `UiTabs` | `active={string}` → 激活标签 | 支持滚动、禁用 |
| `Pagination` | `UiPagination` | `current={number}` → 当前页 | 支持总数、跳转 |

### 2.4 反馈组件

| Stitch 组件 | Atlas 组件 | 属性映射 | 备注 |
|-------------|------------|----------|------|
| `Alert` | `UiAlert` | `variant="info/success/warning/error"` → 颜色类 | 支持关闭、图标 |
| `Toast` | `UiToast` | `position="top-right/bottom-left"` → 位置类 | 支持自动消失、手动关闭 |
| `Modal` | `UiModal` | `open={boolean}` → 展示状态 | 支持尺寸、遮罩 |
| `Drawer` | `UiDrawer` | `side="left/right/top/bottom"` → 位置 | 支持尺寸、覆盖 |
| `Tooltip` | `UiTooltip` | `content={string}` → 提示内容 | 支持位置、触发方式 |
| `Popover` | `UiPopover` | `open={boolean}` → 展示状态 | 支持位置、箭头 |

### 2.5 数据展示

| Stitch 组件 | Atlas 组件 | 属性映射 | 备注 |
|-------------|------------|----------|------|
| `Table` | `UiTable` | `data={[]}` → 表格数据 | 支持排序、筛选、分页 |
| `List` | `UiList` | `items={[]}` → 列表数据 | 支持虚拟滚动、分组 |
| `Image` | `UiImage` | `src={url}` → 图片源 | 支持懒加载、占位符 |
| `Video` | `UiVideo` | `src={url}` → 视频源 | 支持封面、控制栏 |
| `Chart` | `UiChart` | `type="line/bar/pie"` → 图表类型 | 集成 Chart.js 或 ECharts |

---

## 3. 设计令牌对照表

### 3.1 颜色系统

| Stitch Token | Atlas 变量 | CSS 变量 | 应用场景 |
|--------------|------------|----------|----------|
| `color-primary` | `colors.brand.primary` | `--color-brand-primary` | 主按钮、链接、强调 |
| `color-secondary` | `colors.brand.secondary` | `--color-brand-secondary` | 次要按钮、标签 |
| `color-accent` | `colors.brand.accent` | `--color-brand-accent` | 点缀、警告、促销 |
| `color-success` | `colors.status.success` | `--color-status-success` | 成功状态、确认 |
| `color-warning` | `colors.status.warning` | `--color-status-warning` | 警告状态、注意 |
| `color-error` | `colors.status.error` | `--color-status-error` | 错误状态、危险 |
| `color-info` | `colors.status.info` | `--color-status-info` | 信息状态、提示 |
| `color-text-primary` | `colors.text.primary` | `--color-text-primary` | 主要文本、标题 |
| `color-text-secondary` | `colors.text.secondary` | `--color-text-secondary` | 次要文本、描述 |
| `color-text-muted` | `colors.text.muted` | `--color-text-muted` | 辅助文本、占位符 |
| `color-bg-primary` | `colors.background.primary` | `--color-bg-primary` | 主背景、页面底色 |
| `color-bg-secondary` | `colors.background.secondary` | `--color-bg-secondary` | 卡片背景、面板 |
| `color-bg-tertiary` | `colors.background.tertiary` | `--color-bg-tertiary` | 悬浮背景、模态框 |
| `color-border-primary` | `colors.border.primary` | `--color-border-primary` | 主要边框、分割线 |
| `color-border-secondary` | `colors.border.secondary` | `--color-border-secondary` | 次要边框、输入框 |

### 3.2 字体系统

| Stitch Token | Atlas 变量 | CSS 变量 | 应用场景 |
|--------------|------------|----------|----------|
| `font-family-sans` | `fontFamilies.sans` | `--font-family-sans` | 无衬线字体、正文 |
| `font-family-mono` | `fontFamilies.mono` | `--font-family-mono` | 等宽字体、代码 |
| `font-size-xs` | `fontSizes.xs` | `--font-size-xs` | 12px、辅助文本 |
| `font-size-sm` | `fontSizes.sm` | `--font-size-sm` | 14px、小号文本 |
| `font-size-base` | `fontSizes.base` | `--font-size-base` | 16px、正文 |
| `font-size-lg` | `fontSizes.lg` | `--font-size-lg` | 18px、大号文本 |
| `font-size-xl` | `fontSizes.xl` | `--font-size-xl` | 20px、小标题 |
| `font-size-2xl` | `fontSizes.2xl` | `--font-size-2xl` | 24px、中标题 |
| `font-size-3xl` | `fontSizes.3xl` | `--font-size-3xl` | 30px、大标题 |
| `font-size-4xl` | `fontSizes.4xl` | `--font-size-4xl` | 36px、特大标题 |
| `font-weight-light` | `fontWeights.light` | `--font-weight-light` | 300、细体 |
| `font-weight-normal` | `fontWeights.normal` | `--font-weight-normal` | 400、正常 |
| `font-weight-medium` | `fontWeights.medium` | `--font-weight-medium` | 500、中等 |
| `font-weight-semibold` | `fontWeights.semibold` | `--font-weight-semibold` | 600、半粗 |
| `font-weight-bold` | `fontWeights.bold` | `--font-weight-bold` | 700、粗体 |
| `line-height-tight` | `lineHeights.tight` | `--line-height-tight` | 1.25、紧凑 |
| `line-height-normal` | `lineHeights.normal` | `--line-height-normal` | 1.5、正常 |
| `line-height-relaxed` | `lineHeights.relaxed` | `--line-height-relaxed` | 1.75、宽松 |

### 3.3 间距系统

| Stitch Token | Atlas 变量 | CSS 变量 | 应用场景 |
|--------------|------------|----------|----------|
| `spacing-0` | `spacing.0` | `--spacing-0` | 0px、无间距 |
| `spacing-1` | `spacing.1` | `--spacing-1` | 4px、极小间距 |
| `spacing-2` | `spacing.2` | `--spacing-2` | 8px、小间距 |
| `spacing-3` | `spacing.3` | `--spacing-3` | 12px、中间距 |
| `spacing-4` | `spacing.4` | `--spacing-4` | 16px、标准间距 |
| `spacing-5` | `spacing.5` | `--spacing-5` | 20px、大间距 |
| `spacing-6` | `spacing.6` | `--spacing-6` | 24px、特大间距 |
| `spacing-8` | `spacing.8` | `--spacing-8` | 32px、超大间距 |
| `spacing-10` | `spacing.10` | `--spacing-10` | 40px、极大间距 |
| `spacing-12` | `spacing.12` | `--spacing-12` | 48px、巨大间距 |

### 3.4 圆角系统

| Stitch Token | Atlas 变量 | CSS 变量 | 应用场景 |
|--------------|------------|----------|----------|
| `radius-none` | `borderRadius.none` | `--border-radius-none` | 0px、无圆角 |
| `radius-sm` | `borderRadius.sm` | `--border-radius-sm` | 2px、小圆角 |
| `radius-base` | `borderRadius.base` | `--border-radius-base` | 4px、基础圆角 |
| `radius-md` | `borderRadius.md` | `--border-radius-md` | 6px、中等圆角 |
| `radius-lg` | `borderRadius.lg` | `--border-radius-lg` | 8px、大圆角 |
| `radius-xl` | `borderRadius.xl` | `--border-radius-xl` | 12px、特大圆角 |
| `radius-2xl` | `borderRadius.2xl` | `--border-radius-2xl` | 16px、超大圆角 |
| `radius-full` | `borderRadius.full` | `--border-radius-full` | 9999px、完全圆角 |

### 3.5 阴影系统

| Stitch Token | Atlas 变量 | CSS 变量 | 应用场景 |
|--------------|------------|----------|----------|
| `shadow-sm` | `boxShadow.sm` | `--box-shadow-sm` | 小阴影、微妙 |
| `shadow-base` | `boxShadow.base` | `--box-shadow-base` | 基础阴影、默认 |
| `shadow-md` | `boxShadow.md` | `--box-shadow-md` | 中等阴影、卡片 |
| `shadow-lg` | `boxShadow.lg` | `--box-shadow-lg` | 大阴影、悬浮 |
| `shadow-xl` | `boxShadow.xl` | `--box-shadow-xl` | 特大阴影、模态框 |
| `shadow-2xl` | `boxShadow.2xl` | `--box-shadow-2xl` | 超大阴影、强调 |

---

## 4. 交互映射表

### 4.1 状态映射

| Stitch 状态 | Atlas 实现 | CSS 类 | 说明 |
|-------------|------------|--------|------|
| `hover` | `@hover` | `hover:` | 鼠标悬停状态 |
| `focus` | `@focus` | `focus:` | 焦点状态 |
| `active` | `@active` | `active:` | 激活状态 |
| `disabled` | `:disabled` | `disabled:` | 禁用状态 |
| `loading` | `v-if="loading"` | `opacity-50` | 加载状态 |
| `error` | `v-if="error"` | `border-red-500` | 错误状态 |
| `success` | `v-if="success"` | `border-green-500` | 成功状态 |

### 4.2 事件映射

| Stitch 事件 | Atlas 事件 | 处理方式 | 示例 |
|-------------|------------|----------|------|
| `onClick` | `@click` | 方法绑定 | `@click="handleClick"` |
| `onSubmit` | `@submit` | 表单提交 | `@submit.prevent="handleSubmit"` |
| `onChange` | `@change` | 值变化 | `@change="handleChange"` |
| `onInput` | `@input` | 输入事件 | `@input="handleInput"` |
| `onFocus` | `@focus` | 获得焦点 | `@focus="handleFocus"` |
| `onBlur` | `@blur` | 失去焦点 | `@blur="handleBlur"` |
| `onHover` | `@mouseenter` | 鼠标进入 | `@mouseenter="handleHover"` |
| `onLeave` | `@mouseleave` | 鼠标离开 | `@mouseleave="handleLeave"` |

### 4.3 动效映射

| Stitch 动效 | Atlas 实现 | CSS 类 | 持续时间 |
|-------------|------------|--------|----------|
| `fade-in` | `transition-opacity` | `transition-opacity duration-300` | 300ms |
| `fade-out` | `transition-opacity` | `transition-opacity duration-300` | 300ms |
| `slide-up` | `transition-transform` | `transition-transform duration-300` | 300ms |
| `slide-down` | `transition-transform` | `transition-transform duration-300` | 300ms |
| `scale-in` | `transition-transform` | `transition-transform duration-200` | 200ms |
| `scale-out` | `transition-transform` | `transition-transform duration-200` | 200ms |
| `bounce` | `animate-bounce` | `animate-bounce` | 1s |
| `pulse` | `animate-pulse` | `animate-pulse` | 2s |

---

## 5. 响应式对照表

### 5.1 断点系统

| Stitch 断点 | Atlas 断点 | Tailwind 类 | 最小宽度 |
|-------------|------------|-------------|----------|
| `mobile` | `sm` | `sm:` | 640px |
| `tablet` | `md` | `md:` | 768px |
| `desktop` | `lg` | `lg:` | 1024px |
| `wide` | `xl` | `xl:` | 1280px |
| `ultrawide` | `2xl` | `2xl:` | 1536px |

### 5.2 布局映射

| Stitch 布局 | Atlas 实现 | 响应式类 | 说明 |
|-------------|------------|----------|------|
| `container-mobile` | `UiContainer` | `container mx-auto px-4` | 移动端容器 |
| `container-tablet` | `UiContainer` | `container mx-auto px-6 md:px-8` | 平板端容器 |
| `container-desktop` | `UiContainer` | `container mx-auto px-8 lg:px-12` | 桌面端容器 |
| `grid-mobile` | `UiGrid` | `grid grid-cols-1 sm:grid-cols-2` | 移动端网格 |
| `grid-tablet` | `UiGrid` | `grid grid-cols-2 md:grid-cols-3` | 平板端网格 |
| `grid-desktop` | `UiGrid` | `grid grid-cols-3 lg:grid-cols-4` | 桌面端网格 |

---

## 6. 实现指南

### 6.1 组件实现模板

```vue
<!-- UiButton.vue 示例 -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'filled' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'md',
  disabled: false,
  loading: false
})

const buttonClasses = computed(() => [
  'ui-button',
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
  {
    'ui-button--disabled': props.disabled,
    'ui-button--loading': props.loading
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ui-button {
  /* 基础样式 */
}

.ui-button--filled {
  background-color: var(--color-brand-primary);
  color: var(--color-text-primary);
}

.ui-button--outline {
  background-color: transparent;
  border: 1px solid var(--color-brand-primary);
  color: var(--color-brand-primary);
}

.ui-button--ghost {
  background-color: transparent;
  color: var(--color-brand-primary);
}
</style>
```

### 6.2 设计令牌使用

```css
/* CSS 变量定义 */
:root {
  --color-brand-primary: #2D60FF;
  --color-text-primary: #FFFFFF;
  --font-size-base: 16px;
  --spacing-4: 16px;
  --border-radius-base: 4px;
}

/* Tailwind 配置扩展 */
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'text-primary': 'var(--color-text-primary)'
      },
      fontSize: {
        'base': 'var(--font-size-base)'
      },
      spacing: {
        '4': 'var(--spacing-4)'
      },
      borderRadius: {
        'base': 'var(--border-radius-base)'
      }
    }
  }
}
```

---

## 7. 验收检查清单

### 7.1 组件验收
- [ ] 所有组件按对照表实现
- [ ] 属性映射正确无误
- [ ] 状态和事件处理完整
- [ ] 响应式行为符合预期

### 7.2 设计令牌验收
- [ ] 颜色系统完整映射
- [ ] 字体系统正确实现
- [ ] 间距和圆角系统对齐
- [ ] 阴影和动效系统可用

### 7.3 交互验收
- [ ] 所有状态切换正常
- [ ] 事件处理无错误
- [ ] 动效流畅自然
- [ ] 响应式断点正确

---

## 8. 维护与更新

### 8.1 版本控制
- 每次设计更新需同步更新此对照表
- 组件变更需记录版本号和变更说明
- 设计令牌变更需通知所有开发者

### 8.2 沟通流程
1. **设计阶段**: 设计师按此表创建 Stitch 设计
2. **评审阶段**: 团队按此表评审设计输出
3. **开发阶段**: 开发者按此表实现组件
4. **验收阶段**: QA 按此表检查实现质量

### 8.3 工具集成
- **Stitch**: 导出设计令牌 JSON
- **Atlas**: 导入设计令牌到 CSS 变量
- **CI/CD**: 自动检查设计令牌一致性

---

> **文档版本**: v1.0  
> **最后更新**: 2025-01-16  
> **维护者**: 前端架构师 + UI 设计师  
> **审核者**: 技术负责人 + 产品负责人