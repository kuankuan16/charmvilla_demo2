# Active Agent Plan

Status: `waiting_for_shopify_login`
Updated: 2026-10-15

## Active task

使用者要求確認 root checkout 連到 tentenco/charmvilla_shopify_official，安全合併本機與同事最新版本、發布 www.charmvilla.com，並在 Ego Lite 開本機與 Shopify Admin，接通商店 MCP。先前圖片、定稿與底部對齊已正式發布並驗證。新的 root 同步須保留舊 WIP 的可回復備份，不能用舊檔覆蓋同事 Shopify 修改。

## Steps and evidence

1. 已完成：955e603 基礎上的 curated patch、Node24 check、Shopify12、雙語1440/390、照片/政策/選單與 Logo QA，證據 docs/qa/2026-10-15-client-images-release/。這些是合併最新主線與再次增加間距之前的證據。
2. 已完成：整合最新 9beeb11，保留 SEO、購物車、三盒 US$60、配送與庫存；Node24 check、Shopify12、API37、E2E16、雙語桌手機 QA 通過。
3. 已完成：67a9091 圖片/文案、afc5199 底部對齊正式發布。Vercel alias/來源 SHA 已核對；本機及正式各12組對齊 QA，8組桌機底緣差0px，手機/reduced-motion/Logo與錯誤檢查通過。14商品35variants與10款預購資料不變。
4. 已完成：root WIP 保存於本機分支 codex/preserved-local-client-work-20261015／4589147，再 fast-forward 729d6fa。核准功能均已包含；補回影像 Lessons，未核准圖片/歷史輸出原地保留。
5. 部分完成：兩個 MCP handshake 成功；商店實際 query 缺 Admin credentials。Vercel sensitive env 不可回讀，未繞過限制；只補本機公開 domain/API，未填假憑證。Ego task44 p1 本機、p2 Shopify 密碼登入已 handOff。待使用者完成登入後配置本機憑證並確認 scopes，現有商店 MCP 維持 query，編輯/庫存工具尚未啟用。
6. 已完成：root Node24 check、Shopify12、MCP改動後lint；本機/www各5路由與5圖片hash正確。www/apex/demo2的729d6fa READY。最後MCP/文件提交不更動應用程式；push後回讀alias，報告位於 docs/qa/2026-10-15-local-sync/README.md。

## FIFO queue

1. 團圓只剩金色有貨，粉紅/藍停售；整合正確 Shopify variants 並隱藏不需選擇的色款選單。已詢問金色實際可售數量，尚待回答，不能捏造或把藍色庫存移轉。只限本商品的明確新授權，其餘 Shopify 不改。

## Attempts and decisions

- MCP 官方文件 server 兩次在巢狀 npx/Node24 下出現 connection closed；stderr 確認是 npm lstat node/lib ENOENT，並非 Shopify auth。停止相同重試；下一個區別性檢查改由一般 shell Node 啟動 SDK，以實際 .mcp.json 的 npx command 檢查官方 server。商店 MCP 已握手成功，真實查詢明確缺 Admin credentials；Vercel production 敏感欄位不可回讀，未把 [SENSITIVE] 當憑證寫入。
- 使用者已明確更正：最後一步與圖片底部需要對齊。先完成此補充發布，再接團圓。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。

## Resume

root 已完成同步，後續從 /Users/kuan/Documents/Codex/10-02-charmvilla-demo2 main 接續，port3146 是該 root 的已建置本機展示。Ego task44 已交使用者，收到登入完成確認後才 takeOverTaskSpace(44)。再配置 Shopify 憑證、重跑 npm run shopify:mcp:check 並核對 scopes；團圓金色數量仍待回答，不推算或寫入庫存。release 工作樹保持歷史證據，勿從它的舊分支再次發布。
