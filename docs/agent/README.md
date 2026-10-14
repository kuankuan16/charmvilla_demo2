# Agent 工作區

Codex 與 Claude Code 共用一套規則與一份進度。只保留會改變下一個動作的內容：規則放入口、狀態放計畫、證據放 QA，不複製第二套專案事實。

## 從這裡接手

1. 讀 [AGENTS.md](../../AGENTS.md)，再讀 [PLAN.md](PLAN.md) 的 active task、FIFO queue 和下一個安全動作。先恢復未完成任務，不因新訊息就丟掉原任務。
2. 讀 [LESSONS.md](LESSONS.md) 中與任務相關的修正，以及 [接手快照](../CODEX_HANDOFF.md)。快照有日期；Git、環境、部署須按需要重新查證。
3. 執行入口規定的 Git 檢查，確認工作樹與修改範圍。依下表只開相關領域文件，避免載入全部歷史 QA。
4. 多步任務依 [計畫模板](PLAN.template.md) 更新既有 `PLAN.md`，列出完成條件與 [必要驗證](VERIFY.md)，在已授權範圍內開始工作。

`CLAUDE.md` 只用 `@AGENTS.md` 導入入口；Codex 直接讀 `AGENTS.md`。不要在 `.claude/`、`.codex/` 再複製一份行為規則。

## 文件各管一件事

| 文件 | 責任 | 更新時機 |
| --- | --- | --- |
| [AGENTS.md](../../AGENTS.md) | 穩定工作規則、資料來源與權限邊界 | 使用者要求或既有授權涵蓋的規則變更 |
| [PLAN.md](PLAN.md) | 唯一進行中任務、FIFO queue、證據、失敗嘗試與接續點 | 開始、補充需求、排隊、重規劃、暫停與交付 |
| [PLAN.template.md](PLAN.template.md) | 計畫格式；不是第二份進度 | 缺少必要交接欄位時 |
| [LESSONS.md](LESSONS.md) | 可重用的使用者糾正 | 出現新糾正，或同一錯誤重犯時 |
| [VERIFY.md](VERIFY.md) | 按變更類型選檢查與辨識副作用 | 命令、檢查範圍或部署方式改變時 |
| [CODEX_HANDOFF.md](../CODEX_HANDOFF.md) | 最新已交付狀態、證據入口與未解限制 | 重大功能、外部服務、部署或工作樹狀態改變時 |

[公開待辦 TASKS.md](../../TASKS.md) 供網站顯示，不是 Agent queue。其舊價格、預購與串接勾選項不得覆蓋 Shopify 現況；本次 Agent 文件整理不修改公開待辦內容。

## 按任務讀取

| 任務 | 先讀 |
| --- | --- |
| Next.js 路由、渲染、快取 | 本機 `node_modules/next/dist/docs/` 對應章節；入口列出常用路徑 |
| 商品、庫存、購物車、會員、CMS／MCP | [Shopify 整合](../shopify-integration.md)；中文內容另讀 [遷移說明](../shopify/chinese-copy-migration.md) |
| 文案、雙語 | [.translation/project-brief.md](../../.translation/project-brief.md)、[style-guide.md](../../.translation/style-guide.md)、[decisions.md](../../.translation/decisions.md)、[protected-terms.txt](../../.translation/protected-terms.txt) |
| 影像、動畫與版面 | 相關資料／元件相鄰註解、Lessons、該頁最近的 QA；使用實際可用的影像工具 |
| GA4、結帳事件、SEO | [追蹤契約](../analytics/ga4-tracking-plan.md)、[正式上線 QA](../qa/2026-10-15-production-launch/README.md)；SEO 另讀 `src/app/sitemap.ts`、`robots.ts` 與 metadata |
| 發布或回復版本 | 接手快照、當次授權、Git remote／branch、Vercel 實際 project／alias；不可只憑舊部署 ID |

## 計畫如何接續

- 只有一個 active task。獨立新任務依到達順序排隊，回覆順位；更正與補充直接併入目前任務，記下新完成條件。
- 同一步驟連續失敗兩次，停止相同重試，填寫「觀察／已排除／新假設／下一個區別性檢查」。能獨立推進就繼續；真正缺少資訊才詢問。
- 完成時保留精簡結果、證據與未執行檢查，設為 `completed` 並先交付，再接 queue 第一項。沒有排隊任務就等待下一個指示；不要自動把外部限制當成新任務。
- 暫停、換 session 或壓縮上下文前，留下分支、已修改檔案、下一個安全動作及 queue。不得把計畫重設空白而遺失未交付工作。
- Agent Memory 可用時同步 `fifo-task-queue` 與 `active-task-preservation`；不可假設跨工具記憶已載入，也不以私人記憶取代 repository 文件。

## 工具與秘密

- 先確認當前可用工具與登入狀態；不要沿用另一台 Mac 的 `/Users/...`、模型名稱、Node 路徑或瀏覽器 session。
- Node 版本以 [.nvmrc](../../.nvmrc) 與 [package.json](../../package.json) 為準，先看 `node --version`。執行方式見驗證清單。
- 瀏覽器沿用使用者指定的 EGO Lite Browser，先讀當前 `ego-browser` skill；確認實際 viewport，再做 1440px／390px QA。不要重開已完成 task 或清掉使用者的測試購物車。
- Claude 的 [.mcp.json](../../.mcp.json) 與 Codex 的 [.codex/config.toml](../../.codex/config.toml) 已設相同兩個 Shopify MCP。新增設定不等於工具已連線；用可用工具或 handshake 驗證。商店 MCP 維持唯讀。
- `.env.local`、token、密碼、顧客資料及含購物車／結帳 key 的網址不得進入計畫、QA、截圖輸出或 Git。外部副作用依目前任務授權判斷。

## 設計依據

使用者提供的 [概念圖](https://s4.tenten.co/Screenshot-2026-10-02-at-3.16.39-AM.jpeg) 與 [六項原則](https://s4.tenten.co/Codex_ClaudeCode_AGENTS-md.txt)：先計畫、最小改動、分工、重現修因、驗證、記錄修正。

本專案沿用已授權即執行與預設循序的工作方式，所以不照抄「每次等 yes」或強制開子 agent。圖中 plugin 建議不等於已安裝；本輪使用現有共用入口與 MCP，沒有新增 plugin、hook 或全域設定。
