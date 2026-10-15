# 2026-10-15 預購共用額度整合

基準 main `df2a777`，目標 `www.charmvilla.com`，本批已授權直接發布。

## 已完成實作與後台

- 10款獨立預購SKU、29個原生PRE_ORDER plans；同款各選項共用1筆原生庫存。ON_SALE reserve、DENY、100%預付且無尾款，沒有CONTINUE或事後webhook超賣空窗。
- 表格額度100/20/20/100/10/10/10/10/200盒，聖誕心意禮200組×3盒；團圓Gold only。CAS/idempotency初始化已回讀，見 backend-batches.json。
- 原10商品31個variants的title/description/price/sku/inventoryPolicy/各倉庫available/committed/on_hand逐一比對未變；其餘4款未寫入。網站仍14商品。original-preserved.json為實際計數。
- 新商品只發布Headless02、seo.hidden=1。app保留既有憑證及權限，補write_purchase_options/write_publications/read_shipping；實際23 scopes（含隱含read）。沒有額外付費app／Functions／Plus。
- 網站商品頁與清單保留預購身分，讀取原生剩餘數量；零額度仍顯示預購額滿。API失敗／缺plan／價差／取消發布等均禁購，不退回現貨數量放行。
- 購物車傳遞原生plan、選項、出貨日期；不同價格用plan固定PRICE。GA view_item沿用新實際checkout SKU，加減量改按cart line，避免同SKU不同plan被覆蓋。

## 驗證

- Node24 `npm run check`：通過，0 errors／7既有warnings。
- 商品及新批次純函式測試19/19；API38/38；中英文購物車E2E16/16；analytics9/9。
- 真實Shopify29選項全部可加購，售價與plan、2026-11-30出貨attributes正確，獨立測試cart已清空。
- 暮雪用本批SKU暫存1額度，跨2個plan各加1與同plan加2都被Shopify限制為合計1；缺selling plan拒絕；不同plan230/260價格正確。完成後CAS由1設為核准10。native-boundaries.json不包含cart key。
- 真實原生checkout看到PRE_ORDER選項、US$260及Pay now；未填地址或付款，未建立訂單。native-checkout.json。
- 本機真實commerce的create/read/update/remove、invalid input與Shopify hosted account redirect通過；QA carts清空。local-cart-verification.log。
- Ego 12組團圓／紫斑蝶／聖誕心意禮×中英文×1440/390，含normal/reduced、鍵盤展開政策，正確數量／可購／無溢出／無可見破圖／無JS exception。Network僅導覽取消ERR_ABORTED。額度0禁購與封鎖api/products後錯誤禁購另測，解除攔截。local-browser.json、exhausted-browser.json、api-failure-browser.json。
- Ego背景Tab截圖fromSurface:true連續逾時，false取得其他活躍Tab畫面，已排除出QA並移至ignored temp。沒有把錯頁截圖當視覺證據；本輪以實際DOM、互動與E2E驗證，未改CSS/版型/圖片。

## 邊界

沒有真實付款、下單、退款、出貨，不能宣稱已做實單扣量測試。原生庫存ON_SALE與checkout數量控管已驗證，首筆真實訂單仍應核對Available/Committed。沒有更動金流、shipping profiles、原現貨或使用者購物車。

## Production

- 應用程式commit `4755c7c46c91f6ca1c8f82e25bc3ab713c7410f5` 已推送 `tentenco/charmvilla_shopify_official`。
- deployment `dpl_8uFKZ7LhFs3nV6QShyA2W8PXgvBp` READY，www.charmvilla.com／charmvilla.com／charmvilla-demo2.vercel.app指向同版本；以deployment ID與www hostname分別讀回核對。見production.json。
- 正式Ego8組團圓／紫斑蝶×中英文×1440/390，含normal/reduced，100／10額度、可預購、團圓隱藏其他色、無水平溢出／JS exception／非取消類失敗請求。見production-browser.json。
- 正式14款API中的10款批次額度與29選項均正確，見production-availability.json。正式真實cart create/read/update/remove、400錯誤與hosted account redirect通過，測試cart清空，見production-cart-verification.log。
- 本節之後只補交接與驗證文件，沒有再改應用程式。

後台操作見 [預購管理](../../shopify/preorder-batch-2026-11.md)。
