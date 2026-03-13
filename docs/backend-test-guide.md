# Siam Treasures - 后端管理员与员工测试流程指南

本指南用于指导开发者或运营成员如何在本地测试环境或部署环境中验证网站的管理功能（如：审核评论、发布动态、管理库存等最高权限或员工权限功能）。

## 1. 账号角色架构体系
基于 `Next-Auth` 与 Prisma 数据库，本系统规划了以下三大核心角色，分别拥有递增的权限集：

*   **`CUSTOMER` (普通访客/客户)**：默认角色。仅可浏览商品、加入收藏柜、结缘（模拟购买）、发布普通评价。
*   **`STAFF` (普通员工)**：除了普通用户权限外，可登录后台看板，处理订单（模拟），查看客户留言，但不可修改全局配置或直接删除别人发表的高级评论。
*   **`ADMIN` (最高权限管理员)**：全知全能。可以直接审核留言，精选留言在首页的 `InstagramCarousel` （Instagram风格评论瀑布流）中展示，可以修改库存结构，上传海报图片等。

## 2. 本地测试账号一览表 （推荐直接注入数据库）

为了方便本地连调，推荐您使用以下一组预设账号即可打通全链路测试：

| 用户等级 | 账号名 (Email) | 密码 (Password/模拟) | 核心测试功能描述 |
| :--- | :--- | :--- | :--- |
| **最高统帅 (ADMIN)** | `admin@siamtreasures.com` | `siam123456` | 审核普通用户的评价；配置前端 Mega Menu；管理活动大版大促海报。 |
| **运营员工 (STAFF)** | `staff@siamtreasures.com` | `staff123456` | 模拟响应在线客服信息；管理打包发货流程；上传基础佛牌信息。 |
| **普通买家 (CUSTOMER)** | `buyer@example.com` | `buyer123` | 测试购物车系统；购买后填写购买心得；上传佛牌实录返图（用于被Admin抽选）。 |

## 3. 测试与赋权流程（本地极速模拟法）

由于现阶段您的项目尚未接入复杂的 SSO 或企业级密码校验池，最快的后台功能调试方式为 **“数据库硬编码直接注入”**。

### 步骤一：创建模拟用户
您可以直接在您的 `prisma/seed.ts` 或直接操作 SQLite / 数据库管理工具注入上述测试账号的记录。

```typescript
// 示例 Prisma 注入语句 
await prisma.user.upsert({
  where: { email: 'admin@siamtreasures.com' },
  update: { role: 'ADMIN' }, // 强制赋予 ADMIN 权限
  create: {
    email: 'admin@siamtreasures.com',
    name: 'Siam Super Admin',
    role: 'ADMIN',
  },
})
```

### 步骤二：如何在前端获取与判定当前角色
在前端拦截器或受保护的 Admin 页面 (`app/admin/layout.tsx` 等)，直接获取 Session 校验 `role`：
```typescript
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// 示例判定：
const session = await getServerSession(authOptions);
// 只有 ADMIN 才能进入：
if (!session || session.user.role !== "ADMIN") {
  redirect("/login?denied=true");
}
```

### 步骤三：“Instagram 风格评论流” 的核心测试链路
1.  **作为普通买家（或直接以管理员身份）**进入某块佛牌的详情页（如 `AmuletDetailClient` 界面）。
2.  填写并发表一条高于 4 星好评的评论，**必须包含图片**。
3.  目前为了演示前端效果，`src/api/db.ts` 中的 `getAdminReviewComments` 已经配置了专门提取 **拥有图片且星级较高** 的优质回传图进行独立展示。
4.  如果要模拟真实世界的“审批发表”，需要用 ADMIN 凭证登录后，在后台的 `Comment Management` 面板中，将特定留言状态置为 `isApproved = true`。

## 4. 自动化回归测试（建议）
建议您随时保留一个以管理员态登录的浏览器 Mock Session，配合我们刚刚配置好的 `cypress` 或 `browser subagent` 定期进行一键巡检，防止因样式改版（如把导航栏增厚）而导致后台的关键性 `Submit` 按钮被压住无法点击。
