# 聖誕預購額度調整

使用者2026-10-16轉貼客戶「聖誕12入與2入預購調到各500」並要求改。

- 12入：確認總上限200盒、available200、committed0，Hayward既有batch SKU tracked/DENY；使用MCP compare-and-set與唯一UUID將available增加300至500，custom.preorder_batch allocation.limit同步500。保留metadata其他欄位。
- 2入：使用者已明確確認500組＝1500小盒。新讀回原limit200／available200／committed0，既有Hayward batch SKU維持tracked/DENY；CAS增加300至500組，preorder_batch allocation.limit同步500。庫存與metafield receipts均applied=true、userErrors空。
- before.json／after-12.json為唯讀庫存與metadata快照；兩個原商品及2入batch深度比對完全相同。12-count-*為受限寫入input／receipts，均applied=true、userErrors空。
- 正式www.charmvilla.com/api/products回讀12入剩餘500、六選項可預購、US$120；2入仍剩餘200、US$60。見production-after-12.json。
- 2入完成後：before-2-count.json／after-2-count.json比對，兩個原商品及12入batch完全相同。正式中文商品頁顯示「預購・剩餘 500 組」、3盒一組、US$60；正式API HTTP200。證據production-after-2.json。Ego初次頁面仍顯示200，正常即時更新後變為500，未清除使用者快取或資料。
- 不新增預購批次、不改原商品現貨、不動售價／販售單位／出貨日期。不跑初始化，不下單、不建立測試cart。未改應用程式、未重新部署或推送；兩款Shopify資料已即時生效。

API參考：[Shopify inventory compare-and-swap](https://shopify.dev/docs/apps/build/orders-fulfillment/inventory-management-apps/manage-quantities-states)。本輪query經Dev MCP 2026-10 schema驗證；mutation使用專案既有受限MCP工具。
