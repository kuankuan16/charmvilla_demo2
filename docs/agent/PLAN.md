# Active Agent Plan

Status: `idle` — 2026-10-15 Shopify 正式上線、GA4 電商追蹤與 Search Console 提交完成。

## Last completed

- 正式站 https://www.charmvilla.com/，Shopify 價格／庫存／checkout；demo2 Visual 與中文 CMS 保留。
- Git c767233／96e9207／548a52a 已推送；Production dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt READY，正式 aliases 已指定。
- GA4 G-D3YCFQMZ2W，購買重要事件、銷售收益總覽／轉換率／購物及結帳漏斗、14 個月保留、跨域及開發流量排除。Pixel217153900 已 connected。
- GA DebugView 實際確認商品瀏覽、清單、加購、增減、購物車與 begin_checkout。
- GSC 連結完成；sitemap Success 56 URLs；首頁與京都中文 request indexing 成功。
- npm run check、analytics 8/8、Shopify 8/8、正式 Shopify verify、1440／390 reduced-motion QA 通過。未付款或製造假 purchase。
- 證據：[上線 QA](../qa/2026-10-15-production-launch/README.md)、[GA4 追蹤契約](../analytics/ga4-tracking-plan.md)。

## Next task

依下一個使用者指示開始；即時核對 Git／Vercel。首次真實訂單需對照 Shopify order ID 與 GA transaction_id；GA 不等於退款後財務報表。不要重跑舊的商品／中文遷移，也不要清除 localhost:3026 使用者測試購物車。
