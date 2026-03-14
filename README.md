# 🕉️ 暹罗御藏 (Siam Treasures / Thai Amulet Vault)

> 全球化泰佛文化数字档案馆与高端电商平台
> Next.js 16 · React 19 · Cloudinary · Prisma/SQLite

---

## 🚀 快速启动

### 方式一：双击启动 (推荐)
直接双击项目根目录下的 **`start-dev.bat`**，自动清理端口并启动。

### 方式二：命令行启动
```bash
npm run dev
```

启动成功后访问：
- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin

---

## 📂 项目目录地图

```
thai-amulet-vault/
├── prisma/
│   ├── schema.prisma        # 数据库模型定义 (19 个业务模型)
│   ├── dev.db                # SQLite 数据库文件
│   ├── seed.ts               # 数据库初始化种子
│   └── migrations/           # Prisma 迁移记录
│
├── src/
│   ├── api/
│   │   ├── db.ts             # 数据库操作层 (Prisma CRUD)
│   │   ├── db.json           # 初始数据备份 (用于灾难恢复)
│   │   ├── logger.ts         # 操作日志记录器
│   │   └── settings.ts       # 站点配置读写
│   │
│   ├── app/
│   │   ├── page.tsx           # 首页 (Hero Banner + 产品展示)
│   │   ├── layout.tsx         # 全局布局 (导航 + Footer + Toast)
│   │   ├── actions.ts         # Server Actions (全部写操作集中于此)
│   │   ├── admin/             # 后台管理系统
│   │   │   ├── page.tsx       # 后台服务端入口
│   │   │   └── AdminClient.tsx # 后台客户端主逻辑
│   │   ├── amulet/[id]/       # 圣物详情页 (动态路由)
│   │   ├── collections/       # 全部圣物网格浏览
│   │   ├── cart/              # 购物车
│   │   ├── checkout/          # 结算页 (含 B2B PO Number)
│   │   ├── auth/              # 认证页面 (登录/注册)
│   │   ├── account/           # 用户账户中心
│   │   ├── blog/              # 资讯/博客
│   │   ├── story/             # 品牌故事页
│   │   └── quick-order/       # 快速下单入口
│   │
│   ├── components/
│   │   ├── TopNav.tsx         # 顶部导航栏
│   │   ├── Footer.tsx         # 页脚
│   │   ├── AmuletCard.tsx     # 圣物卡片组件
│   │   ├── AmuletShowcase.tsx # 首页圣物展示 (客户端过滤)
│   │   ├── CommentsList.tsx   # 买家评论组件
│   │   ├── InstagramCarousel.tsx # 买家秀轮播
│   │   ├── FakeOrderToast.tsx # 假销量弹窗引擎
│   │   ├── VisitorCounter.tsx # 在线人数计数器
│   │   ├── ClientProviders.tsx # 客户端 Provider 封装
│   │   └── admin/
│   │       └── CloudinaryUploader.tsx # Cloudinary 图片上传组件
│   │
│   ├── lib/
│   │   └── auth.ts           # NextAuth 配置 (JWT + Credentials)
│   │
│   ├── contexts/             # React Context (购物车等)
│   ├── types/                # TypeScript 类型定义
│   └── middleware.ts         # 路由中间件 (认证守卫)
│
├── scripts/
│   ├── seedAccounts.ts       # 创建测试账户 (4个角色)
│   ├── seed.mjs              # 初始化圣物数据
│   ├── reupload-from-json.js # 灾难恢复：批量修复图床链接
│   ├── migrate-images.js     # 图片迁移工具
│   └── ...                   # 其他辅助脚本
│
├── docs/superpowers/specs/
│   ├── PRD.md                # 产品需求文档
│   ├── TDD.md                # 技术设计文档
│   ├── ARCHITECTURE.md       # 架构设计文档
│   ├── UI_ASSETS_MAPPING.md  # 视觉资产映射
│   └── USER_GUIDE.md         # 运营操作手册
│
├── PROJECT.md                # 项目元数据中心 (SSOT 总纲)
├── start-dev.bat             # Windows 一键启动脚本
├── next.config.ts            # Next.js 配置 (图片域名白名单)
└── package.json              # 依赖清单
```

---

## 🔑 核心配置

### 环境变量 (`.env.local`)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dsvgbvi4y"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="siam_amulet_preset"
```

### 测试账户
执行 `npx tsx scripts/seedAccounts.ts` 创建以下账户（密码统一为 `password123`）：

| 角色 | 邮箱 |
| :--- | :--- |
| 超级管理员 | `super@siamtreasures.com` |
| 运营员工 | `staff@siamtreasures.com` |
| VIP 批发商 | `vip@siamtreasures.com` |
| 普通用户 | `user@siamtreasures.com` |

---

## 🛠️ 常用脚本

```bash
# 启动开发服务器
npm run dev

# 创建测试账户
npx tsx scripts/seedAccounts.ts

# 灾难恢复 (批量修复图床链接)
node scripts/reupload-from-json.js

# 数据库迁移
npx prisma migrate dev

# 数据库可视化
npx prisma studio
```

---

## 📖 详细文档

- **运营操作手册**: [USER_GUIDE.md](./docs/superpowers/specs/USER_GUIDE.md) — 给管理员和设计师看
- **产品需求**: [PRD.md](./docs/superpowers/specs/PRD.md) — 功能定义与业务逻辑
- **技术设计**: [TDD.md](./docs/superpowers/specs/TDD.md) — 架构决策与 API 规范
- **架构图**: [ARCHITECTURE.md](./docs/superpowers/specs/ARCHITECTURE.md) — 系统拓扑
- **项目元数据**: [PROJECT.md](./PROJECT.md) — 技术栈锁定 + 排雷记录 + AI Agent 规约

---
*Siam Treasures - Built with Next.js 16 - 2026*
