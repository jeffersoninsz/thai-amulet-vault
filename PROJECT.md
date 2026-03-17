# 🎯 暹罗御藏 (Siam Treasures) — 项目 SSOT

> **Status**: Production Ready  
> **最后更新**: 2026-03-17T12:00+08:00  
> **规约**: 任何 AI Agent 接入本项目，必须首先读取本文件。

---

## 1. 文档索引

| 文档 | 路径 | 用途 |
|:-----|:-----|:-----|
| **PROJECT.md** | `./PROJECT.md` (本文件) | 项目总纲、技术栈、账户、防失忆规约 |
| **README.md** | `./README.md` | 快速启动、目录结构 |
| **PRD.md** | `./docs/superpowers/specs/PRD.md` | 产品需求定义 |
| **TDD.md** | `./docs/superpowers/specs/TDD.md` | 技术设计文档 |
| **ARCHITECTURE.md** | `./docs/superpowers/specs/ARCHITECTURE.md` | 系统架构拓扑 |
| **USER_GUIDE.md** | `./docs/superpowers/specs/USER_GUIDE.md` | 运营操作手册 |

---

## 2. 核心功能

| 功能模块 | 说明 |
|:---------|:-----|
| **库存管理** | 佛牌 CRUD、分类、价格、库存追踪、搜索过滤 |
| **订单系统** | 购物车、结账、Stripe 支付（集成中）、订单追踪 |
| **用户管理** | 三级 RBAC（SUPER_ADMIN / ADMIN / STAFF）、信众档案、账号注销 |
| **MediaVault 图库** | 每产品最多 5 张图片/视频、上下箭头拖拽排序、从 Cloudinary 图库选择已有图片、删除、上传新图片、首张自动设主图 |
| **动态 Banner** | 后台 Storefront 面板 PC/Mobile 独立上传、类型选择器（图片/视频/HTML·SVG）、实时预览 |
| **产品 Gallery** | 前端 Swiper 接入真实 MediaVault 数据、支持图片+视频混合展示 |
| **CRO 营销** | 虚假订单模拟、虚假访客计数器、营销 Pop-up 配置 |
| **前端陈列 CMS** | Hero 大图块编辑、导航菜单管理、Banner 广告管理 |
| **系统监控** | 操作日志审计、性能面板（Recharts 图表） |

---

## 3. 技术栈

| 层级 | 技术 | 版本 | 备注 |
|:-----|:-----|:-----|:-----|
| 框架 | Next.js (App Router) | 16.1.6 | Server Actions |
| 前端 | React | 19.2.3 | Server + Client Components |
| UI | Tailwind CSS | v4 | 自定义黑金主题 |
| 动画 | Framer Motion | 12.x | 页面过渡与微交互 |
| 图标 | Lucide React | 0.575.0 | — |
| 轮播 | Swiper | 11.x | 产品 Gallery |
| 数据库 | SQLite | — | `prisma/dev.db` |
| ORM | Prisma | 5.22.0 | `prisma/schema.prisma` |
| 认证 | NextAuth.js v4 | 4.24.13 | JWT + Credentials (bcrypt) |
| 图床 | Cloudinary | — | `next-cloudinary` v6.17.5 |
| 支付 | Stripe | 20.4.0 | 集成中 |
| 图表 | Recharts | 3.7.0 | 后台数据面板 |
| 通知 | react-hot-toast | 2.6.0 | 全局 Toast |

---

## 4. 环境变量

```env
# .env.local
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret_key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dsvgbvi4y"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="siam_amulet_preset"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@dsvgbvi4y"
```

---

## 5. 系统账户（数据库实际状态）

### 管理员账号（可登录后台 `/admin`）

| 角色 | 邮箱 | 密码 | 来源 |
|:-----|:-----|:-----|:-----|
| **ADMIN** | `admin@siam.com` | `admin123` | 手动创建 |
| **SUPER_ADMIN** | `super@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| **STAFF** | `staff@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |

### 前台用户账号

| 角色 | 邮箱 | 密码 | 来源 |
|:-----|:-----|:-----|:-----|
| **VIP_USER** | `vip@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| **USER** | `user@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |
| **WHOLESALE** | `customer@siamtreasures.com` | `password123` | `scripts/seedAccounts.ts` |

> **重置账户**: 运行 `npx tsx scripts/seedAccounts.ts` 可恢复 seed 账户。  
> **认证机制**: NextAuth.js Credentials Provider + bcrypt 密码哈希 + JWT Session。  
> **RBAC 权限**: `SUPER_ADMIN` / `ADMIN` / `STAFF` 可访问后台，其余角色仅限前台。

---

## 6. 关键 API 路由

| 路由 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/admin/media` | GET/POST/PUT/DELETE | MediaVault CRUD + 排序（产品多图管理） |
| `/api/admin/settings/config` | GET/POST | SiteConfig 配置读写（含 Banner） |
| `/api/admin/settings/site` | GET/POST | 站点参数读写 |
| `/api/admin/amulets` | GET/POST/PUT/DELETE | 佛牌产品 CRUD |
| `/api/auth/[...nextauth]` | — | NextAuth 认证端点 |

---

## 7. 排雷记录

| 问题 | 解决方案 | 日期 |
|:-----|:---------|:-----|
| Cloudinary 图片加载失败 | `next.config.ts` 设置 `images.unoptimized: true` | 03-14 |
| BAT 脚本秒退 | 重写为纯英文脚本 | 03-14 |
| 图片上传无反馈 | `AdminClient.tsx` 添加 try-catch + toast | 03-14 |
| Next.js Image 400 | 全量迁移至 Cloudinary | 03-13 |
| 页面跳转缓慢 | SiteConfig 内存缓存 + Promise.all 并行化 | 03-15 |
| 用户删除功能缺失 | 后端 Actions + UI 全链路注销逻辑 | 03-15 |
| RBAC 不识别 SUPER_ADMIN | `isAdminOrStaff()` 统一 6 处角色校验 | 03-17 |
| 移动端无访客计数器 | 移除 `hidden md:block`，改为响应式 fixed 定位 | 03-17 |
| 虚假订单设置重复 | 移除 Config 端重复区块，统一至 CRO 营销页 | 03-17 |
| Prisma generate EPERM | 先停 Node 进程再 `prisma generate` | 03-17 |
| 图片上传功能失效 | MediaVault schema 加 `sortOrder` 字段，重写 API route（加 PUT 排序），重写 MediaGalleryManager 组件 | 03-17 |
| DATABASE_URL 协议冲突 | `.env` 从 PostgreSQL Neon URL 改为 `file:./dev.db` 匹配 sqlite provider | 03-17 |

---

## 8. AI Agent 执行规约

1. **读取优先**: 接入项目前必须先读本文件，理解技术栈和账户体系。
2. **缓存同步**: 修改 `SiteConfig` 后需调用 `clearSiteConfigCache()` 或等 TTL 过期。
3. **路径锁定**: 严禁在根目录创建临时文件，诊断工具写入 `scripts/` 目录。
4. **Prisma 注意**: Windows 环境下 `prisma generate` 前必须停止 dev server。
5. **Git 规范**: 重大变更后必须 `git push origin main --force` 保持 SSOT 同步。
6. **编码强制**: 所有 Python 脚本输出中文必须加 UTF-8 流重置补丁。

---

*SSOT Last Updated: 2026-03-17T12:00+08:00*
