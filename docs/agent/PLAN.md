# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

依使用者表格啟用10款新的獨立預購批次，缺貨可預購，Shopify訂單占用同款共用額度；保留同事Shopify整合與原現貨。延續直接發布www的授權。使用者已同意對客戶的一句話作法並要求繼續，無需再確認數量。

## Steps and evidence

1. 完成：10 tracked/DENY SKU +29 PRE_ORDER plans，ON_SALE／100%全額／無尾款；Headless02發布。CAS初始化核准額度；團圓Gold100，聖誕心意禮200組×3盒，其餘依表格。原商品內容價格庫存逐一比對保留。
2. 完成：網站資料映射、共同剩餘數字、缺貨預購、checkout plan/attributes、Gold-only；cart零數量行不顯示、GA共同SKU不同plan不覆蓋。
3. 完成：check（7既有warnings）、19unit、38API、16E2E、9analytics；真實29選項cart、1額度跨plan限制／缺plan拒絕、原生Pay now checkout；12組Ego雙語桌手機／鍵盤／reduced／API故障禁購。未實際下單付款。
4. 進行中：curated commit/push前fetch；Vercel READY＋www API10款與商品頁／購物車回讀；完成後更新Production狀態及交付。

## FIFO queue

無新獨立任務；前批圖片、早上文案、沖泡底部對齊、Gold-only／頭尾線已發布。舊QA／WIP／未核准素材原地保留，勿批次add。

## Resume

main/origin main仍df2a777，正式舊版仍正常。新批次Shopify額度已啟用，網站程式尚未push。port3146本輪start服務；Ego Task48 p1 owned agent，Task44已finish不可重開。ignored temp/preorder-setup保留原snapshot、creation/CAS journal與私人cart IDs，禁止提交含key網址。接續完成發布回讀，不重新建立商品／重填額度。詳見docs/qa/2026-10-15-preorder-batch/README.md。

## Attempts and decisions

- 2026-10-15 預購12組瀏覽器驗證：Ego `Page.captureScreenshot` 及 wrapper screenshot 連續逾時兩次，DOM／尺寸／按鈕仍正常。停止原參數重試；先保存DOM矩陣，後續明確 bringToFront 並用 fromSurface:false 分辨視窗表面截圖問題，不視為網站失敗。

- 本批10款DRAFT商品與原生PRE_ORDER selling plans已建立，未配置額度。獨立SKU搭配各選項selling plan PRICE可共用原生庫存且保留不同售價。紫斑蝶啟用倉庫的第一個呼叫被2026-10缺少idempotent directive拒絕；加上journal key後回報該SKU已在倉庫啟用、不可再傳available。停止重試activation，先讀回新商品各倉庫與數量，僅在確實未啟用時執行activation；不得假設productCreate的預設倉庫狀態。

- 使用者詢問預售上限與實際庫存差異後，已明確授權按建議修改；這項授權不提供缺少的數量定義。現行allocation僅記錄，未實作共享額度引擎，不能宣稱改一欄便完成。
- 可讀近60天兩筆訂單均REFUNDED／FULFILLED、未標預購，其中團圓currentQuantity仍1。不可只用「未取消」或currentQuantity估算有效預購；也不能把沒有預購標記當作本批無外部訂單。

- 2026-10-15 登入後已沿用既有 CMS app／Headless02 憑證接通本機；真實 query 與 locations 成功。新版本 headless-mcp-inventory-2026-10-15 僅新增 read_locations/write_inventory，從 Dev Dashboard Install app → 既有商店 Update data access 完成授權；Open app 不會在此非 embedded app 觸發升級。已核對18 scopes。開始限定商品 metafield CAS／庫存CAS+idempotency工具；未寫入商品或庫存。

- 使用者已回覆「登入好了」。2026-10-15 takeOverTaskSpace(44) 已確認 p2 為 Charmvilla Admin 首頁；沿用既有 app／Headless02 憑證接通本機，先讀取實際 scopes，再完成限定商品與庫存工具及隔離驗證。不得輪替正在正式使用的 secret 或推算團圓金色數量。
- MCP 官方文件 server 兩次在巢狀 npx/Node24 下出現 connection closed；stderr 確認是 npm lstat node/lib ENOENT，並非 Shopify auth。停止相同重試；下一個區別性檢查改由一般 shell Node 啟動 SDK，以實際 .mcp.json 的 npx command 檢查官方 server。商店 MCP 已握手成功，真實查詢明確缺 Admin credentials；Vercel production 敏感欄位不可回讀，未把 [SENSITIVE] 當憑證寫入。
- 使用者已明確更正：最後一步與圖片底部需要對齊。先完成此補充發布，再接團圓。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。

## Resume

root main/origin main為df2a777，port3146是該root的Node24真實Shopify模式本機展示。Ego task44已finish一次並保留p1本機及p2已登入Shopify Admin，MCP連線完成，無需重做登入或憑證。正式Gold-only／頭尾線已驗證；新增的正式QA及預購盤點文件暫留本機，未再推一個文件部署。接續等待客戶數量定義並查核預購控量方案；讀取報告在docs/qa/2026-10-15-preorder-setup/。release工作樹及未核准圖片／歷史CSV原路保留，不批次add或重發舊分支。
