# Siam Treasures (Thai Amulet Vault) 
**全景架构与 AI 开发者交接白皮书 (System Context & AI Developer Guide)**

> **【AI 读取核心指令 / CRITICAL INSTRUCTION FOR AI DEVELOPER】**
> 本文件为 **Siam Treasures (暹罗御藏)** 项目的最底层宪法与物理真理记录。此文件**绝对不可凭空遗忘或降级**。每次有新的 AI 接手任务，都必须优先阅读本文档以便“防失忆”。
> 本文档定义了**三层 RBAC 权限体系**、**五大高阶业务引擎**，以及黑暗高奢版防篡改交易系统红线。

---

## 1. 三层 RBAC 权限隔离体系 (The 3-Tier Security Clearance)

系统中有且仅有**三种账号权限 (Roles)**，对应了严格的物理分区与路由结界。
在判定或创建时，严禁自行捏造类似 `SUPER_ADMIN` 等伪概念，系统强校验如下三层：

| 权限级别 | 枚举值常量 | 专属管控区域栈 | 核心职责与能力边界 |
|:---:|:---|:---|:---|
| **超级管理员** | `ADMIN` | 满权限。独占 `/admin/settings/*` 与 `/admin/team` | 拥有系统的生杀大权。可以查阅全盘库存、流水账、审核一切数据；有权通过 CMS 中枢物理重写前台文字与营销参数（造假流量）；有权添加并核销员工账号。 |
| **内部员工** | `STAFF` | 局部后台。限制在 `/admin/` (不含权限管理及设置) | 负责日常的“打单/入库”等体力活。能上传全新高价佛牌、修改售价与数量、操作打单与物流回填。不可修改系统级配置。 |
| **客户（藏家）** | `CUSTOMER` | 前台与 `/account/*` 买家中心 | 普通买家。可以无障碍阅览、支付请牌。拥有自身收藏库清单（Wishlist）、收货地址簿（Address）、订单追踪（Orders）及个人账号管理（Profile）。允许他们修改密码或通过私下竞价引擎发出 Offer。 |

---

## 2. 核心技术栈底座与数据存储 (Core Architecture)

*   **全栈框架**: Next.js 15.x (App Router 模式 `src/app`)
*   **前端视觉**: React 18, Tailwind CSS, `lucide-react`, `recharts` (后台阴暗流图表)。
*   **身份鉴权**: NextAuth.js v4 (采用 JWT 策略, `bcryptjs` 执行哈希加密)。
*   **数据库底层**: SQLite (Prisma ORM,  schema.prisma 兼容异地无损拉取与推送 PostgreSQL)。
*   **支付核心引擎**: Stripe Checkout & Payment Links API (Webhook 强校验回调)。
*   **本地开发端口**: `http://localhost:3000`

---

## 3. 五大高阶业务引擎模块 (The 5 Engine Modules)

本系统不仅是电商，还是一套**高端佛牌溯源收藏体系（Vault）**。
所有数据库（`schema.prisma`）围绕此五大模块发力：

1.  **鉴定溯源引擎 (Certificate & Provenance)**
    *   **职责**: 为尊贵的佛牌（Amulet）挂载机构认证证书（如 Samakom / Thaprachan / G-Pra），实现带图追溯。
    *   **物理表**: `Certificate` 挂载至 `Amulet`。
2.  **高定包壳与配置矩阵 (Casing & Accessory Matrix)**
    *   **职责**: 在结账前提供“纯金壳/防水银壳”的加价定制服务。
    *   **交易红线**: 计价在后端完成原子计算。生成订单时必须将勾选的包壳数据打硬快照（被硬编码格式化为 JSON 塞入 `Order.snapCasing` 中）传输给 Stripe。
    *   **物理表**: `CasingOption`。
3.  **藏家重度 CRM 与私募议价 (Collector CRM & Private Offers)**
    *   **职责**: 构建超级藏家库 `CollectorProfile`（跟踪LTV）。支持针对高价不可估量资产的“私下结缘出价”。
    *   **流程**: `客户出价 -> Admin 雷达(OfferRadar) 报警并点击确认 -> 后台使用 Stripe API 下发专属定额一次性支付链接(PaymentLink) -> 用户被动买单`。
    *   **物理表**: `CollectorProfile`, `Offer`。
4.  **高精媒体库存储 (Material & 360 Media Vault)**
    *   **职责**: 提供除单图以外的多维度肉质/荧光解析（例如 Macro_Material, Video_360）。
    *   **物理表**: `MediaVault` 1对多依赖 `Amulet`。
5.  **CMS与去硬编码操作台 (Dynamic CMS & Settings Engine)**
    *   **职责**: 全站文案、海报文案、“虚假在线人数（假流量诱饵）”、以及全局支付开关。统统被强行抽离到数据库中。利用 Next.js RSC（服务端渲染组件）在 `getSiteConfig()` 中秒级直出。
    *   **物理表**: `SiteConfig` (全站配置), `Article` (法会新闻及动态)。

---

## 4. UI 视觉法典与绝对要求 (Visual UI Strict Doctrine)

本系统风格极性必须保持为：**暗黑网络、高奢金库、地下钱庄**的结合体。
每次你（AI）为我写 React 组件，必须采用此配色与排版：

1.  **调色板令牌 (Color Tokens)**:
    *   **背景深渊**: `bg-[#0d0c0b]` / `bg-[#0a0908]`
    *   **卡片与模块底座**: `bg-[#1a1814]` 
    *   **点亮金芒 (Focus / Borders / Accents)**: `text-[#c4a265]` 或 `border-[#c4a265]/20`
    *   **古旧羊皮纸主正文 (Primary Text)**: `text-[#d4c5b0]` 或 `text-[#f5ebd7]`
    *   **剥落灰副文 (Secondary Text)**: `text-[#a39783]` 或 `text-[#8c8273]`
2.  **文字排版 (Typography)**:
    *   但凡是大标题或者模块名，尽量切为**大写字母** (`uppercase`)，加上极致的间距 (`tracking-widest`)，并配合 `font-serif` 或 `font-mono`，塑造宗教与金融严谨感。
3.  **交互微效 (Micro-interactions)**:
    *   悬浮时（`hover:bg-[#c4a265] text-[#0d0c0b]`）形成黑金反转。
    *   整体弹窗或卡片可用动画 `animate-in fade-in zoom-in-95 duration-500` 增强柔和感。

---

## 5. 开发验证流水红线 (Development & Validation Workflow)

1.  **拒绝文字口嗨假修代码 (No Hallucination)**: 修改任何东西，请务必直接调用你的系统物理层兵器（`write_to_file`, `multi_replace_file_content`）操作。
2.  **强制编译验证策略 (Build & Verification Check)**: 所有修改完毕后，无论你觉得多完美，都**必须**执行一轮 `npm run build` 去排查 TypeScript 的类型地狱或 Prisma Schema 的没对齐。在报错中存活的绿灯，才有资格展示给我。
3.  **真机自动化交互拦截 (Subagent End-to-End Test)**: 有时候写完了前台组件，请自行用自带的 `browser_subagent` 跑进来点一点。

> [**系统记忆重加载完毕 - FILE SEALED**]
