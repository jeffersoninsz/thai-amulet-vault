# 🎯 暹罗御藏 (Siam Treasures) — 项目核心规约 (v4.0 Diamond Standard)

> **SSOT 声明**: 本文件为项全周期唯一事实来源 (Single Source of Truth)。任何 AI 智能体或开发者进入本项目，必须首先阅读并完全遵守本规约。
> **最后更新**: 2026-03-17  |  **状态**: 生产运行中 (Production Active)

---

## 🔐 账户与认证体系 (Authentication & Credentials)

这是项目最核心的安全资产信息。请勿随意更改，如需重置请使用 `npx tsx scripts/seedAccounts.ts`。

### 1. 管理后台账户 (`/admin`)
用于管理库存、订单、媒体库及营销配置。

| 角色 | 登录邮箱 | 初始密码 | 来源/说明 |
|:--- |:--- |:--- |:--- |
| **SUPER_ADMIN** | `super@siamtreasures.com` | `password123` | 系统预置 (Seed)，拥有全量权限 |
| **ADMIN** | `admin@siam.com` | `admin123` | **常用开发/测试账号** (手动创建) |
| **STAFF** | `staff@siamtreasures.com` | `password123` | 运营账号，限编辑权限 |

### 2. 前台客户账户 (`/login`)
用于 C 端购买、订单追踪及 VIP 批发。

| 角色 | 登录邮箱 | 初始密码 | 说明 |
|:--- |:--- |:--- |:--- |
| **VIP_USER** | `vip@siamtreasures.com` | `password123` | 批发商/大客户，享受专属折扣 |
| **USER** | `user@siamtreasures.com` | `password123` | 普通信众/个人买家 |
| **WHOLESALE**| `customer@siamtreasures.com`| `password123` | 备用批发测试账号 |

---

## 🚀 生产运维手册 (Vercel & Production)

### 常用 Vercel 指令
若生产环境配置未生效，请按顺序执行以下检查：

1. **环境同步**: `vercel env pull .env.prod --environment production` (拉取生产环境变量)
2. **强制部署**: `vercel --prod` (直接推送到生产分支，跳过预览)
3. **日志监控**: `vercel logs siam-treasures.com` (查看实时生产报错)
4. **重新部署**: 若代码修改后网站未变化，请确保执行了 `git push` 或 `vercel --prod`。

---

## 🛠️ 技术栈与架构 (Tech Stack)

| 维度 | 组件 | 备注 |
|:--- |:--- |:--- |
| **核心框架** | Next.js 16.x (App Router) | 高度依赖 Server Actions |
| **数据库** | PostgreSQL (Neon.tech) | 生产环境；本地开发使用 SQLite |
| **ORM** | Prisma 5.22.0 | 每次 Schema 变更后需执行 `prisma generate` |
| **认证组件** | NextAuth.js v4 | JWT 策略 + Credentials Provider |
| **样式/UI** | Tailwind CSS v4 + Lucide Icons | 自定义黑金视觉系统 |
| **媒体存储** | Cloudinary | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dsvgbvi4y"` |

---

## 📈 CRO 营销配置说明

在后台 **Storefront** 面板中，可动态控制以下功能：

- **访客计数器 (Live Views)**:
  - **开关**: `fakeViewsEnabled` (必须为 TRUE 才会显示)
  - **位置**: 移动端右下角 (`fixed bottom-20`), PC 端右下角。
- **虚拟订单弹窗 (Fake Orders)**:
  - **频率**: 可调间隔 (30s - 120s)。
  - **数据**: 使用系统预设城市与昵称。

---

## 📜 关键变更日志 (Audit Log)

| 日期 | 变更内容 | 状态 |
|:--- |:--- |:--- |
| 03-17 | **修复移动端访客计数器**: 提升 z-index 至 9999，动态间距避让底部按钮。 | ✅ 已上线 |
| 03-17 | **权限修复**: 解决 SUPER_ADMIN 不被 `isAdminOrStaff` 识别的逻辑漏洞。 | ✅ 已完成 |
| 03-17 | **系统规约重构**: 重写 `PROJECT.md` 账户与运维章节，统一 SSOT。 | ✅ 最新 |

---

## ⚠️ 开发者红线
1. 修改 `SiteConfig` 后，由于有内存缓存，可能需要等待 60s 或手动清除。
2. Windows 下执行 `npx prisma generate` 必须先关闭 `npm run dev` 所在的终端，否则会报 `EPERM`。
3. **强制合并主分支**: 任何修复完成后，必须执行 `git push origin main --force` 确保本地与 GitHub、Vercel 三方对齐。

---
*Last Validated: 2026-03-17 11:30*
