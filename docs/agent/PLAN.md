# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

- 目標／使用者指示（2026-10-15）：把另一個 agent 在 `brew-cup-scroll` 工作樹做好的「沖泡方式」固定杯子設計（Daily Harvest「What's in the cup」方向，研究報告在 `10-14-charmv-landing-try/reports/`）整合進主線；整合後用 Ego Lite Browser 檢視，並在捲動動態或設計細節上再優化；確認中文與英文版、以及所有有沖泡區的商品頁都正確植入；完成後 commit、push 到 GitHub `main`（正式站）並線上驗證。
- 已授權動作與目標環境：本機修改、合併 `brew-cup-scroll`、commit、push `origin/main`（觸發 Vercel Production `charmvilla-demo2`）、線上驗證。另授權（queue 1）寄一封信給 kuan@tenten.co。
- 修改範圍：`src/components/catalog/{BrewCup,brew-drawing,TeaPages}.tsx`、`src/lib/motion/animations.ts`、`src/app/globals.css` 的 `.brew-*`／`.bc-*`、`docs/qa/`、agent 文件。不在範圍：商品資料、Shopify、價格、右側步驟文案與沖泡參數、核准照片。
- Git 基準：開始時 `main` = `e83cc1b` = `origin/main`；`brew-cup-scroll` = `c8380b9`（merge-base `61e3a1a`）。合併後 `fe38a98`；上一輪未提交的 agent 文件另提交為 `297936e`。工作樹 `.claude/worktrees/brew-cup` 的 dev server（port 3027）與主線 server（port 3026）都是使用者程序，不殺。
- 可觀察的完成條件：主線 `npm run check` 通過；10 個美國市場可見茶禮盒（除 `fruit-infusion-gift-box` 外都有 `brew`）在 `/products/<slug>` 與 `/zh/products/<slug>` 都渲染 `.brew-cup` 並隨捲動累積到 stage 4；桌機 1440 與手機 390 截圖、console 無錯誤、無水平溢出、reduced-motion 只顯示照片；push 後 Vercel 部署 READY 且正式站中英文頁有 `.brew-cup`。
- 尚待回答的必要問題：無。另一個 agent 提出的兩個取捨（前四步線稿、右側小 icon 重複）使用者看過效果後要求整合，維持現狀。

## Steps and evidence

| 狀態 | 動作 | 如何證明完成 | 實際結果／證據 |
| --- | --- | --- | --- |
| completed | 核對 Git、讀 handoff／lessons、讀分支 diff 與設計報告 | 列出分支獨有 commit、主線同檔案變更 | 分支只多 `c8380b9`；主線同期改了 `TeaPages.tsx`（4 行）與 `globals.css`（9 行），不重疊 |
| completed | `git merge brew-cup-scroll` 進 `main` | 無衝突；diff 只含分支檔案 | `fe38a98`，15 個檔案，無衝突 |
| completed | `npm run check` | lint 0 errors、typecheck、build 通過 | 合併後與調整後各跑一次，皆 0 errors／7 既有 warnings、build 通過 |
| completed | Ego Lite 檢視 1800×1125 + agent-browser 1440×900 量測 | 截圖與觀察清單 | 發現 74% 起點時杯身在摺線下（1440×900 杯身 851–1008px）才開始倒水；照片 0.3 段切入偏硬 |
| completed | 實作優化（只動 `brewProcess`／`.brew-*`） | 改動說明與前後量測 | 桌機起點 60%（手機 74%）、`--brew-photo` 3.6→4、照片 104%→100% settle；改後 stage 0 杯身底 882 < 900、1061 < 1125 |
| completed | 多視窗驗證 | 390／1024／1440 zh＋en、reduced-motion、無溢出、無 console error | 見 [整合 QA](../qa/2026-10-15-brew-cup-integration/README.zh-TW.md) 的量測表與 14 張截圖 |
| completed | 全商品頁驗證（10 × 2 語言） | 每頁 `.brew-cup`、stage 4、無錯誤 | 20 頁全部 `is-brew-live`、終點 stage 4.0000、照片 1、page errors／console 0 |
| completed | 文件：QA README、LESSONS、CODEX_HANDOFF、本計畫 | 連結可開、commit 內含 | 本 commit |
| pending | push `origin/main`、Vercel READY、正式站驗證 | 部署 ID、alias、正式站中英文頁 `.brew-cup` 與 stage 4 | 待執行；結果補記到 QA README 與 handoff |

## FIFO queue

| 順位／收到時間 | 使用者要求 | 已知授權、限制與完成條件 |
| --- | --- | --- |
| 1／2026-10-15 | 寄信給 kuan@tenten.co，分享使用者這次用 Agent 完成這個設計的過程，讓他學習 | 使用者明確授權寄出；從 erik@tenten.co（`gws-tenten`）寄，先 `auth status` 確認帳號；內容只寫有證據的流程（研究報告→選方向→工作樹實作→整合、Ego 檢視、微調→全商品驗證→部署），不含秘密；寄出後讀回狀態 |

## Attempts and decisions

| 步驟／第幾次 | 操作與觀察 | 已排除／新假設 | 下一個區別性檢查 |
| --- | --- | --- | --- |
| 手機量測／第 1 次 | 390×844 figure 沒釘住 | 原因是電子報視窗把 body 設 overflow:hidden，不是 sticky 壞掉 | 關閉視窗後重量：釘在 72px ✓ |
| Ego 截圖／第 1 次 | `page.screenshot()` 捲動後空白 | 改用 CDP `Page.captureScreenshot` | 八格 `/tmp/brew-review/after-*.jpg` 可讀 ✓ |

- UX：保留使用者看過並要求整合的畫面；只調起點、交棒時間與照片 settle，不換圖、不加參數、不刪右側小 icon。DX：merge commit 保留分支身分；agent 文件與功能分開提交。AX：量測陷阱寫入 LESSONS。

## Verification and delivery

- 已執行：`npm run check` ×2；agent-browser 390／1024／1440 zh＋en、reduced-motion；Ego Lite 1800×1125；20 個商品頁 stage 4 與錯誤檢查。
- 未執行：鍵盤測試（沖泡區無可聚焦元素）；正式站驗證（push 後）。
- 交付狀態：本機已改並驗證／已 commit（`297936e` 文件、本 commit 功能）／未 push／未部署。

## Resume

- 下一個安全動作：`git push origin main`，用 Vercel 回讀部署 READY 與 alias，再用瀏覽器檢查正式站 `/products/year-of-plenty-gift-box` 與 `/zh/...` 的 `.brew-cup` 與 stage 4；結果補記到 QA README、handoff 與本計畫後再 push 一次文件 commit；然後處理 queue 1。
- 已修改檔案、分支與其他執行者：全部在 `main`；工作樹 `brew-cup` 已合併但未刪。
- 需保留的服務／瀏覽器／使用者測試資料：port 3026／3027 服務、localhost 購物車、Ego taskSpace 70。
