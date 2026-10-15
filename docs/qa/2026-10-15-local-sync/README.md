# 本機同步、正式版與 MCP 重查

## Git 整合

- fetch/push remote 均為 `https://github.com/tentenco/charmvilla_shopify_official.git`。
- 原 root main `2232e74` 落後18個提交；補交前次正式 QA `729d6fa` 後落後19個。先將21個 tracked／核准新增檔保存於本機備份分支 `codex/preserved-local-client-work-20261015`，提交 `4589147`，再 fast-forward `main` 到 `729d6fa`。
- 核准五圖、PolicySectionLink、FAQ/Policy互動及聖誕兩選單與備份一致；最新 Shopify 預購、checkout、SEO、配送、三盒 US$60 與底部對齊取最新主線。image metadata 的差異是未核准候選，不重新接入。舊 CSV／QA／rejected 圖片／output 原地保留。
- 補回 WIP 三條影像 Lessons 及已驗證的 Ego viewport 規則；其他舊設計 worktrees 皆乾淨，未合併、刪除或修改。

## 版本變更（相較原本 root）

| 範圍 | 整合後 |
| --- | --- |
| 商品圖 | 5張已核准雪花系列圖片，金色貼紙與兩茶包開盒照、統一底圖與比例 |
| 客戶文案 | 預購出貨／付款／取消、退貨政策連結與聖誕茶款＋盒蓋選單 |
| 沖泡版面 | 每步較大間距，最後一步區塊與照片底部對齊，保留手機與 reduced-motion |
| Shopify／購物車 | 保留同事即時價格庫存、失效車恢復、數量驗證、錯誤處理與隔離測試；預購由 merchant-owned metafield 決定 |
| 最新商業規則 | 保留主線 Hayward 線上履約、48州配送限制、聖誕心意禮三盒組 US$60；沒有由舊文件覆寫 |
| 其他主線修正 | SEO/schema、移除搜尋、Logo 導覽與本機英文 redirect 修正 |
| 本輪新增 | Node24 MCP 啟動配置、唯讀連線診斷；商品與庫存未寫入 |

## 驗證

- `check.log`：Node24 lint/typecheck/build 全通過，0 errors／7個既有 warnings；Shopify12/12。
- `final-lint.log`：新增 MCP 診斷及配置後 lint 通過。
- `readback.json`：root 應用程式與已驗收 afc5199 完全一致；本機/www各5路由200、各5資產SHA256一致，正式14商品35variants可讀。視覺驗證沿用同一應用程式的 [本機／正式12組對齊證據](../2026-10-15-client-images-release/README.md)，這次沒有修改UI。
- 正式 www/apex/demo2 `729d6fa` READY，deployment `dpl_7byj5Wsz4zprzHPbxYBsR1pwxtCg`。後續 MCP/文件提交需再回讀 alias；沒有另外建立 Preview。
- root server port3146、Ego task44 p1 本機；p2 Shopify `erik@tenten.co` 密碼頁交給使用者，尚未登入完成。

## MCP 狀態與限制

- `mcp-check.log`：商店 MCP 握手成功，只有唯讀 `shopify_admin_query`；真實查詢因缺 Admin credentials 失敗。這不是商店已連通。
- `dev-mcp.json`：官方文件 MCP 握手成功，列出5工具；它不直接管理商店。前兩次巢狀 npx 檢查因 npm node/lib 路徑失敗，改用一般 shell 執行實際配置後通過。
- Vercel sensitive env 無法回讀。遮罩暫存檔已移除；只補 `.env.local` 公開domain/API版本，原檔備份在 ignored temp，未更改遠端環境或任何憑證。
- 等使用者完成登入，再配置本機憑證、核對 app scopes；商店 MCP 尚未加入編輯／庫存寫入工具。團圓金色實際可售數量也仍待回覆。
