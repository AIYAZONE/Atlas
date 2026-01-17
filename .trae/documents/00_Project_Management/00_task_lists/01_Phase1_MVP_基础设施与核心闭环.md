# MVP 里程碑计划（详细版，8 周稳健）

> 目标：交付可搜索、可转化的单站点 MVP（首页/产品页/购物车闭环），并建立基础设施与运营协作机制
> 验收口径：Lighthouse ≥ 95（移动端）、页面可被搜索引擎抓取、Checkout 跳转 Shopify、构建后无 Node Runtime

## 周期概览
- **Phase 1 (W1-2)**: 架构基建与学习 —— 跑通 Hello World，确定 Schema
- **Phase 2 (W3-4)**: 核心难点攻坚 —— 实现最简 Builder，跑通 JSON→Vue 渲染
- **Phase 3 (W5-6)**: 业务功能填充 —— 对接 Shopify/Supabase，实现购物车与 SSG
- **Phase 4 (W7)**: UI 还原与整合 —— 套用高保真设计，移动端适配
- **Phase 5 (W8-9)**: 验收与发布 —— 测试、修缮、文档与 Buffer

---

## Phase 1: 架构基建与学习 (Week 1-2)
**目标**：搭建好 Nuxt 3 + Supabase 脚手架，跑通全链路 Demo。

### Week 1: 初始化与规范
- [ ] 初始化 Monorepo (Turborepo + pnpm)
- [ ] 搭建 Nuxt 3 + Pinia + TailwindCSS 项目结构
- [ ] 搭建 Supabase 本地开发环境 (Supabase CLI)
- [ ] 配置 ESLint / Prettier / CommitLint (**强制规范**)
- [ ] **关键任务**：定义核心 JSON Schema (Page/Section/Block) 数据结构

### Week 2: 连通性验证
- [ ] 初始化 Supabase (Auth, Database, RLS Policy)
- [ ] 封装基础 API 请求客户端 (useSupabase 封装)
- [ ] 实现一个简单的 "Hello World" 页面：从 DB 读取标题并在页面显示
- [ ] **团队培训**：Vue 3 Composition API 与 Supabase RLS 最佳实践

### 验收与产出
- 页面信息架构（IA）与内容类型清单
- 架构图（数据流/渲染路径/适配层）评审通过
- CI/CD 初始管线与分支策略

---

## Phase 2: 核心难点攻坚 (Week 3-4)
**目标**：实现一个**最简陋但能用**的编辑器 (Builder) 与渲染引擎。

### Week 3: 核心通信机制
- [ ] 实现 Builder (父) 与 Preview (iframe) 的 `postMessage` 通信
- [ ] 实现组件选中高亮 (Select Highlight)
- [ ] 实现基础属性修改 (Text Edit)

### Week 4: 拖拽与动态表单
- [ ] 实现组件列表的拖拽排序 (SortableJS / VueDraggable)
- [ ] 实现右侧属性面板的动态渲染 (根据 Schema 生成 Input)
- [ ] **风险点**：若拖拽实现困难，先降级为“点击上下移动”按钮

### 验收与产出
- 可视化编辑器基本能力：新增/删除/排序、字段编辑、撤销/草稿/发布
- JSON → Vue 渲染引擎：Schema First 渲染、插槽/变体支持

---

## Phase 3: 业务功能填充 (Week 5-6)
**目标**：对接 Shopify 和 Supabase，实现电商业务闭环。

### Week 5: 数据对接与 Runtime
- [ ] 实现 Shopify Product Picker (选择产品)
- [ ] 实现 Section 数据绑定真实产品信息 (Image, Price, Title)
- [ ] 实现静态页面生成逻辑 (Nuxt Generate)
- [ ] 性能优化：代码分割、资源预加载、图片优化

### Week 6: 交易闭环与 SEO
- [ ] 实现购物车 (Cart Drawer) 状态管理
- [ ] 对接 Shopify Storefront API (Add to Cart)
- [ ] 实现 Checkout 跳转
- [ ] SEO 三件套：标题/描述/OG、sitemap、robots

### 验收与产出
- Lighthouse（移动端）≥ 95
- 搜索引擎可抓取（含产品页）
- 购物车闭环可用

---

## Phase 4: UI 还原与整合 (Week 7)
**目标**：把 Stitch 的好看皮囊套在逻辑上。

### Week 7: 样式打磨
- [ ] 将 Stitch 生成的 HTML/CSS 转化为 Vue 组件
- [ ] 替换 Phase 2/3 中的简陋组件
- [ ] 移动端响应式适配检查
- [ ] 增加必要的交互动效 (Hover, Transition)

### 验收与产出
- 高保真 UI 还原度 ≥ 95%
- 移动端兼容性测试通过

---

## Phase 5: 验收与发布 (Week 8-9)
**目标**：兜底、文档与上线。

### Week 8: 测试与修缮
- [ ] 全面 Bug Bash (捉虫大会)
- [ ] 编写操作手册 (给非技术人员看)
- [ ] 监控/审计：错误告警、性能观测

### Week 9: 部署与 Buffer
- [ ] 配置 CI/CD 流水线 (GitHub Actions / GitLab CI)
- [ ] 部署到生产环境 (Vercel / AWS S3 + CloudFront)
- [ ] **Buffer**：处理前几周遗留的“没想好的细节”

### 验收与产出
- 发布流程可回滚；发布窗口与灰度策略验证
- 构建与监控链路稳定

---

## 风险控制策略 (针对新手团队)

1.  **抄作业**：不要从零造轮子。编辑器逻辑参考开源项目，UI 组件直接用 Stitch 生成的或 `shadcn-vue`。
2.  **Schema 先行**：数据结构 (JSON Schema) 是前后端协作的契约，**Week 1 必须定死**，避免后期改结构导致全盘重构。
3.  **每日站会**：
    -   每天早上 15 分钟同步进度。
    -   **Blocker 原则**：遇到卡顿超过 4 小时解决不了，必须立刻摇人或降级方案，严禁死磕。
4.  **降级策略**：如果进度严重滞后，优先砍掉“拖拽排序”、“复杂动画”、“撤销重做”等非核心功能，保“发布”和“下单”流程。

## 角色与分工
- **产品/运营**：定义内容结构与文案资产；确定发布节奏
- **前端/架构**：Schema/渲染/运行时实现；性能与 SEO
- **DevOps**：CI/CD、CDN、备份与监控

## 里程碑验收清单（汇总）
- [ ] 非开发人员完成首页配置与发布
- [ ] 产品页数据来自 Shopify，结构化数据合规
- [ ] Lighthouse（移动端）≥ 95，关键页面可缓存与预热
- [ ] Checkout 正常跳转 Shopify
- [ ] 发布有审计与回滚；监控与告警生效
