# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

MCP 真實商店連線與限定管理工具已交付（connection-final.log、schema-validation.json、5項隔離測試）；目前處理團圓只賣金色的前台選項，保留 Shopify 真實價格／庫存及原始 variants。完成後接沖泡頭尾線。

使用者要求確認 root checkout 連到 tentenco/charmvilla_shopify_official，安全合併本機與同事最新版本、發布 www.charmvilla.com，並在 Ego Lite 開本機與 Shopify Admin，接通商店 MCP。先前圖片、定稿與底部對齊已正式發布並驗證。新的 root 同步須保留舊 WIP 的可回復備份，不能用舊檔覆蓋同事 Shopify 修改。

## Steps and evidence

1. 已完成：955e603 基礎上的 curated patch、Node24 check、Shopify12、雙語1440/390、照片/政策/選單與 Logo QA，證據 docs/qa/2026-10-15-client-images-release/。這些是合併最新主線與再次增加間距之前的證據。
2. 已完成：整合最新 9beeb11，保留 SEO、購物車、三盒 US$60、配送與庫存；Node24 check、Shopify12、API37、E2E16、雙語桌手機 QA 通過。
3. 已完成：67a9091 圖片/文案、afc5199 底部對齊正式發布。Vercel alias/來源 SHA 已核對；本機及正式各12組對齊 QA，8組桌機底緣差0px，手機/reduced-motion/Logo與錯誤檢查通過。14商品35variants與10款預購資料不變。
4. 已完成：root WIP 保存於本機分支 codex/preserved-local-client-work-20261015／4589147，再 fast-forward 729d6fa。核准功能均已包含；補回影像 Lessons，未核准圖片/歷史輸出原地保留。
5. 部分完成：兩個 MCP handshake 成功；商店實際 query 缺 Admin credentials。Vercel sensitive env 不可回讀，未繞過限制；只補本機公開 domain/API，未填假憑證。Ego task44 p1 本機、p2 Shopify 密碼登入已 handOff。待使用者完成登入後配置本機憑證並確認 scopes，現有商店 MCP 維持 query，編輯/庫存工具尚未啟用。
6. 已完成：root Node24 check、Shopify12、MCP改動後lint；本機/www各5路由與5圖片hash正確。www/apex/demo2的729d6fa READY。最後MCP/文件提交不更動應用程式；push後回讀alias，報告位於 docs/qa/2026-10-15-local-sync/README.md。

## FIFO queue

1. 使用者最新補充：「團圓只賣金色款，其他顏色選單先隱藏」。MCP 接通後立即實作前台只保留金色選項，不必等庫存數量才隱藏；金色可售仍依 Shopify，不捏造或把藍色庫存移轉。金色實際可售數量尚待回答；本輪尚無庫存寫入授權數字。
2. 使用者追加沖泡步驟「刪除頭尾的線」：移除第一個步驟上方與最後步驟下方的橫線，保留中間分隔線、既定留白與底部對齊。完成團圓後處理；以雙語1440/390實頁與computed border驗證。

3. 使用者「照你的建議幫我改 shopify」：目前前台修改發布後，處理現貨／預購額度分離及共享額度控量。已問原10款上限為新批次額度或含現貨總額，答案未到前不可做依賴該定義的Shopify寫入；可先讀既有campaign／訂單、核對Headless結帳支援與實作方案。不要只開CONTINUE造成無限超賣。

## Attempts and decisions

- 使用者詢問預售上限與實際庫存差異，已說明現貨／未來預購額度應分開、跨variants共用額度需原子控量；現行allocation僅記錄，未實作共享額度引擎。這是建議詢問，未授權此輪更改庫存政策或建置預購系統。

- 2026-10-15 登入後已沿用既有 CMS app／Headless02 憑證接通本機；真實 query 與 locations 成功。新版本 headless-mcp-inventory-2026-10-15 僅新增 read_locations/write_inventory，從 Dev Dashboard Install app → 既有商店 Update data access 完成授權；Open app 不會在此非 embedded app 觸發升級。已核對18 scopes。開始限定商品 metafield CAS／庫存CAS+idempotency工具；未寫入商品或庫存。

- 使用者已回覆「登入好了」。2026-10-15 takeOverTaskSpace(44) 已確認 p2 為 Charmvilla Admin 首頁；沿用既有 app／Headless02 憑證接通本機，先讀取實際 scopes，再完成限定商品與庫存工具及隔離驗證。不得輪替正在正式使用的 secret 或推算團圓金色數量。
- MCP 官方文件 server 兩次在巢狀 npx/Node24 下出現 connection closed；stderr 確認是 npm lstat node/lib ENOENT，並非 Shopify auth。停止相同重試；下一個區別性檢查改由一般 shell Node 啟動 SDK，以實際 .mcp.json 的 npx command 檢查官方 server。商店 MCP 已握手成功，真實查詢明確缺 Admin credentials；Vercel production 敏感欄位不可回讀，未把 [SENSITIVE] 當憑證寫入。
- 使用者已明確更正：最後一步與圖片底部需要對齊。先完成此補充發布，再接團圓。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。

## Resume

root 已完成同步，後續從 /Users/kuan/Documents/Codex/10-02-charmvilla-demo2 main 接續，port3146 是該 root 的已建置本機展示。Ego task44 已交使用者，收到登入完成確認後才 takeOverTaskSpace(44)。再配置 Shopify 憑證、重跑 npm run shopify:mcp:check 並核對 scopes；團圓金色數量仍待回答，不推算或寫入庫存。release 工作樹保持歷史證據，勿從它的舊分支再次發布。
