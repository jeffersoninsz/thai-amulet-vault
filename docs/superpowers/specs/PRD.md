# 🕉️ 暹罗御藏 (Siam Treasures) 产品需求文档 (PRD)

> **版本**: 5.1 | **最后同步**: 2026-03-15
> **项目定位**: 全球化泰佛文化数字档案馆与高端电商 (DTC / B2B 双轨) | 已集成极致性能加速模式

---

## 1. 业务全景图

暹罗御藏不是普通的电商店铺，而是由 **19 个强关联数据模型**驱动的信仰交易与文化传承平台。融合了零售、批发、内容营销、流量制造与社交证明。

### 1.1 面向收藏家的旅程 (DTC)

**多语种架构**
- 中文 (Zh) / 英文 (En) / 泰文 (Th) 三语数据结构
- 前端通过 Context + Hook 实现无刷新语言切换

**高级筛选系统** (`AmuletShowcase.tsx`)
- 法相类型：崇迪、必打、坤平、四面神、冠兰
- 名师法脉：阿赞多系、龙婆坤、龙婆添、龙婆班
- 神圣功效：招财致富、挡灾避险、极佳人缘、健康平安
- 核心材质：粉牌、金属牌、冠兰材质
- 全部在浏览器内存中完成交差过滤，零数据库查询

**结算闭环**
- 购物车 → Stripe 信用卡即时付款
- 地址快照防篡改 (`snapAddress`)

### 1.2 面向牌商的批发引擎 (B2B)

| 功能 | 字段/模型 | 说明 |
|:---|:---|:---|
| 批发专属价 | `Amulet.wholesalePrice` | 登录 WHOLESALE 角色后可见 |
| 起订量限制 | `Amulet.moq` | 最低起订量 |
| B2B 专属产品 | `Amulet.isB2bOnly` | 仅批发商可见 |
| 公司实体 | `User.companyName` | 批发商资料 |
| PO 号采购 | `Order.purchaseOrder` | B2B 订单附采购单号 |
| 账期支付 | `User.paymentTerms` | IMMEDIATE / NET30 / NET60 |

---

## 2. 营销与信任加速器

### 2.1 在线人数模拟 (`VisitorCounter.tsx`)
- 基数 `baseVisitorCount` (默认 1250)
- 间隔自增 `visitorIncrementRate` (默认 +5)
- 跳动间隔 `visitorTickInterval` (默认 12 秒)
- 后台可开关、可调参

### 2.2 假销量弹窗 (`FakeOrderToast.tsx`)
- 间隔 5~15 分钟随机弹出
- 从城市池/姓名池随机抽取 + 绑定真实佛牌图片
- 城市池：北京、上海、广州、深圳、成都、香港、台北、新加坡、纽约、多伦多 等
- 后台可配城市池与弹窗频率

### 2.3 买家秀轮播 (`InstagramCarousel.tsx`)
- 首页底部 Instagram 风格滚动展示
- 来源：后台审核通过的五星带图评论 (`Comment.isApproved: true`)

---

## 3. 圣物溯源体系

### 3.1 鉴定证书 (`Certificate` 模型)
- 支持萨马空 (Samakom)、塔帕占 (Thaprachan)、G-Pra 等多机构
- 独立发证日期与防伪编号

### 3.2 外壳定制 (`CasingOption` 模型)
- 金壳 / 银壳 / 亚克力防水等多材质
- 附加价格 (`additionalPrice`) + 交付时间 (`leadTimeDays`)

### 3.3 私洽议价 (`Offer` 模型)
- 用户发起出价 → ADMIN 审批 → 生成 Stripe 支付链接
- 状态机：PENDING → ACCEPTED / REJECTED

---

## 4. 管理后台能力

### 4.1 CMS 免发版配置
| 可配项 | 模型/字段 | 说明 |
|:---|:---|:---|
| 首页大标题 | `SiteConfig.heroTitleZh/En` | 双语 Hero 标语 |
| 公告栏 | `SiteConfig.announcementBarZh/En` | 顶部通栏文案 |
| 页脚版权 | `SiteConfig.footerTextZh/En` | 底部法律声明 |
| 营销开关 | `SiteConfig.isSalesPopupEnabled` 等 | 假流量引擎总控 |
| 支付/议价开关 | `SiteConfig.isStripeEnabled / isOfferEnabled` | 功能总开关 |

### 4.2 操作审计 (`AuditLog` 模型)
- 任何人改价、删除、修改数据，都写入审计日志
- 字段：操作人、动作类型、目标 ID、详情、时间戳

### 4.3 导航管理 (`NavigationItem` 模型)
- 支持分组：HEADER_MAIN, HEADER_MEGA_CATEGORY, FOOTER_NAV, FOOTER_LEGAL
- 后台可增删改查、排序

### 4.4 资讯中心 (`Article` 模型)
- 分类：NEWS / KNOWLEDGE / CEREMONY
- 支持发布/下架控制、双语内容

---

## 5. 数据模型全景 (Prisma Schema - 19 Models)

```
核心商品层        认证与交易层        社交与内容层        系统管控层
├── Amulet       ├── User            ├── Comment         ├── SiteConfig
├── Certificate  ├── Account         ├── Wishlist        ├── SiteSetting
├── CasingOption ├── Session         ├── Article         ├── MarketingConfig
├── MediaVault   ├── VerificationToken├── CollectorProfile├── AuditLog
├── Offer        ├── Order           └── NavigationItem  └── EmailLog
                 ├── OrderItem
                 └── Address
```

---

## 6. 权限矩阵 (RBAC)

| 角色 | 商品管理 | 订单管理 | 用户管理 | 系统配置 | 批发价可见 | 私洽议价 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| STAFF | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| WHOLESALE | ❌ | 仅自己 | ❌ | ❌ | ✅ | ✅ |
| USER | ❌ | 仅自己 | ❌ | ❌ | ❌ | ✅ |

---
*PRD v5.0 - Synced 2026-03-14*
