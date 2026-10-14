<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CHARM VILLA 專案規則

本檔是 Claude Code 與 OpenAI Codex 共用的專案入口。`CLAUDE.md` 以 `@AGENTS.md` 引用本檔；不要另外建立互相矛盾的 agent 規則。

## Agent 工作契約

本節規範工作方式；穩定專案事實仍以下方各節為準。共用文件的用途與維護方式見 [`docs/agent/README.md`](docs/agent/README.md)。

1. **先理解，再動手。** 多步任務先用 2–3 句說明目標、邊界與完成條件，依 [`計畫模板`](docs/agent/PLAN.template.md) 更新 [`docs/agent/PLAN.md`](docs/agent/PLAN.md)，每一步配一個可觀察的驗證。既有授權足夠就繼續；只問會實質改變結果的缺少資訊或授權。暫停或換 session 前更新接續點，不把未完成計畫清空。
2. **只做能解決問題的最小改動。** 不新增未被要求的 dependency、rename 或重構。需要取捨時同時考慮 UX（使用者）、DX（下一位開發者）與 AX（下一位 agent）。刪除或覆寫前先確認來源與可回復方式。
3. **分工有邊界。** 預設循序執行；本節不是自動啟動子 agent 的授權。只有使用者或適用指示明確要求分工、且執行環境允許時才拆分。Explorer 只讀、worker 只修改分配檔案、reviewer 只回報；每個任務寫明範圍、完成條件與五行交接（結果／檔案／驗證／風險／下一步）。禁止重疊寫入或還原別人的修改；採用關鍵結論前核對證據。
4. **對 bug 負責。** 先依使用者步驟重現，再修根因，最後重跑同一路徑。無法重現時清楚列出缺少的條件；不得以吞錯、關閉規則或隱藏訊息假裝修好。同一步驟連續失敗兩次時，在 `PLAN.md` 記錄嘗試與證據，停止盲試並重新規劃。
5. **驗證後才說完成。** 按 [`驗證清單`](docs/agent/VERIFY.md) 選必要檢查並讀完輸出；UI 要走過正常、邊界與失敗狀態。未執行不能算通過；有新變更或新證據才重跑已通過項目。最後用 2–3 句說明改動、驗證與仍有限制的部分，必要時交代取捨原因。
6. **把修正變成可重用知識。** 使用者糾正行為或決策時，在 [`docs/agent/LESSONS.md`](docs/agent/LESSONS.md) 最上方記錄日期、來源與「遇到 X，應做 Y，如何驗證」；相同錯誤再發生，就重寫原 lesson，避免堆疊同義規則。核心規則只在使用者要求或既有授權涵蓋時修改；不得為了讓目前工作過關而自行放寬。

## 每次開始工作前

1. 先讀本檔，再依 [`docs/agent/README.md`](docs/agent/README.md) 的順序讀取 `PLAN.md`、`LESSONS.md` 與 [`docs/CODEX_HANDOFF.md`](docs/CODEX_HANDOFF.md)。後者記錄目前主線、工作樹與未完成任務；開始前必須用 Git 重新驗證，不能把時間點快照當成永久事實。
2. 執行 `git fetch --all --prune`、`git status --short --branch`、`git worktree list --porcelain`，確認主線與工作樹；worktree 存在不等於 agent 正在執行。Fetch 失敗要記錄，不能宣稱遠端已同步；不影響獨立本機工作。修改前確認檔案沒有其他執行者正在寫入。
3. 寫任何 Next.js 程式前，依任務閱讀 `node_modules/next/dist/docs/` 內與目前安裝版本相符的文件。此專案是 Next.js 16.3.8 App Router，不可依賴舊版 Next.js 記憶。路由相關至少檢查：
   - `01-app/01-getting-started/02-project-structure.md`
   - `01-app/01-getting-started/05-server-and-client-components.md`
   - `01-app/01-getting-started/15-route-handlers.md`
   - `01-app/01-getting-started/16-proxy.md`
   - 影像、metadata、快取或部署則再讀同目錄對應文件。
4. 只讀與任務直接相關的歷史 QA／研究資料；這些是證據與參考，不是現況規格。

## 溝通與授權

