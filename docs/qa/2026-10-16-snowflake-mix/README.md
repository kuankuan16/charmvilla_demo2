# 聖誕心意禮三盒混搭

以下保留當時的 Preview 驗證；已由[正式發布紀錄](../2026-10-16-reunion-release/README.md)接續。

- 使用者指出原單選無法混搭；改為第1／2／3盒各選一款，可重複，未選齊禁購。每盒2包、整組6包；商品摘要與茶介紹一併修正。
- [最新 Preview](https://charmvilla-demo2-fwasds9u4-tentenco.vercel.app/zh/products/snowflake-gift-box)，`dpl_6rEnnX34CAQfkuXJpZZFhnPi5jaA` READY／preview。基準5439c02＋限定19檔（含已交付紅色團圓圖庫），來源及SHA256見source.json。中途oabvt2ho6被本版本取代，不作交付。
- 本機未commit/push。正式www仍為`dpl_2yVuVGM8gTmuq7bha97yzQZKunAL`，沒有Production部署／promote。

## Shopify與驗證

- 原batch SKU `67720264450412`、group `80650371436`，只新增mix plan `694183395692`。100%即時付款、NO_REMAINING_BALANCE、ON_SALE、US$60整組；原5個plans保留。原商品、5款現貨、pool庫存200組及價格回讀不變，見backend-readback.json；完整限定備份與receipt在ignored temp/snowflake-mix-20261016。
- `_mix_variants`為穩定GID＋各茶盒數，server要求恰3盒、不重複ID、整數正量、僅屬於此商品的茶款；依live variants重建英文Teas明細，不能以客戶端文案／價格繞過限制。缺plan／價格不一致／延期付款方案／零額度均拒絕。
- check.log：Node24 lint/typecheck/build通過，0 errors／9既有及暫存腳本warnings。unit.log：20商品／batch測試通過。integration.log：41 API＋20 E2E通過；摘要包數修正後check重跑，e2e-final.log相關6項重新通過。
- live-cart.json：真實Shopify三口味1組US$60，GET保留明細，PATCH兩組US$120，DELETE清空；前後剩餘200。preview-cart-backend.json與preview-cart.json：線上Preview UI兩盒玫瑰烏龍＋一盒東方美人，原生mixed plan、1組US$60、Teas和穩定ID均正確；測試cart已清空。
- 未付款、未建立訂單，沒有以此聲稱實單扣庫存已測；既有原生ON_SALE在訂單成立時占用組數。沒有寫原商品CMS，原「透明封口貼紙」等後台文案仍保留，不屬本次混搭設定。

## 瀏覽器

- Ego56，中文／英文1440×1000與390×844共4組；3個選單、每盒2包、未選滿禁購、不同／重複口味、無水平溢出均通過。手機reduced motion；鍵盤操作、購物車重載、兩組價錢與失敗狀態另由E2E驗證。
- zh-1440-mix.png、zh-390-mix.png與en-390-mix-cart.png均已實際檢視，選單和明細清楚無截字。browser-errors.json及browser-final-errors.json均空；原始事件只留ignored temp，避免將網路headers存入repo。
- 補驗上一輪紅色團圓桌機第2張：red-desktop-settled.json為1440、正常motion，4張opacity=[0,1,0,0]、圖片載入完成；red-desktop-settled.png已檢視，取代上一輪動畫途中截圖。第4張沿用15包實拍。
- 完成後Ego56保留中文混搭預覽頁，測試購物車0件。

文件依據：[Shopify selling plans](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/selling-plans/build-a-selling-plan)、[pre-order solution](https://shopify.dev/docs/apps/build/purchase-options/deferred/build-deferment-solution)；本輪Admin query／mutation已經Dev MCP 2026-10 schema驗證。
