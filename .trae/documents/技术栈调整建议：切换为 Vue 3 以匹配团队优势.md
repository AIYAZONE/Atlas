## 决策分析：Vue vs React

基于你的团队背景和架构需求，强烈建议 **使用 Vue 3**，而不是 React。

### 1. 核心理由
*   **团队效率至上（MVP 关键）**：既然团队“基本上都是 Vue 技术栈”，切换 React 的学习成本（JSX, Hooks 陷阱, Context 性能优化）会严重拖慢 MVP 交付。Vue 3 + Composition API + TypeScript 已经非常强大，足以支撑大型应用。
*   **Builder 场景优势**：Builder 需要处理复杂的嵌套 JSON Schema 和实时拖拽。Vue 的响应式系统（基于 Proxy）在处理这种 Mutable 数据结构时，往往比 React 的 Immutable State 更直观，且性能开销更小（自动依赖追踪，无需手动 `useMemo`/`React.memo`）。
*   **Supabase 适配性误区**：Supabase 官方核心库 `supabase-js` 是纯 JavaScript 的，**完全不依赖 React**。Vue 生态有非常优秀的 `@vueuse/supabase` 或 Nuxt 的 `@nuxtjs/supabase` 模块，集成体验与 React 并无二致。

### 2. 架构匹配度
*   **Headless Builder**: Vue 组件同样可以动态渲染（`<component :is="...">`），非常适合实现 JSON 到 UI 的渲染引擎。
*   **静态发布 (SSG)**: 架构中需要的静态生成，Vue 生态有 **Nuxt 3** 或 **Vite SSG**，完全对标 React 的 Next.js。
*   **状态管理**: Vue 的 **Pinia** 比 React 的 Zustand/Redux 更符合直觉，且对 TS 支持极佳。

### 3. 修改计划
我将更新所有文档，将前端技术栈从 React 切换为 Vue 3 全家桶。

#### 涉及文档与变更点
1.  **[技术架构文档.md](file:///Users/brucewang/Documents/AIYA/builder/.trae/documents/技术架构文档.md)**:
    *   前端：`React` -> `Vue 3`
    *   状态管理：`Zustand` -> `Pinia`
    *   架构图：`React Builder` -> `Vue Builder`
2.  **[架构设计.md](file:///Users/brucewang/Documents/AIYA/builder/.trae/documents/架构设计.md)**:
    *   更新逻辑架构中的前端描述。
3.  **[MVP产品需求文档.md](file:///Users/brucewang/Documents/AIYA/builder/.trae/documents/MVP产品需求文档.md)**:
    *   关键流程图：`Builder (React)` -> `Builder (Vue)`
4.  **[后端总体设计.md](file:///Users/brucewang/Documents/AIYA/builder/.trae/documents/后端总体设计（从%20Shopify%20到自研电商的演进架构）.md)**:
    *   架构图：`React Builder` -> `Vue Builder`

### 4. 推荐 Vue 技术栈组合
*   **框架**: Vue 3 (Composition API + Script Setup)
*   **元框架**: **Nuxt 3** (推荐，自带 SSG/SSR 能力，利于后续 SEO 和静态发布) 或 **Vite + Vue** (纯 SPA)
*   **语言**: TypeScript
*   **UI 库**: TailwindCSS (保持不变) + Shadcn-vue (或 Element Plus)
*   **状态管理**: Pinia
*   **拖拽库**: `vuedraggable` (基于 Sortablejs) 或 `@vueuse/core`

确认后，我将执行文档更新。