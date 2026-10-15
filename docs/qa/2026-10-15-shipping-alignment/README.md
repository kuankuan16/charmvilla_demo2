# Shopify 配送與預購條件對齊

驗證日期：2026-10-15。使用者授權 Shopify 設定對齊；最新指示為 SGV 僅現場銷售、網購只用 Hayward、不寄 Alaska／Hawaii。

- Hayward 已設為 default location，online fulfillment 開啟；Fremont 與 SGV online fulfillment 關閉，SGV sellsInPerson 保留 true。逐頁重新開啟確認，見 `locations-final.json`。
- General profile 僅 Hayward；配送限美國本土 48 州及 Washington DC（49/62）。已排除 AK、HI、三種軍郵及所有領地；重新載入後逐一核對，見 `zone-change.json`。
- 保留當前 Free UPS Ground（orders US$199 and up、5–8 business days）與 UPS 3 種即時計算服務。沒有還原先前 Express30／7 種服務的舊快照。
- 透過正常 Admin Policies UI 發布既有核准內容的 shipping／refund policy，補上預購全額收款、11月底出貨、出貨前可全額退款，以及不寄 AK／HI。既有 privacy／terms 未改。公開網址讀回通過，見 `policy-readback.json`、同目錄 HTML。
- 獨立測試車 US$240 取得 Free UPS Ground US$0；實際 hosted checkout US$60 取得 UPS Ground US$6.65（即時報價，非固定費率），AK、HI、AE 顯示 Shipping not available。見 `cart-rates.json`、`checkout-ui.json`。全部測試車已清空，沒有付款或下單。
- Storefront carrier rates 不能以同步 `withCarrierRates:true` 讀取（必須 defer），改用正常 checkout 驗證；不以缺少同步 UPS 結果宣稱無運費。
- 本機前台政策已同步不寄 AK／HI；Node24 check、Shopify 11/11 通過（既有 7 lint warnings）。這些前台文字尚未 Git push／部署；Shopify 設定與 hosted policies 已在線上生效。

操作中曾以模糊搜尋 Virgin 選到 Virginia；重新載入逐項 readback 時發現並修正。最終 Virginia／West Virginia 均允許，U.S. Virgin Islands 排除；不以 49/62 數量單獨當作正確證據。
