# 🎯 暹罗御藏 (Siam Treasures) 项目元数据中心

> **Status**: 生产准备就绪 (Production Ready)
> **最后同步**: 2026-03-17
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

## 1.5. 核心功能 (Core Features)

- **管理员控制台**: 实时库存管理、订单追踪、信众档案管理（支持角色调整与帐号注销）、系统日志审计、性能监控与自动化维护。

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
| 网页跳转缓慢 | 数据库位于 AWS us-east-1 导致高 RTT | 实施 SiteConfig 内存缓存 + Promise.all 并行化 | 2026-03-15 |
| 根目录太乱 | 临时测试脚本堆积 | 整合为 `scripts/maintain.py` 并清理冗余 | 2026-03-15 |
| 用户删除功能缺失 | 初始版本未包含此管理能力 | 在后端 Actions 与 UI 层实现全链路注销逻辑 | 2026-03-15 |
| 构建脚本路径报错 | 清理文件后残存旧路径引用 | 清理 `.next` 缓存并补齐必要路由占位文件 | 2026-03-15 |
| 后台图片上传保存失败 | `actions.ts` RBAC 只检查 `ADMIN`/`STAFF`，不识别 `SUPER_ADMIN` | 新增 `isAdminOrStaff()` 辅助函数统一 6 处角色校验 + hidden input 添加 `key` 强制同步 | 2026-03-17 |

---

## 6. 自动化执行规约 (For AI Agents)

1. **缓存同步**: 修改 `SiteConfig` 或核心配置后，需调用 `clearSiteConfigCache()` 或等待 TTL 过期。
2. **强制精简**: 严禁在根目录创建 `test.php`, `tmp.txt` 等临时文件。所有诊断应写为 `scripts/` 下的标准化工具。
3. **维护脚本**: 任何重大变更后，应运行 `python scripts/maintain.py` 进行健康检查。
4. **Git 准则**: 确保每次重大优化后都强制推送到 GitHub 以保证 SSOT 同步。

---
*SSOT Last Updated: 2026-03-17T08:40+08:00 (Image Upload RBAC Fix Verified)*
