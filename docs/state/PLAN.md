# 🚀 SIAM TREASURES Global Mission Control (PLAN.md)

> **Context:** 该文档定义了本架构接下来要推进的核心史诗级任务（Epics），是全栈构建与产品发布的罗盘。

## 📍 里程碑 1: 真实支付生态与结案 (Checkout & Payments)
*   **目标**: 废弃目前的模拟支付流程，全线接入真实货币结算。
*   **动作路线**:
    *   集成 [Stripe](https://stripe.com/) 支付网关用于信用卡收款。
    *   集成 [PayPal](https://paypal.com/) 快速结账。
    *   编写对应的 Webhook 监听器，在收到发卡行真实全款后再在 Prisma 扣减库存、落实在途状态。

## 📍 里程碑 2: 邮件与推送中枢 (Notification & SMTP)
*   **目标**: 弃用 `EmailLog` 本地模拟池，激活真实的客户触达体系。
*   **动作路线**:
    *   对接 SendGrid 或 Resend API。
    *   一旦接通，激活 `auth/forgot-password` 的邮件重置流水线。
    *   订单发货时，给用户投递包含真实跟踪号 (Tracking Number) 的精美黑金回执。

## 📍 里程碑 3: 静态资源云漂移 (Cloud Storage Migration)
*   **目标**: 降低 Next.js 生产服务器的上带压力与本地文件锁死风险。
*   **动作路线**:
    *   引入 Amazon S3 / Cloudflare R2。
    *   重构 `MediaVault` 相关的照片上传逻辑，直接直传云端拿回 CDN URL。

## 📍 里程碑 4: 性能与防抖压测 (Performance & Caching)
*   **目标**: B2C 瀑布流极致秒开，应对突发高并发。
*   **动作路线**:
    *   审查所有 Server Components 的 `fetch` 缓存策略 (stale-while-revalidate)。
    *   对 SQLite 进行 WAL 模式调优或评估向 PostgreSQL 跃迁的代价收益。
