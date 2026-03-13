# 💎 SIAM TREASURES (暹罗御藏) - 全维度生态架构白皮书与状态中枢

> **Last Updated:** 2026-03-12
> **Context:** 本文件为项目的物理大脑地图 (Master State Hub)，绝对不允许因为 AI Agent 的会话刷新导致失忆。

## 一、 核心架构现状 (Current Architecture Status)
1. **Tech Stack**: Next.js 14 App Router, Tailwind CSS, Prisma (SQLite), NextAuth.js.
2. **Authentication Flow (已修复)**:
   - 全局登入态依靠 NextAuth `credentials` provider 维持。
   - 之前存在的 Edge Middleware `NEXTAUTH_SECRET` 获取失败导致无限重定向的死循环 Bug **已彻底解决**。
   - 现阶段登录（`super@siamtreasures.com` / `password123`）后，`window.location.href` 原生跳转将顺利进入 `/admin`。
3. **Database (Prisma/SQLite)**:
   - 使用 bcrypt 强制重置密码。测试账号均使用 `password123` 哈希。
   - 管理员账号: `super@siamtreasures.com`, `staff@...`, `vip@...`, `user@...`.
4. **Front-End & Admin UI**:
   - `TopNav.tsx` 涵盖全量用户的响应式登出功能 (`signOut` 挂载到 User 悬浮窗)。
   - `app/admin/layout.tsx` 管理员侧边栏已添加滚动条防止溢出遮挡，底部封装了 Client Component `<AdminSidebarFooter />` 彻底解决退出问题。
   - `app/layout.tsx` 已全局植入 `<Toaster />` (基于 `react-hot-toast`) 奢华 UI 弹窗反馈。

## 二、 宏观业务模型与流量漏斗 (Business Flow Architecture)

### 1. B2C 零售散客漏斗 (Storefront)
*   **触面**：`src/app/(storefront)` 及首页组件。
*   **逻辑**：普通游客进入瀑布流展厅，只可见公开的 `isB2bOnly = false` 商品。
*   **转化刺激 (CRO Engine)**：
    *   **心跳在线基数 (`VisitorCounter.tsx`)**：随机波动在线人数，制造 FOMO。
    *   **幽灵订单战报 (`FakeOrderToast.tsx`)**：模拟真实订单弹窗。

### 2. B2B 私域分销暗网 (Wholesale/VIP Portal)
*   **触面**：`src/app/quick-order/`
*   **防线**：受 NextAuth 会话角色保护 (`WHOLESALE` / `VIP_USER`)。
*   **逻辑**：全屏 Data Table 结构，解禁 `isB2bOnly = true` 绝密圣物，替换批发底价，使用批量加入购物车机制。

### 3. 三重物理鉴权运营中枢 (Siam Admin Vault)
*   **触面**：`src/app/admin/` 
*   **逻辑**：顶级 RBAC 防御塔。
    *   **SUPER_ADMIN**: 统御全场，配置全局参数与封禁员工。
    *   **ADMIN**: 产品管理库房主权。
    *   **STAFF**: 细微隔离，如仅 `["MANAGE_ORDERS"]` 发货操作权限。

## 三、 核心技术栈解构 (Atomic Tech Stack)
### 3.1 动态侧边抽屉购物车 (`CartContext.tsx`)
*   完全基于客户端 `localStorage` 与 React Hook 的双向绑定，应对高并发弱网。

### 3.2 边缘运行时防线 (`src/middleware.ts`)
*   硬件阻断任何未授权请求接触 `/admin/*`，硬编码硬核防御机制 `secret: process.env.NEXTAUTH_SECRET`。

### 3.3 数据库特征 ( Prisma Schema )
*   **`Order` 快照冻结 (Snapshot)**: 结账时记录快照，保障地址不可变性。
*   **`Amulet`**: 双语结构挂载多种资产。

## 四、 项目灾难恢复与代码执行指南 (Disaster Recovery)

如果项目因为新代码注入报废或 AI 失忆，**立刻执行预案**：
1. **重建数据库宇宙**: `npx prisma generate` && `npx prisma db push --force-reset`
2. **启动创世粒子引擎**: 
   - `npx tsx scripts/seed.ts` (基础数据)
   - `npx tsx scripts/seedAccounts.ts` (超管密码重置)
3. **紧急密码**: 
   - `super@siamtreasures.com` / `password123`
   - `vip@siamtreasures.com` / `password123`

> AI Agent 必须在每个全新会话强制阅读此文档以重建系统图谱上下文。
