# 🎯 暹罗御藏 (Siam Treasures) 项目元数据中心

> **Status**: 生产准备就绪 (Production Ready)
> **最后同步**: 2026-03-14
> **维护规约**: 任何 AI Agent 接入本项目，必须首先读取本文件与下方链接的 SSOT 文档。

---

## 1. 核心文档索引 (The Source of Truth)

| 文档 | 路径 | 用途 |
| :--- | :--- | :--- |
| **PROJECT.md** | `./PROJECT.md` (本文件) | 项目总纲、技术栈锁定、防失忆规约 |
| **README.md** | `./README.md` | 快速启动、目录地图、脚本索引 |
| **USER_GUIDE.md** | `./docs/superpowers/specs/USER_GUIDE.md` | 运营操作手册（给管理员/设计师看） |
| **PRD.md** | `./docs/superpowers/specs/PRD.md` | 产品需求定义 |
| **TDD.md** | `./docs/superpowers/specs/TDD.md` | 技术设计文档 |
| **ARCHITECTURE.md** | `./docs/superpowers/specs/ARCHITECTURE.md` | 架构图与系统拓扑 |
| **UI_ASSETS_MAPPING.md** | `./docs/superpowers/specs/UI_ASSETS_MAPPING.md` | 视觉资产分布与上云规范 |

---

## 2. 技术栈锁定 (Tech Stack - Ground Truth)

> **警告**: 以下为项目实际使用的技术栈，请勿凭假设修改。

| 层级 | 技术 | 版本 | 备注 |
| :--- | :--- | :--- | :--- |
| **框架** | Next.js (App Router) | 16.1.6 | 使用 Server Actions |
| **前端** | React | 19.2.3 | Server Components + Client Components |
| **UI** | Tailwind CSS | v4 | 自定义黑金主题 |
| **动画** | Framer Motion | 12.x | 页面过渡与微交互 |
| **图标** | Lucide React | 0.575.0 | — |
| **轮播** | Swiper | 11.x | 首页产品展示 |
| **数据库** | SQLite | — | 通过 Prisma ORM 操作，文件位于 `prisma/dev.db` |
| **ORM** | Prisma | 5.22.0 | Schema 位于 `prisma/schema.prisma` |
| **认证** | NextAuth.js | v4 (4.24.13) | JWT 策略 + Credentials Provider |
| **图床** | Cloudinary | — | `next-cloudinary` v6.17.5，无签名直传 |
| **支付** | Stripe | 20.4.0 | 集成中 |
| **图表** | Recharts | 3.7.0 | 后台数据面板 |
| **通知** | react-hot-toast | 2.6.0 | 全局 Toast 反馈 |

---

## 3. 环境变量清单

```env
# .env.local 中必须配置：
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret_key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dsvgbvi4y"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="siam_amulet_preset"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@dsvgbvi4y"
```

---

## 4. 测试账户

| 角色 | 邮箱 | 密码 | 创建方式 |
| :--- | :--- | :--- | :--- |
| SUPER_ADMIN | `super@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| STAFF | `staff@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| VIP_USER (批发) | `vip@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| USER (普通) | `user@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |

如果账户不存在，执行：`npx tsx scripts/seedAccounts.ts`

---

## 5. 已知问题与排雷记录

| 问题 | 原因 | 解决方案 | 日期 |
| :--- | :--- | :--- | :--- |
| Cloudinary 图片加载失败 | VPN/代理将 `res.cloudinary.com` 解析到私有 IP | `next.config.ts` 中设置 `images.unoptimized: true` | 2026-03-14 |
| `start-dev.bat` 秒退 | BAT 文件含中文导致 CMD 编码崩溃 | 重写为纯英文脚本 | 2026-03-14 |
| 图片更新后台无反应 | 缺乏错误捕获，Toast 未集成 | `AdminClient.tsx` 添加 try-catch + toast | 2026-03-14 |
| Next.js Image 400 错误 | 本地路径图片未被 `remotePatterns` 覆盖 | 全量迁移至 Cloudinary | 2026-03-13 |

---

## 6. 自动化执行规约 (For AI Agents)

1. **路径锁定**: 所有技术文档就地修改 (In-place edit)，严禁带日期后缀的冗余文档。
2. **验证闭环**: 修改代码后必须自行运行 `npm run dev` 验证。
3. **知识同步**: 重大变更后必须同步更新本文件与相关 `.md` 文档。
4. **防失忆**: 新会话开始时，必须先读本文件获取上下文。

---
*SSOT Last Updated: 2026-03-14T21:22+08:00*