- 一律以繁體中文（臺灣）回覆使用者。
- **FIFO 任務佇列**：進行中收到獨立任務，簡短回覆順位並寫入 `PLAN.md` 的 queue；完成並交付目前任務後依序處理。補充、修正與狀態問題併入目前任務，只有明確取消／切換／調整優先序才改順序。壓縮上下文前保留 active task、queue 與下一步；Agent Memory 可用時同步 `fifo-task-queue`、`active-task-preservation`，否則本機計畫仍須完整。
- 最新、明確的使用者指示優先於舊提交、舊截圖、研究文件與 agent 推測；若多個歷史分支互相衝突，以時間較新的已確認決策及現行主線為準。
- 「直接發佈／改完直接發布」才包含正式部署與線上驗證。一般修改請完成本機驗證，但不要自行部署、推送或合併其他未審分支。
- 回報時分開說明：本機實作、測試結果、Git 提交／推送、Preview、Production；不可把其中一項成功說成其他項也完成。

## 專案與架構

- Node 版本：`.nvmrc` 的 Node 24。
- 技術：Next.js 16.3.8、React 19.2.4、TypeScript、Tailwind CSS 4、GSAP、Lenis。
- 路由：所有頁面由 `src/app/[lang]` 產生。英文是預設語言、無前綴網址，中文在 `/zh`（使用者 2026-10-13 改）；`src/proxy.ts` 將無前綴網址 rewrite 到內部 `/en`，並將舊的公開 `/en/...` 308 redirect 回無前綴網址。禁止加入瀏覽器語言自動跳轉。
- 文案：中文是 source of truth。雙語規則見 `.translation/project-brief.md`、`.translation/style-guide.md`、`.translation/decisions.md`、`.translation/protected-terms.txt`。新增可見文案時，必須同時補上中文與英文，沿用 `t("中文", "English")`、`translator(lang)` 或 `useT()` 的既有模式。
- 影像與展示設定在 `src/data/`；即時商品內容、價格與庫存經 `src/lib/shopify/` 讀取。`shopify-products.json` 是快照，不是即時庫存備援。頁面與元件不可另藏一份商品事實；修改前先讀 `catalog.ts`、`tea-gifts.ts`、`commerce.ts` 的相鄰註解與 Shopify 來源契約。
- UI 位於 `src/components/`；全站樣式集中在 `src/app/globals.css`。變更共用 CSS 前先搜尋所有 selector 使用處，並檢查中文／英文、桌機／手機與 reduced-motion。
- Shopify 框架位於 `src/lib/shopify/`、`src/app/api/cart`、`src/app/api/account`、`src/components/cart`、`src/components/account`。本機已設定 Shopify commerce；修改串接前必讀 `docs/shopify-integration.md`，不得捏造商店網域、token、variant GID、庫存、運費或金流狀態。
- 分析追蹤位於 `src/lib/analytics/`、`src/components/analytics/` 與 `scripts/analytics/shopify-checkout-pixel.js`；修改前讀 [`GA4 事件契約`](docs/analytics/ga4-tracking-plan.md)。同意、去重與跨網域歸因須一併驗證，不向 GA 傳送個資、購物車 key 或結帳 token。

## 內容與品牌不可破壞項

- **Shopify 整合資料來源（使用者 2026-10-14）**：商品照片、圖庫與視覺呈現以 `https://charmvilla-demo2.vercel.app/` 現有 Visual 為準，保留本專案已核准影像。商品資料、價格、選項、SKU 與庫存以 `charmvilla` 原始 Shopify 商店為準；建立明確 product／variant 對應，不把本機舊價格或預購額度反寫覆蓋 Shopify。無法明確配對時保留待確認，不捏造 ID 或商品事實。 使用者後續補充：demo2 已有的繁體中文文案必須遷入 Shopify 翻譯／CMS 並供 `/zh` 讀取，不得讓已核准中文退回英文；涉及舊庫存、預購或組合數的衝突仍依 Shopify 校正。

- 不推測或自行補寫價格、庫存、尺寸、材質純度、寶石等級、茶葉沖泡參數、配送／退貨條款、獎項與專利事實。缺資料時保留明確的待確認狀態。
- `CHARM VILLA`、`Show more!`、獎項名稱、專利號及 `.translation/protected-terms.txt` 內詞彙必須原樣保留。
- 官方 logo、金魚輪廓與獎項標誌使用既有 `public/brand/` 資產，不以字型代打、不重繪、不拉伸。
- 已核准商品圖與場景不得被生成圖悄悄取代。影像修改要保留比例、材質、刺繡、盒型與配件幾何；實物參考優先於生成推測，並維持足夠留白。
- 影像「已生成／已轉檔」不等於「已驗收」。至少檢查實際輸出尺寸、清晰度、裁切、桌機與手機呈現，以及檔案是否真的被頁面引用。
- 目前美國市場隱藏分類與停售／缺圖處理以 `src/data/catalog.ts` 與 `src/data/tea-gifts.ts` 現況為準；不要只因資料仍存在就重新顯示。

