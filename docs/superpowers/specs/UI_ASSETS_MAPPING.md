# 🎨 暹罗御藏 (Siam Treasures) 视觉资产协作指南

> **最后同步**: 2026-03-14
> **目标读者**: UI/UX 设计师、前端工程师、内容运营

---

## 1. 图床架构

本项目已于 2026-03-14 全面完成 **Cloudinary 云端化**。所有业务图片托管在 Cloudinary CDN。

| 项目 | 值 |
|:---|:---|
| **云端账户** | `dsvgbvi4y` |
| **Upload Preset** | `siam_amulet_preset` (无签名直传) |
| **CDN 域名** | `res.cloudinary.com/dsvgbvi4y/image/upload/` |
| **图片优化** | 已关闭 Next.js 图片代理 (`unoptimized: true`)，直接使用 Cloudinary 原始 URL |

---

## 2. 静态资源层 (代码内)

存放路径: `public/` (仅保留应急备份，实际已全部上云)

| 文件 | 界面位置 | 代码引用 | 推荐尺寸 |
|:---|:---|:---|:---|
| `banner_pc.png` | 首页顶部 PC 大促海报 | `page.tsx` | 1920×600 px |
| `banner_mob.png` | 首页顶部移动端海报 | `page.tsx` | 1080×1440 px |
| `placeholder-amulet.png` | 全局默认占位图 | 全局 fallback | 800×800 px |
| `favicon.ico` | 浏览器标签页图标 | `app/favicon.ico` | 32×32 px |

---

## 3. 动态资源层 (数据库驱动)

这些图片通过后台管理上传到 Cloudinary，URL 存储在数据库中。

| 资产类别 | 界面位置 | 数据字段 | 代码组件 | 设计规格 |
|:---|:---|:---|:---|:---|
| **圣物图** | 首页九宫格、详情页、购物车、假销量弹窗 | `Amulet.imageUrl` | `AmuletCard.tsx`, `FakeOrderToast.tsx` | 1:1 正方形，纯黑底 `#0d0c0b`，≥800px |
| **买家秀** | 首页底部 Instagram 轮播 | `Comment.images` (JSON 数组) | `InstagramCarousel.tsx`, `CommentsList.tsx` | 手机直出图即可，系统自动裁切 |
| **文章首图** | 资讯列表 + 博客内页 | `Article.imageUrl` | `page.tsx` L172 | 16:9 横屏，1200×675 px |
| **鉴定证书** | 圣物详情页证书区 | `Certificate.imageUrl` | 详情页组件 | 清晰扫描件 |
| **360° 视角** | 圣物详情页媒体库 | `MediaVault.url` | 详情页组件 | 多角度图/视频 |

---

## 4. CSS 纹理图案

| 描述 | 界面位置 | 设计建议 |
|:---|:---|:---|
| 复古纸张底纹 | 博客/内页 hover 背景 | 纯黑底缝隙纹理 SVG |
| 金箔噪点 | 部分装饰区域 | 半透明 PNG overlay |

---

## 5. 设计师交付规范

### 出图规格

| 类型 | 尺寸 | 比例 | 背景 | 格式 |
|:---|:---|:---|:---|:---|
| PC Banner | 1920×600 px | 3.2:1 | 深色渐变，融入 `#0d0c0b` | JPG/PNG |
| 手机 Banner | 1080×1440 px | 3:4 | 主体靠上 | JPG/PNG |
| 圣物产品图 | ≥800×800 px | 1:1 | 纯黑 `#0d0c0b` | JPG/PNG |
| 文章封面 | 1200×675 px | 16:9 | 场景感强 | JPG/PNG |
| 文件大小 | ≤10 MB | — | — | — |

### 交付流程
```
设计师出图 (按上述规格)
    → 交给管理员
    → 管理员在后台上传 (通过 Cloudinary 组件)
    → 点击保存 → 线上即时生效
```

### Cloudinary 控制台直接编辑
如需微调 (裁切/调色)，设计师可登录 [Cloudinary Console](https://console.cloudinary.com) 直接操作，网站会自动加载最新版本。

---

## 6. 灾难恢复

**核心原则**: 严禁手动逐条修复数据库中的图片 URL。

当发生批量图床失效时：
1. 确认 `src/api/db.json` 中的原始数据完好
2. 执行恢复脚本：`node scripts/reupload-from-json.js`
3. 脚本会自动从 `db.json` 读取映射关系，批量上传至 Cloudinary 并更新数据库

---
*UI Assets Guide - Synced 2026-03-14*
