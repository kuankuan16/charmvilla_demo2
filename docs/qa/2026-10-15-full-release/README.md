# 全部修改與同事分支整合（2026-10-15）

使用者明確授權所有本輪修改commit/push、合併同事分支。候選為最新origin/checkout-tests-wip（作者kuankuan16，tip abdc4c4，6個未合併commits）；其餘10/08以前設計分支不在本次合併。

## 合併決策

- 保存SEO/schema、移除Search、配送政策、三盒US$60快照/QA；先合併已部署的Logo955e603。
- 同事的cart恢復/數量/錯誤同步、會員錯誤分類及測試保留。衝突處保留當前Admin token自動換發、GA4結帳/差額追蹤、Shopify source-of-truth及未發布商品限制。
- 不恢復已退役的本機預購扣額度與舊TASKS串接說法；測試改為驗證即時variant stock與unpublished，不以跳過測試規避。
- 自架127.0.0.1英文頁實際重現redirect loop，採用同事rewrite request marker，僅非Vercel接受。與正式Logo lifecycle例外為不同問題。
- 測試runner明確清空.env.local可能載回的正式憑證，origin只准loopback；Admin/Storefront mock補上現行CMS queries與CheckoutAnalytics。沒有真實訂單、會員、newsletter或付款副作用。

## 驗證

- Node24 npm run check通過：0 errors／7既有warnings（check.log）。
- API37/37（api-tests.log）；中英文Chrome E2E16/16（e2e-tests.log），包括購物車正常/失敗/缺貨、未發布Christmas、會員備用流程、newsletter mock與local模式。全程無真實寄信/訂單。
- Shopify adapter11/11；SEO7/7；GA4 8/8。第一次SEO測試因更新後campaign fixture失敗，修正scenario後完整通過（domain-tests.log保留初次，seo-analytics-tests.log為最後結果）。
- 本機完整SEO crawl56頁、43資產、12控制路徑0錯誤（local-seo.json）。代表性zh/en×1440/390×分類/三盒組/政策共12頁正常，無Search或水平溢出，JSON-LD存在、三盒組60且不可購買（local-browser.json）。
- 真實Shopify14商品、獨立購物車新增/讀取/增量/移除、checkout host與hosted account redirect通過；測試車清空（local-shopify.log）。
- 全部內容與同事分支已合併至main `6ac2081`（第二parent為abdc4c4），push成功；Vercel `dpl_FeZSFXA9NWEwWCWKmu5iW3v4umJG` READY、www/apex aliases，GitHub Vercel status success。
- 正式crawl56頁／43資產／12控制路徑0錯誤（production-seo.json）；12組zh/en桌機手機分類/三盒組/政策驗證通過，Search移除、JSON-LD存在、三盒組60且不可購買（production-browser.json）。
- 正式zh/en商品→上方Logo soft navigation通過（production-logo.json）；先前955e603的8組viewport/motion回歸證據仍有效。
- 正式Shopify實際購物車CRUD、正確checkout host與hosted account redirect通過，獨立測試車清空（production-shopify.log）；正式雙語運費條文展開可見滿199免運、不寄AK/HI/軍郵（production-shipping-copy.json）。
- 後續只補交付文件與QA，應用程式內容與6ac2081相同。

## 試驗記錄

1. 隔離build因沒有mock CMS設定而失敗；改成先啟動mock再build。
2. 舊SEO fixture已帶preorder_details，舊InStock預期不適用；按scenario明確保留campaign或移除campaign以驗證BackOrder，保留逐variant assertions。
3. E2E的Reunion選項現為Packaging，舊測試Tea預期更正；沒有更改產品實際資料。另一次production check誤與test build並行，清理.next使後段無效；停止並從乾淨測試build循序重測。
