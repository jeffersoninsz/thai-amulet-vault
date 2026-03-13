# Siam Treasures (Thai Amulet Vault) - 核心需求与技术架构说明书 (PRD & Tech Spec)

**文档版本**: v1.0 (最终交付修订版)
**生成日期**: 2026-03-01
**项目代号**: Thai Amulet Vault (暹罗秘库)

---

## 第一部分：产品需求文档 (PRD)

### 1. 产品定位与愿景
**Siam Treasures** 是一个面向全球藏家的顶级、去中心化的泰国佛牌（圣物）垂直电商与文化交流平台。不同于传统的在线商店，本站致力于打造极具“神圣感”、“金库感”与“文化厚重感”的沉浸式体验（Dark Mode / 金色点缀 / 高端质感）。

### 2. 核心用户角色 (RBAC - 基于角色的访问控制)
系统划分为三大明确的层级，并在访问入口上进行严格的物理与逻辑隔离：
*   **CUSTOMER (买家/藏家)**: 
    *   主要活动于前台商品展示区（Storefront）与客户个人空间（`/account`）。
    *   可浏览圣物、切换多语言、管理购物车、提交结账、查看自身订单状态。
*   **STAFF (普通员工/审核员)**: 
    *   活动于企业级管理后台（`/admin`）。
    *   最高仅可处理日常业务：佛牌上架/下架、修改价格/库存量、更新订单的物流状态（如发货）。
    *   **受限**：无法查看审计日志、无法修改系统全局设置、无法添加或封停其他员工。
*   **ADMIN (超级管理员/站长)**: 
    *   拥有系统最高生杀大权。独享 `/admin/team`（员工编制管理）、`/admin/settings`（全站页面配置）与 `/admin/logs`（员工操作监控上帝视角）。

### 3. 前台业务模块 (Storefront & C-End)
*   **多语言中枢 (i18n)**: 全站支持实时热切换 `中文 (ZH)`、`英文 (EN)` 与 `泰文 (TH)`。数据库的商品详情自动匹配对应语言。
*   **圣物大厅 (Showcase & Filtering)**: 支持按“年份”、“师傅/寺庙”、“功效”进行精准与模糊组合筛选。支持分页与“加载更多”（Load More）以优化性能。
*   **圣物详情 (Amulet Detail)**: 沉浸式单品展示，动态计算库存。若库存低于阈值，系统实时显示余量或变更为“缺货 (Out of Stock)”且锁定购买按钮。
*   **购物车与结算 (Cart & Checkout)**:
    *   纯动态购物车，支持商品增删改查。
    *   Checkout 环节强制登录验证（OAuth / 凭证提取）。
    *   防超卖并发锁：提交订单时由底层开启串行事务，只有库存足够才会扣减并生成订单（状态默认为 `PENDING`）。
*   **买家个人金库 (`/account/*`)**:
    *   专属 Dashboard。包含“个人信息 (`/account/profile`)”、“订单追踪 (`/account/orders`)”、“收藏碑 (`/account/wishlist`)”、“收货地址 (`/account/addresses`)”。

### 4. B端后台管理系统 (Admin CMS)
脱胎换骨的全新企业大厂风 Dashboard，与前台彻底剥离，侧边栏布局：
*   **库房大盘控制 (`/admin`)**: Amulet 表的完整 CRUD。管理实时动态库存、定价、主图配置。
*   **物流与订单管理 (`/admin/orders`)**: 查看全球所有藏家提交的订单明细（姓名、地址、电话、货品组合），支持管理员一键将状态变更为 `PAID`, `SHIPPED`, `DELIVERED`。
*   **权限队伍管理 (`/admin/team` - 仅限 Admin)**: 创建、分配 STAFF 子账号，一键吊销内鬼员工权限。不允许普通用户自行注册为员工。
*   **操作监控室 (`/admin/logs` - 仅限 Admin)**: 全站天眼审计。任何人（含超级管理员）修改定单、改价格、改库存、添加新员工，均会被强制不可逆写入日志，暴露追踪ID与操作详情。
*   **业务设置 (`/admin/settings` - 仅限 Admin)**: 通过可视化表单直接修改前台首页的联系邮箱、欢迎语等全局参数，无须修改代码。

---

## 第二部分：技术规范与架构文档 (Tech Spec)

### 1. 技术栈选型
*   **核心框架平台**: Next.js 15.x (基于 React, 使用 App Router `src/app` 架构)。全面使用 `Server Components` 加速首屏渲染并防范爬虫获取核心逻辑。
*   **UI 与样式引擎**: Tailwind CSS (PostCSS驱动)，配合 Lucide-React 图标库。UI 贯彻极简、深色、具有宗教仪式感的设计哲学。
*   **鉴权与会话中间件**: NextAuth.js (v4)。采用 JWT (JSON Web Tokens) 策略进行跨端身份防伪校验，包含强制 Role (角色) 下发。
*   **持久层与 ORM**: Prisma ORM。
*   **数据库底层**: SQLite (开发期与初期极速验证选用 `dev.db`)，后续随时可以通过修改 schema 平滑秒切至 PostgreSQL 或 MySQL，无须改动任何手写业务逻辑。

### 2. 核心数据字典设计 (Database Schema)
包含但不限于以下业务强相关实体表（详见 `prisma/schema.prisma`）：
1.  **Amulet**: 商品骨干。内置中/英/泰多语言字段 (如 `nameZh`, `nameEn`, `descTh`)，包含关键数字 `price`, `stock`。
2.  **User**: 身份骨干。内置 `role` (`ADMIN`, `STAFF`, `CUSTOMER`)，与订单和日志表强关联。
3.  **Order** & **OrderItem**: 订单主表与明细记录表。包含地址快照 (Snapshot) 以防买单后用户修改个人地址导致历史订单数据畸变。
4.  **AuditLog**: 审计合规记录。包含 `username`, `type` (READ/WRITE/SYSTEM), `action`, `details`。

### 3. 系统级安全协议 (Security Posture)
*   **路由级拦截**: `src/app/admin/layout.tsx` 和 `src/app/account/layout.tsx` 在服务器布局构建时即获取 `getServerSession`。这意味着黑客即使禁用了本地 JavaScript，也无法看到任何后端的隐藏 UI 结构数据（真正的服务端路由屏障）。
*   **API 防护盾**: 每一个向 `src/app/api/admin/*` 发送的 CRUD 请求，首行都必须校验 NextAuth 的 Token 真实性并校验 Role 权限字段，抛弃任何隐晦越权操作。
*   **事务级原子性**: 在高并发结账路由 `/api/checkout` 内，强制要求通过 `prisma.$transaction` 包裹扣库和生单的过程。如果扣库存失败，订单必然取消，绝对防止资金损失或超卖尴尬。
*   **密码堡垒**: 所有的自建账号身份均由强哈希算法 `bcryptjs` 执行 10 轮加盐后存入 DB。

### 4. 工程与部署规范
*   **启动/调试要求**: Windows 11 / Node.js >= 18.x。
*   **依赖包管理**: `npm install`。
*   **数据库迁移同步**: 后端字段若发生任何变更，开发人员须执行 `npx prisma generate` 刷新推导引擎，紧接 `npx prisma db push` 执行表结构推送。
*   **编译构建 (Vercel Ready)**: 通过了最新 `Turbopack` 和 TypeScript 严格模式类型审查。可随时以零配置输入 `npm run build` 打包为高并发生产包产物并直接发布。
