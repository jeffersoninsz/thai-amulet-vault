# 💎 SIAM TREASURES - Operational Action Tasks (TASK.md)

> **Context:** 该文档维护所有在研的 Sprint 颗粒级别的待办物理任务。任何新起的工作分支或被 AI 派发的子任务必须登记于此。

## Current Sprint Tasks (待办队列)
- [ ] **Payments**: Stripe API Key `.env` 环境变量挂载与 Checkout API Edge Router 搭建。
- [ ] **Mailing**: SendGrid / 发件服务接入，取代本地环境的模拟收件池 `EmailLog`。
- [ ] **Storage**: 对 `next.config.js` 的图像域 `remotePatterns` 追加如 AWS S3 或 Cloudflare R2 等预备白名单。
- [ ] **Performance**: B2C 核心瀑布流页面的 React Profiler 防抖测试与 RSC 缓存分析。
- [ ] **Verification**: 对日前修复完毕的 Admin 侧边栏及后台移动端响应式样式再次进行 Review。
