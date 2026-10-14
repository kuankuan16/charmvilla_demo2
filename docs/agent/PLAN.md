# Active Agent Plan

Status: `delivered`（主任務與 queue 1 都已交付）
Updated: 2026-10-15

## Active task

- 目標／使用者指示（2026-10-15）：把另一個 agent 在 `brew-cup-scroll` 工作樹做好的「沖泡方式」固定杯子設計（Daily Harvest「What's in the cup」方向，研究報告在 `10-14-charmv-landing-try/reports/`）整合進主線；整合後用 Ego Lite Browser 檢視，並在捲動動態或設計細節上再優化；確認中文與英文版、以及所有有沖泡區的商品頁都正確植入；完成後 commit、push 到 GitHub `main`（正式站）並線上驗證。
- 已授權動作與目標環境：本機修改、合併 `brew-cup-scroll`、commit、push `origin/main`（觸發 Vercel Production `charmvilla-demo2`）、線上驗證。另授權（queue 1）寄一封信給 kuan@tenten.co。
- 修改範圍：`src/components/catalog/{BrewCup,brew-drawing,TeaPages}.tsx`、`src/lib/motion/animations.ts`、`src/app/globals.css` 的 `.brew-*`／`.bc-*`、`docs/qa/`、agent 文件。不在範圍：商品資料、Shopify、價格、右側步驟文案與沖泡參數、核准照片。
- Git：開始時 `main` = `e83cc1b` = `origin/main`；`brew-cup-scroll` = `c8380b9`。合併 `fe38a98`、agent 文件 `297936e`、功能 `864f7a0`，已 push；部署 `dpl_B3uNgcUTgd2eZhcu8K8K4YAQrgd8` READY。工作樹 `.claude/worktrees/brew-cup` 已合併但未刪；port 3026／3027 dev server 是使用者程序，不殺。
- 可觀察的完成條件（全部達成）：主線 `npm run check` 通過；10 個可見茶禮盒在 `/products/<slug>` 與 `/zh/products/<slug>` 都渲染 `.brew-cup` 並捲到 stage 4；桌機 1440 與手機 390 截圖、console 無錯誤、無水平溢出、reduced-motion 只顯示照片；Vercel READY 且正式站中英文頁有 `.brew-cup` 並捲到 stage 4。
- 尚待回答的必要問題：無。

## Steps and evidence

| 狀態 | 動作 | 如何證明完成 | 實際結果／證據 |
| --- | --- | --- | --- |
| completed | 核對 Git、讀 handoff／lessons、讀分支 diff 與設計報告 | 列出分支獨有 commit、主線同檔案變更 | 分支只多 `c8380b9`；主線同期改了 `TeaPages.tsx`（4 行）與 `globals.css`（9 行），不重疊 |
| completed | `git merge brew-cup-scroll` 進 `main` | 無衝突；diff 只含分支檔案 | `fe38a98`，15 個檔案，無衝突 |
| completed | `npm run check` | lint 0 errors、typecheck、build 通過 | 合併後與調整後各跑一次，皆 0 errors／7 既有 warnings、build 通過 |
| completed | Ego Lite 檢視 1800×1125 + agent-browser 1440×900 量測 | 截圖與觀察清單 | 74% 起點時杯身在摺線下（1440×900 杯身 851–1008px）才開始倒水；照片 0.3 段切入偏硬 |
| completed | 實作優化（只動 `brewProcess`／`.brew-*`） | 改動說明與前後量測 | 桌機起點 60%（手機 74%）、`--brew-photo` 3.6→4、照片 104%→100% settle；改後 stage 0 杯身底 882 < 900、1061 < 1125 |
| completed | 多視窗驗證 | 390／1024／1440 zh＋en、reduced-motion、無溢出、無 console error | [整合 QA](../qa/2026-10-15-brew-cup-integration/README.zh-TW.md) 量測表與 14 張截圖 |
| completed | 全商品頁驗證（10 × 2 語言） | 每頁 `.brew-cup`、stage 4、無錯誤 | 20 頁全部 `is-brew-live`、終點 stage 4.0000、照片 1、errors 0 |
| completed | 文件：QA README、LESSONS、CODEX_HANDOFF、本計畫 | 連結可開、commit 內含 | `864f7a0` 與部署補記 commit |
| completed | push `origin/main`、Vercel READY、正式站驗證 | 部署 ID、alias、正式站中英文頁 stage 4 | `e83cc1b..864f7a0`；`dpl_B3uNgcUTgd2eZhcu8K8K4YAQrgd8` READY、www／apex alias；正式站 zh／en × 1440／390 都 stage 4、0 errors |

## FIFO queue

| 順位／收到時間 | 使用者要求 | 已知授權、限制與完成條件 |
| --- | --- | --- |
| 1／2026-10-15（已交付） | 寄信給 kuan@tenten.co，分享使用者這次用 Agent 完成這個設計的過程，讓他學習 | 使用者明確授權寄出。`gws-tenten auth status` 確認 `user: erik@tenten.co` 後以 `gmail +send` 寄出，純文字、不含秘密；回傳 message id `1a13c45a1dc11a59`，label `SENT`。內容：研究報告→選方向→工作樹實作→整合、Ego 檢視、微調→全商品驗證→部署，以及可學的作法；信末註明由 agent 依指示整理寄出 |

## Attempts and decisions

| 步驟／第幾次 | 操作與觀察 | 已排除／新假設 | 下一個區別性檢查 |
| --- | --- | --- | --- |
| 手機量測／第 1 次 | 390×844 figure 沒釘住 | 原因是電子報視窗把 body 設 overflow:hidden，不是 sticky 壞掉 | 關閉視窗後重量：釘在 72px ✓ |
| Ego 截圖／第 1 次 | `page.screenshot()` 捲動後空白 | 改用 CDP `Page.captureScreenshot` | 八格 `/tmp/brew-review/after-*.jpg` 可讀 ✓ |

- UX：保留使用者看過並要求整合的畫面；只調起點、交棒時間與照片 settle，不換圖、不加參數、不刪右側小 icon。DX：merge commit 保留分支身分；agent 文件與功能分開提交。AX：量測陷阱寫入 LESSONS。

## Verification and delivery

- 已執行：`npm run check` ×2；agent-browser 390／1024／1440 zh＋en、reduced-motion；Ego Lite 1800×1125；20 個商品頁 stage 4 與錯誤檢查；正式站 zh／en × 1440／390 實際捲動。
- 未執行：鍵盤測試（沖泡區無可聚焦元素）；正式站其餘 9 個商品頁沒有逐頁再捲（同一份 build，本機已逐頁驗證）。
- 交付狀態：本機已改並驗證／已 commit／已 push `origin/main`／Production `dpl_B3uNgcUTgd2eZhcu8K8K4YAQrgd8` READY 並線上驗證。

## Resume

- 下一個安全動作：無待辦；queue 已清空。若使用者要清理 `.claude/worktrees/brew-cup`（已合併），先確認 port 3027 服務與該工作樹沒有其他執行者。
- 已修改檔案、分支與其他執行者：全部在 `main` 並已 push；工作樹 `brew-cup` 已合併但未刪。
- 需保留的服務／瀏覽器／使用者測試資料：port 3026／3027 服務、localhost 購物車。
