# 2026 年 11 月預購：後台操作

更新：2026-10-16。10月15日依使用者確認的10款表格啟用獨立預購批次；10月16日只為團圓補齊三色，沒有重新初始化額度。各茶款／盒蓋共用同款額度；現貨另行管理。

| 商品 | 本批接單上限 | Shopify 預購商品 |
| --- | --- | --- |
| 團圓（金色／黃色／紅色共用） | 100 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915486572) |
| 年年有魚 | 20 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915289964) |
| 花開富貴 | 20 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915257196) |
| 京都版 | 100 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915355500) |
| 春曉 | 10 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915388268) |
| 暮雪 | 10 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915322732) |
| 蝴蝶蘭 | 10 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915453804) |
| 紫斑蝶 | 10 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915421036) |
| 聖誕禮盒 | 200 盒 | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915552108) |
| 聖誕心意禮 | 200 組（每組3盒） | [管理額度](https://admin.shopify.com/store/charmvilla/products/15425915519340) |

## 看額度與訂單

1. 開上表連結，商品名稱尾端是 **Pre-order November 2026**，SKU 以 **PO26-** 開頭。這些是未來可接單額度，不是原商品的實物庫存。
2. 在 **Hayward ReadySpaces** 查看 Available（尚可接單）與 Committed（訂單已占用）。每款僅一個預購 SKU；同款所有茶／盒蓋共用它。數量1代表1盒，只有聖誕心意禮代表1組＝3盒＝6茶包，售價每組US$60。
3. Shopify 訂單的 selling plan 名稱和 **Option** 記錄實際茶款／盒色；聖誕心意禮新混搭方案以 **Teas** 記錄每組各茶盒數，例如 `Rose Oolong Tea × 2, Ruby Black Tea × 1`。訂購2組時按此配方包裝兩次，共6盒。**Ships by: 2026-11-30** 記錄本批出貨期限。撿貨請依這些欄位，不能只看共用 SKU。
4. 預購下單收全額；出貨前可申請取消並全額退款。未修改現行金流、配送區域、運費門檻或稅金設定。

## 調整與取消

- **不要把 Available 每天重設為原上限**：例如10盒已接3盒，Available應為7，重設10會額外多放3盒。
- 要增減剩餘接單額度，調整上表預購商品的 Available；先核對 Committed／已出貨訂單及外部接單。MCP `set_inventory` 要提供舊值與 idempotency key；不是覆寫原現貨 SKU。
- 取消時依實際情況勾選 Shopify 的 Restock，回補同一預購 SKU；僅退款不一定回補額度，務必回讀 Available／Committed。不要另外手動再加一次。
- 暫停接單可將預購商品設為 Draft 或從 Headless02 取消發布。要立即阻擋原有購物車，也要以 Shopify 購買資格／額度設定處理；不要只隱藏前台標籤。
- 保持 **Track quantity** 開啟、**Continue selling when out of stock** 關閉；selling plan reserve 維持 **ON_SALE**。零額度時 Shopify 結帳硬性阻擋超賣。
- 原商品價格及 CMS 仍是內容來源。修改原售價後，對應預購 selling plan 的固定 PRICE 必須同步；若兩者不一致，網站會暫停該選項，避免用舊價格接單。由本專案的 Shopify Admin/MCP 維護人員同步，勿只改共用 SKU 的基礎價格。

## 技術與範圍

- `src/data/shopify-preorders.json` 僅保存已驗證身分／選項對照；即時剩餘數量與價格由 Shopify 取得，沒有本機扣量或 webhook 事後補扣。
- 每個選項是共用 SKU 上的原生 PRE_ORDER selling plan，100% checkout charge、NO_REMAINING_BALANCE、ON_SALE。不同茶的230/260、300/340價格維持原商品價格。
- 新批次只發布至 **Charmvilla Headless02**，不新增至 Online Store／POS／Shop；`seo.hidden=1`。原10商品、原variants、文案與現貨數量保留。網站仍呈現14款已核准型錄。
- 團圓對應客戶現行 Gold／Yellow／Red，三色共用同一預購 SKU，不是每色各100盒。兩個新 selling plans 已建立，網站已交付獨立Preview，尚未正式發布。聖誕心意禮依使用者10月16日指示恢復三盒混搭，新增1個專用plan，原5個單口味plans保留；不重設任何額度。其他商品沿用現行 Shopify 選項。
- 訂單成立才占用原生庫存；加入購物車不保留額度，付款前 Shopify 會再次驗證。庫存數字最多有前台30秒更新間隔，最終以 Shopify checkout 為準。
- 本輪已測真實購物車／原生結帳與超額邊界，**未實際付款、未建立訂單**。首筆真實訂單仍應對照其數量與預購 SKU 的 Available／Committed；此處不把未付款測試說成扣庫存實單證明。

驗證入口：[本輪 QA](../qa/2026-10-15-preorder-batch/README.md)。
