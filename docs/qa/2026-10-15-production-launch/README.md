# 2026-10-15 正式上線驗證

使用者授權將 Shopify 購買功能上線到 https://www.charmvilla.com/，並完成 GA4 電商追蹤及 Search Console 提交。

## 部署

- Vercel project：tentenco/charmvilla-demo2，project ID prj_QWvvqmrK6UCFkDhY9DyPAQe2Cx23。
- 首次 Production：dpl_7bWh8qzQLH1r41kkgV9acb969U6x（READY），正式 www alias 已指向。
- 既有 www／apex 綁定未更改；apex HTTP 308 到 www，HTTPS HSTS 正常。
- Shopify server-only 憑證、Commerce mode、hosted accounts、GA4 ID 與公開 consent Storefront token 已設於 production／preview。
- Preview：charmvilla-demo2-rlt5psye6-tentenco.vercel.app，實際加購／結帳通過。

- Git：功能 c767233、整合既有圖片 QA 96e9207，均已推送 origin/main。
- Git Production：dpl_9kJSkQvwSSZyHpLpTN8R2zfYtnzE，READY、aliasAssigned=true，www／apex／demo2 aliases 已指向，對應 96e9207。
- 最終應用程式 commit 548a52a；Production dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt READY，aliasAssigned=true，含自動事件網址保護。
- 最終正式域名 `SHOPIFY_VERIFY_URL=https://www.charmvilla.com npm run shopify:verify` 全部通過，測試 cart 清空。

## 檢查結果

- Node 24 `npm run check` 通過；0 errors，原有 lint warnings 不阻擋建置。
- Analytics tests 8/8、Shopify catalog tests 8/8。包含折後金額、稅／運費分離、transaction 去重、無真實 order ID 不發 purchase、同意條件、checkout stages、URL 清洗、variant 身分、付款來源排除。
- Shopify verify 真實 Admin／Storefront／CMS 與購物車增減／移除／非法輸入／帳戶導向通過，無建立訂單。
- 正式站英文 1440×1000、中文 390×843 reduced-motion：圖片載入、版面、庫存／價格正常，無水平溢出；EGO Runtime／Log 未見 app exception。
- 正式站 Cookie 初始無 GA，允許後送瀏覽；撤回後 GA cookies 清除、reload 無 gtag，原購物車仍為 1 件。拒絕／允許兩個按鈕手機可操作；參見 consent-mobile.png。
- 正式站購物車 1→2→1→0 實際 Shopify 更新及追蹤增量正確，cart-events.json；本輪 QA cart 已清空。
- 正式結帳商品 Kyoto US$60、variant 53771465687404，信用卡／PayPal／Google Pay 選項可用；Shopify Payments 顯示 Accepting payments／Receiving payouts。
- 配送 read-only 核對：美國 Domestic，Express $30、UPS 7 services 滿 $199 免運。未修改商店稅務、金流、配送政策或商品發佈狀態。
- Pixel 217153900 connected，Analytics-only Required；初版發現 `customerPrivacy` ReferenceError，改為 Custom Pixel API `api.customerPrivacy` 後，修正後已送出 begin_checkout，USD60／數量1／真實 variant／原 GA session ID 正確，且無 runtime error。
- GA DebugView 已實際收到 page_view／view_item／view_item_list／add_to_cart／remove_from_cart／view_cart／begin_checkout；證據 ga-debug-checkout.png、ga-debug-checkout.txt、ga-debug-cart.txt。真實商品清單點選 select_item 與 SPA 新頁 page_view 也正確。GA 銷售收益總覽、購物歷程、結帳流程、工作階段重要事件發生率可使用。

## SEO 提交

- sitemap 56 URLs 全部 HTTP 200，可索引、canonical 與三種 hreflang；首頁 canonical 省略尾斜線與 origin URL 等價。完整結果 seo-crawl.json。
- 正式頁無 noindex；非正式 Vercel host X-Robots-Tag noindex, nofollow。
- robots 允許公開網站、阻擋 account/API，指向正式 sitemap。
- Shopify 商品頁 Product JSON-LD 使用 Shopify offers；OG 圖片正式網域。
- GSC verified property https://www.charmvilla.com/：sitemap 2026-10-15 重新提交成功，讀取成功、56 discovered pages。
- 首頁原已收錄；首頁及 /zh/products/kyoto-gift-box 均成功 request indexing（priority crawl queue）。不宣稱立即收錄。
- 已連結 GA4 property 559053952／stream16130398768 至同一 Search Console property。

- 後續補強 gtag config 的預設 page_location／page_referrer 清洗（含自動 user_engagement），避免 Shopify sandbox URL 或 query token 出現在自動事件；Shopify pixel 已同步保存。Node 24 check 0 errors／7 既有 warnings、analytics 8/8 再次通過。

## 測試界線

沒有輸入付款資料、付款、產生訂單、寄信或送出假 purchase。add_shipping_info、add_payment_info、purchase 有標準訂閱與離線合約測試，未以真實付款端到端驗證。第一次真實訂單請對照 GA transaction_id 與 Shopify order ID。購買功能仍由 Shopify 最終判定庫存、地址、運費、稅與支付資格。

已保留使用者 localhost:3026 的原測試購物車；未操作舊 EGO task spaces。
