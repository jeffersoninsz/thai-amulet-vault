# 🧪 暹罗御藏 (Siam Treasures) 技术设计文档 (TDD)

> **版本**: 4.0 | **最后同步**: 2026-03-14
> **Status**: 深度开发白皮书

---

## 1. UI 工程架构

### 1.1 深邃泰罗设计系统

**色彩 Token** (`globals.css`)

| Token | 值 | 用途 |
|:---|:---|:---|
| Background | `#0d0c0b` | 深邃黑底色，让佛牌成为焦点 |
| Foreground | `#d4c5b0` | 骨白/香灰色主文本 |
| Highlight (Gold) | `#c4a265` | 泰国寺庙金箔色，CTA/Hover/外发光 |

**微交互策略**
- Framer Motion：页面过渡、卡片入场、元素渐显
- 卡片 hover：700ms 缓动 scale 放大，模拟"放大镜"质感
- Swiper：首页产品轮播，触摸滑动支持

---

## 2. 后端核心机制

### 2.1 NextAuth v4 身份验证

> **注意**：使用的是 NextAuth **v4** (4.24.13)，非 v5。配置在 `src/lib/auth.ts`。

**认证方式**: Credentials Provider (邮箱 + 密码)
**Session 策略**: JWT (无服务端 session 存储)
**密码加密**: bcrypt (10 rounds)

```typescript
// 认证流程
authorize(credentials) → prisma.user.findUnique → bcrypt.compare
→ 返回 { id, email, name, role, permissions }
→ JWT callback 注入 role/permissions
→ Session callback 暴露到前端
```

**RBAC 鉴权**
- 角色枚举：`SUPER_ADMIN`, `STAFF`, `WHOLESALE`, `USER`
- Server Actions 通过 `getServerSession()` 拦截
- 只有 `STAFF` 及以上角色可触发写操作

### 2.2 数据库写操作范式

**核心规则**: 所有业务表的增删改必须在 `src/app/actions.ts` 中完成。

**强制审计宏**
```typescript
const { appendLog } = await import("@/api/logger");
await appendLog(
    session.user.name || "Unknown",
    "动作名称",
    "目标 ID",
    "改动详情",
    "WRITE"
);
```

**缓存清除**
写入完成后必须调用：
```typescript
revalidatePath("/admin");
revalidatePath("/");
```
以打破 Next.js 16 激进的静态化缓存策略。

### 2.3 错误处理与用户反馈

**前端** (`AdminClient.tsx`)
```typescript
try {
    await updateAmuletAction(id, updatedFields);
    toast.success("档案更新成功！");
    // 清除图片缓存
    setUploadedImages(prev => { const n = {...prev}; delete n[id]; return n; });
} catch (error) {
    toast.error("保存失败，请检查网络");
    console.error("[handleSave] Error:", error);
}
```

**后端** (`actions.ts`)
```typescript
console.log("[updateAmuletAction] Updating ID:", id);
console.log("[updateAmuletAction] imageUrl:", updatedFields.imageUrl);
// ... 如果失败
console.error("[updateAmuletAction] FAILED:", error);
```

---

## 3. 高级业务状态机

### 3.1 订单流转
```
PENDING → PAID → SHIPPED → DELIVERED
   │                │
   └─ snapAddress   └─ trackingNumber
   └─ snapCasing       trackingProvider
```
- **PENDING**: 用户提交 Checkout，锁定地址快照 + 外壳配置快照
- **PAID**: Stripe Webhook 确认 → 扣减库存 (`stock`)
- **SHIPPED**: 管理员录入物流单号 + 承运商
- **DELIVERED**: 达到终态

### 3.2 Offer 私洽议价
```
PENDING → ACCEPTED → 生成 stripePaymentLink
       └→ REJECTED
```

### 3.3 评论审核
```
提交 (isApproved: false) → 管理员审核 → isApproved: true → 前台展示
```

---

## 4. 前端组件策略

### 4.1 Cloudinary 集成

**上传组件**: `CloudinaryUploader.tsx`
- 使用 `next-cloudinary` v6.17.5 的 `CldUploadWidget`
- 无签名直传 (upload_preset)
- 上传成功后通过 `onUploadSuccess` 回调返回 `secure_url`

**图片显示**
- `next.config.ts` 配置了 `images.unoptimized: true`
- 原因：用户网络代理(VPN)将 `res.cloudinary.com` 解析到私有 IP，导致 Next.js 图片优化代理报错
- 效果：直接使用 Cloudinary 原始 URL，跳过 `/_next/image` 处理

### 4.2 RSC 与 Client Component 分工

| 层级 | 文件 | 策略 |
|:---|:---|:---|
| Server Component | `page.tsx` | 服务端直出数据，ISR 增量生成 |
| Client Component | `AdminClient.tsx` | 接管交互逻辑，表单/上传/状态管理 |
| Client Component | `AmuletShowcase.tsx` | 浏览器内存中多条件交差过滤，避免数据库 LIKE 查询 |

### 4.3 全局 Providers 架构 (`layout.tsx`)

```
<html>
  <body>
    <Toaster />                    ← react-hot-toast
    <ClientProviders>              ← SessionProvider + CartProvider
      <TopNav />
      {children}                   ← 页面内容
      <Footer />
      <VisitorCounter />           ← 在线人数
      <FakeOrderToast amulets />   ← 假销量弹窗
    </ClientProviders>
  </body>
</html>
```

---

## 5. 数据库设计

**ORM**: Prisma 5.22.0
**数据库引擎**: SQLite（文件位于 `prisma/dev.db`）
**总模型数**: 19

### 关键模型字段速查

**Amulet** (圣物)
```
id, nameZh, nameEn, nameTh, descZh, descEn, descTh
materialZh, materialEn, monkOrTemple, year
imageUrl, price, wholesalePrice?, moq, stock, isB2bOnly
→ comments[], wishlistedBy[], orderItems[], certificates[], media[], offers[]
```

**User** (用户)
```
id, name, email, passwordHash, role, permissions?
companyName?, paymentTerms
→ accounts[], sessions[], comments[], orders[], wishlists[], addresses[], profile?, offers[]
```

**Order** (订单)
```
id, userId, total, status, orderType, purchaseOrder?
snapAddress?, snapPhone?, snapCasing?
trackingNumber?, trackingProvider?, stripeSessionId?
→ items[]
```

**SiteConfig** (站点配置)
```
heroTitleZh/En, heroDescZh/En, announcementBarZh/En
footerTextZh/En, copyrightYear, systemVersionText
baseVisitorCount, isVisitorCounterEnabled, visitorIncrementRate
isSalesPopupEnabled, salesPopupFrequency
isStripeEnabled, isOfferEnabled
```

---
*TDD v4.0 - Synced 2026-03-14*
