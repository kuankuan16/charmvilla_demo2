# 按變更選擇驗證

只把實際執行、讀過輸出的檢查記為通過。先選本輪需要的檢查；相關修改或新證據出現時才重跑。新 QA 放新的日期／任務目錄，不覆寫舊證據。

## 必要檢查

| 變更類型 | 檢查與完成證據 |
| --- | --- |
| 純 Agent 文件 | `git diff --check`；逐一解析本輪 Markdown 相對連結與 CLAUDE 引用；對照 package scripts、腳本及設定確認命令；檢查 diff 沒有應用程式、秘密或使用者 WIP；不用跑網站 build 或連線商店 |
| 應用程式、依賴、建置設定 | Node 24 執行 `npm run check`（lint、typecheck、build）；讀取 warnings／errors，不降低檢查標準 |
| 商品配對、中文 CMS、Shopify 資料轉換 | 上項加 `npm run shopify:test`；檢查 variant 身分、中文優先、價格／庫存來源與核准照片 |
| 購物車、API、會員跳轉 | 上項加 `npm run shopify:verify`，先確認 server 與目標環境；驗證新增／讀取／增減／移除、非法輸入、checkout host 和 account redirect |
| GA4／結帳 pixel／同意 | `node --test scripts/analytics/analytics.test.mjs` 加應用程式檢查；瀏覽器驗證拒絕、同意、撤回、事件內容與去重，能連線時核對 DebugView |
| UI、動畫、影像、可見文案 | 應用程式檢查＋實際瀏覽器英文／中文、1440px／390px、鍵盤與 reduced-motion；核對 console、failed requests、水平溢出、裁切與正常／空白／錯誤狀態；表單檢查空輸入、重複送出、重新整理 |
| SEO、metadata、路由 | 應用程式檢查＋受影響 URL 的狀態碼、canonical、hreflang、robots 與 sitemap；Search Console 提交成功和 Google 收錄分開記錄 |
| 已授權發布 | 推送前確認 remote、branch、Vercel project；完成後讀回部署 READY／alias，開正式 URL 驗證受影響路徑。Build、push、部署與線上驗證分開記錄 |

`TASKS.md` 是頁面內容；改它不屬於「純 Agent 文件」。新增 MCP／hook／工具設定也不是純文件，需驗證實際載入或 handshake，不能只檢查 JSON／TOML 語法。

## 本機執行

先在 repository 根目錄確認 `node --version`，依 [.nvmrc](../../.nvmrc) 使用 Node 24。現有 shell 若不是 24，可用可用的版本管理器，或既有替代方式：

```sh
npx -y -p node@24 -c 'npm run check'
npx -y -p node@24 -c 'npm run shopify:test'
npx -y -p node@24 -c 'node --test scripts/analytics/analytics.test.mjs'
```

以上三項按需選，不是每輪全部執行。`npm run check` 已包含 lint／typecheck／build，不用在它通過後再各跑一次。依賴已正確安裝時，不為純文件任務重跑安裝。

本機服務預設使用 `npm run dev -- --port 3026`；先確認埠上已有什麼服務，沿用正確服務，不任意殺掉使用者程序。`shopify:verify` 預設連 `http://localhost:3026`，也會透過本機憑證查真實 Shopify。

只有本輪範圍需要正式 API 驗證時才指定：

```sh
SHOPIFY_VERIFY_URL=https://www.charmvilla.com npm run shopify:verify
```

這項會建立並清空獨立測試購物車；需要有庫存且數量至少 2 的 variant，不會下單或寄信。不動使用者瀏覽器購物車；若因庫存或環境阻擋，記錄原因，不修改庫存讓測試過關。

## 容易誤用的命令與證據

- `npm run shopify:sync` 只讀商店，但會寫入本機 mapping／商品快照；不是健康檢查。
- `npm run shopify:prepare-zh` 會重建本機遷移 manifest；`npm run shopify:migrate-zh` 與選項遷移腳本會寫 Shopify。既有遷移已完成，不能為驗證重跑；改 CMS 前依當次授權備份、限定商品與欄位、寫後讀回。
- 商店 MCP 保持唯讀 query；官方 Dev MCP 查文件與 schema。權限存在不代表可以任意變更商店。
- `scripts/verify-catalog.py`、`scripts/verify-tea-gifts.mjs` 有歷史假設；先校正才可使用，不以舊 assertions 推翻現行資料來源契約。
- Git `main` 已連 Vercel Production；push 可能直接上線，不能當成備份。Preview 也屬外部發布，依當次範圍操作。
- 不向正式 GA 送假 `purchase`。離線 fixtures 通過、DebugView 收到事件、真實付款完成是三種不同證據；首次真實訂單仍須核對 Shopify order ID 與 GA transaction_id。
- 不以舊 QA 的綠燈宣稱本輪重測通過。結果至少寫日期、版本／環境、命令或操作與限制；敏感參數與憑證不得存入證據。