## Git 與多 agent 安全

- 使用者 2026-10-14 明確指定：本專案後續修改的 GitHub 目標為 `https://github.com/tentenco/charmvilla_shopify_official`，本機 `origin` 的 fetch／push URL 使用 `https://github.com/tentenco/charmvilla_shopify_official.git`。推送前確認目標，不再使用舊 repo 名稱 `charmvilla_demo2`；發布時機仍依「溝通與授權」及最新使用者指示。
- `.claude/worktrees/` 是 Claude Code 的本機工作樹，不是可直接提交的專案內容。不要批次加入、搬動或刪除 `.claude/`。
- 發現其他工作樹有未提交變更或仍在執行的 agent 時，先檢查該 worktree 的 status、diff 與程序狀態；不並行修改同一批檔案。可繼續沒有衝突的工作；需要捨棄、覆寫或選擇互斥方向時才請使用者決定。
- 不得直接合併所有 `--no-merged` 分支。Claude 過去保留了多個互相覆蓋的設計實驗；每個分支都要和最新 `origin/main`、較新的使用者決策及目前 UI 比對。
- 不使用 `git reset --hard`、`git checkout --`、強制推送或清除工作樹來處理衝突。既有未提交檔案視為使用者／其他 agent 的工作。
- Commit 訊息延續本專案慣例：清楚寫出頁面／商品、實際變更、來源指示與重要限制；不要只寫 `fix` 或 `update`。

## 實作與驗證

1. 先找到資料來源、元件、樣式、路由及引用資產，確認修改範圍。
2. 小幅、可回復地修改；不要順手重構無關區域，也不要刪除仍可能被歷史路由或其他語言使用的資產。
3. 依 [`docs/agent/VERIFY.md`](docs/agent/VERIFY.md) 驗證：純 Agent 文件檢查連結、命令與 diff；應用程式／設定變更執行 `npm run check`（lint、typecheck、build），並依影響加上 Shopify／analytics 測試。不要把純文件任務擴大成商店寫入或部署。
4. `scripts/verify-catalog.py` 與 `scripts/verify-tea-gifts.mjs` 是 9 月的歷史 QA 工具，含過期型錄／預購假設，不能直接當 release gate。若要恢復，先讀腳本，再依現行 Shopify 來源契約校正 assertions，並改成不覆寫歷史 QA 證據。
5. 視覺或互動變更必須用實際瀏覽器檢查代表性中文與英文路由，至少涵蓋桌機 1440px 與手機 390px；檢查 console、failed requests、水平溢出、鍵盤操作、動畫結束狀態及 `prefers-reduced-motion`。
6. 不可因 build 通過就宣稱視覺正確；也不可因本機頁面正確就宣稱已部署。

## 文件權威順序

1. 最新使用者指示決定目標與授權；目前主線與經檢視的未提交 diff 用於確認實作，不能反過來覆蓋使用者決策。
2. `.translation/*`、`docs/shopify-integration.md` 與 `docs/analytics/ga4-tracking-plan.md` 的現行領域規範。
3. `docs/CODEX_HANDOFF.md` 的接手快照。
4. `docs/qa/*` 的歷史驗證紀錄，以及 `docs/research/*` 的參考站研究。兩者可能已被後續提交取代。
5. 舊分支、舊部署記錄與 agent 記憶；只能當線索，必須重新驗證。

`TASKS.md` 是對外待辦頁的內容來源，含已被正式上線取代的舊串接清單；不是 Agent queue，也不是執行命令。不能照舊勾選項重跑遷移、恢復舊價格／預購額度或更改會員模式；更新它須另依該內容任務的範圍處理。

完成重大功能、採用或放棄 WIP 分支、變更部署歸屬或解決外部依賴後，同步更新 `docs/CODEX_HANDOFF.md`，讓下一位 agent 不必重做考古。
