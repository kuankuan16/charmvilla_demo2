# Active Agent Plan

Status: `completed`
Updated: 2026-10-15

## Active task

依使用者表格啟用10款新的獨立預購批次，缺貨可預購，Shopify訂單占用同款共用額度；保留同事Shopify整合與原現貨。延續直接發布www的授權。使用者已同意對客戶的一句話作法並要求繼續，無需再確認數量。

## Steps and evidence

1. 完成：10 tracked/DENY SKU +29 PRE_ORDER plans，ON_SALE／100%全額／無尾款；Headless02發布。CAS初始化核准額度；團圓Gold100，聖誕心意禮200組×3盒，其餘依表格。原商品內容價格庫存逐一比對保留。
2. 完成：網站資料映射、共同剩餘數字、缺貨預購、checkout plan/attributes、Gold-only；cart零數量行不顯示、GA共同SKU不同plan不覆蓋。
3. 完成：check（7既有warnings）、19unit、38API、16E2E、9analytics；真實29選項cart、1額度跨plan限制／缺plan拒絕、原生Pay now checkout；12組Ego雙語桌手機／鍵盤／reduced／API故障禁購。未實際下單付款。
4. 完成：`4755c7c` 已提交推送，Production `dpl_8uFKZ7LhFs3nV6QShyA2W8PXgvBp` READY，www/apex/demo2 aliases及來源SHA一致。正式8組Ego雙語桌手機、10款額度API、真實cart CRUD／invalid input／hosted account回讀通過；測試cart已清空。未做實際付款下單。

## FIFO queue

無新獨立任務；前批圖片、早上文案、沖泡底部對齊、Gold-only／頭尾線已發布。舊QA／WIP／未核准素材原地保留，勿批次add。

## Resume

本批應用程式 `4755c7c` 已在正式www驗證。後續文件提交不變更網站程式。port3146本輪start服務；Task44已finish不可重開。ignored temp/preorder-setup保留原snapshot、creation/CAS journal與私人cart IDs，禁止提交含key網址。不可重新建立商品或重填已啟用的預購額度；首筆真實訂單核對Available/Committed。詳見docs/qa/2026-10-15-preorder-batch/README.md與docs/shopify/preorder-batch-2026-11.md。其他舊QA/WIP與未核准圖片未納入本批。

## Attempts and decisions

以下是歷史嘗試，等待授權／尚未初始化等狀態已由上方完成紀錄取代。

- 2026-10-15 預購12組瀏覽器驗證：Ego `Page.captureScreenshot` 及 wrapper screenshot 連續逾時兩次，DOM／尺寸／按鈕仍正常。停止原參數重試；先保存DOM矩陣，後續明確 bringToFront 並用 fromSurface:false 分辨視窗表面截圖問題，不視為網站失敗。

- 本批10款DRAFT商品與原生PRE_ORDER selling plans已建立，未配置額度。獨立SKU搭配各選項selling plan PRICE可共用原生庫存且保留不同售價。紫斑蝶啟用倉庫的第一個呼叫被2026-10缺少idempotent directive拒絕；加上journal key後回報該SKU已在倉庫啟用、不可再傳available。停止重試activation，先讀回新商品各倉庫與數量，僅在確實未啟用時執行activation；不得假設productCreate的預設倉庫狀態。

- 使用者詢問預售上限與實際庫存差異後，已明確授權按建議修改；這項授權不提供缺少的數量定義。現行allocation僅記錄，未實作共享額度引擎，不能宣稱改一欄便完成。
- 可讀近60天兩筆訂單均REFUNDED／FULFILLED、未標預購，其中團圓currentQuantity仍1。不可只用「未取消」或currentQuantity估算有效預購；也不能把沒有預購標記當作本批無外部訂單。

- 2026-10-15 登入後已沿用既有 CMS app／Headless02 憑證接通本機；真實 query 與 locations 成功。新版本 headless-mcp-inventory-2026-10-15 僅新增 read_locations/write_inventory，從 Dev Dashboard Install app → 既有商店 Update data access 完成授權；Open app 不會在此非 embedded app 觸發升級。已核對18 scopes。開始限定商品 metafield CAS／庫存CAS+idempotency工具；未寫入商品或庫存。

- 使用者已回覆「登入好了」。2026-10-15 takeOverTaskSpace(44) 已確認 p2 為 Charmvilla Admin 首頁；沿用既有 app／Headless02 憑證接通本機，先讀取實際 scopes，再完成限定商品與庫存工具及隔離驗證。不得輪替正在正式使用的 secret 或推算團圓金色數量。
- MCP 官方文件 server 兩次在巢狀 npx/Node24 下出現 connection closed；stderr 確認是 npm lstat node/lib ENOENT，並非 Shopify auth。停止相同重試；下一個區別性檢查改由一般 shell Node 啟動 SDK，以實際 .mcp.json 的 npx command 檢查官方 server。商店 MCP 已握手成功，真實查詢明確缺 Admin credentials；Vercel production 敏感欄位不可回讀，未把 [SENSITIVE] 當憑證寫入。
- 使用者已明確更正：最後一步與圖片底部需要對齊。先完成此補充發布，再接團圓。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。
