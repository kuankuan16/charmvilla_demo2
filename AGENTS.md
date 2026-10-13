<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CHARM VILLA 專案規則

本檔是 Claude Code 與 OpenAI Codex 共用的專案入口。`CLAUDE.md` 以 `@AGENTS.md` 引用本檔；不要另外建立互相矛盾的 agent 規則。

## Agent 工作契約

本節規範工作方式；穩定專案事實仍以下方各節為準。共用文件的用途與維護方式見 [`docs/agent/README.md`](docs/agent/README.md)。

1. **先理解，再動手。** 多檔、跨頁、風險較高或需求仍有關鍵歧義的任務，先用 2–3 句重述目標、邊界與完成條件；若方向會造成實質差異，取得使用者選擇後再實作。將步驟與每一步的驗證方式寫入 [`docs/agent/PLAN.md`](docs/agent/PLAN.md)。暫停或換 session 前一定更新接續點。
2. **只做能解決問題的最小改動。** 不新增未被要求的 dependency、rename 或重構。需要取捨時同時考慮 UX（使用者）、DX（下一位開發者）與 AX（下一位 agent）。刪除或覆寫前先確認來源與可回復方式。
3. **多 agent 不重疊。** 只有在執行環境與上層指示允許時才拆分；explorer 只讀、worker 修改、reviewer 只回報。每個任務都要有單一範圍、完成條件與短交接，同一時間不可讓兩個 agent 修改同一檔案；採用報告前先驗證關鍵主張。
4. **對 bug 負責。** 先依使用者步驟重現，再修根因，最後重跑同一路徑。無法重現時清楚列出缺少的條件；不得以吞錯、關閉規則或隱藏訊息假裝修好。同一步驟連續失敗兩次時，在 `PLAN.md` 記錄嘗試與證據，停止盲試並重新規劃。
5. **驗證後才說完成。** 自己讀完測試輸出；UI 變更必須在實際頁面檢查正常、邊界與失敗狀態。未執行的檢查要明說，不能當成通過。回報需包含：採用的作法、刻意未做的範圍，以及原因。
6. **把修正變成可重用知識。** 使用者糾正行為或決策時，在 [`docs/agent/LESSONS.md`](docs/agent/LESSONS.md) 最上方加入「遇到 X，應做 Y」；相同錯誤再發生，就重寫成更明確、可執行的規則。穩定到足以約束所有任務時，經使用者同意再升格到本檔。

## 每次開始工作前

1. 先讀本檔，再依 [`docs/agent/README.md`](docs/agent/README.md) 的順序讀取 `PLAN.md`、`LESSONS.md` 與 [`docs/CODEX_HANDOFF.md`](docs/CODEX_HANDOFF.md)。後者記錄目前主線、工作樹與未完成任務；開始前必須用 Git 重新驗證，不能把時間點快照當成永久事實。
2. 執行 `git fetch --all --prune`、`git status --short --branch`、`git worktree list --porcelain`，確認主線、未提交檔案與其他 agent 是否仍在工作。
3. 寫任何 Next.js 程式前，依任務閱讀 `node_modules/next/dist/docs/` 內與目前安裝版本相符的文件。此專案是 Next.js 16.3.8 App Router，不可依賴舊版 Next.js 記憶。路由相關至少檢查：
   - `01-app/01-getting-started/02-project-structure.md`
   - `01-app/01-getting-started/05-server-and-client-components.md`
   - `01-app/01-getting-started/15-route-handlers.md`
   - `01-app/01-getting-started/16-proxy.md`
   - 影像、metadata、快取或部署則再讀同目錄對應文件。
4. 只讀與任務直接相關的歷史 QA／研究資料；這些是證據與參考，不是現況規格。

## 溝通與授權

- 一律以繁體中文（臺灣）回覆使用者。
- 最新、明確的使用者指示優先於舊提交、舊截圖、研究文件與 agent 推測；若多個歷史分支互相衝突，以時間較新的已確認決策及現行主線為準。
- 「直接發佈／改完直接發布」才包含正式部署與線上驗證。一般修改請完成本機驗證，但不要自行部署、推送或合併其他未審分支。
- 回報時分開說明：本機實作、測試結果、Git 提交／推送、Preview、Production；不可把其中一項成功說成其他項也完成。

## 專案與架構

- Node 版本：`.nvmrc` 的 Node 24。
- 技術：Next.js 16.3.8、React 19.2.4、TypeScript、Tailwind CSS 4、GSAP、Lenis。
- 路由：所有頁面由 `src/app/[lang]` 產生。英文是預設語言、無前綴網址，中文在 `/zh`（使用者 2026-10-13 改）；`src/proxy.ts` 將無前綴網址 rewrite 到內部 `/en`，並將舊的公開 `/en/...` 308 redirect 回無前綴網址。禁止加入瀏覽器語言自動跳轉。
- 文案：中文是 source of truth。雙語規則見 `.translation/project-brief.md`、`.translation/style-guide.md`、`.translation/decisions.md`、`.translation/protected-terms.txt`。新增可見文案時，必須同時補上中文與英文，沿用 `t("中文", "English")`、`translator(lang)` 或 `useT()` 的既有模式。
- 商品、內容與影像資料主要在 `src/data/`；頁面與元件不可另藏一份互相漂移的商品事實。`src/data/catalog.ts`、`tea-gifts.ts`、`commerce.ts` 的註解記錄大量已核准決策，修改前先讀相鄰註解。
- UI 位於 `src/components/`；全站樣式集中在 `src/app/globals.css`。變更共用 CSS 前先搜尋所有 selector 使用處，並檢查中文／英文、桌機／手機與 reduced-motion。
- Shopify 框架位於 `src/lib/shopify/`、`src/app/api/cart`、`src/app/api/account`、`src/components/cart`、`src/components/account`。目前預設為 local commerce；串接前必讀 `docs/shopify-integration.md`，不得捏造商店網域、token、variant GID、庫存、運費或金流狀態。

## 內容與品牌不可破壞項

- 不推測或自行補寫價格、庫存、尺寸、材質純度、寶石等級、茶葉沖泡參數、配送／退貨條款、獎項與專利事實。缺資料時保留明確的待確認狀態。
- `CHARM VILLA`、`Show more!`、獎項名稱、專利號及 `.translation/protected-terms.txt` 內詞彙必須原樣保留。
- 官方 logo、金魚輪廓與獎項標誌使用既有 `public/brand/` 資產，不以字型代打、不重繪、不拉伸。
- 已核准商品圖與場景不得被生成圖悄悄取代。影像修改要保留比例、材質、刺繡、盒型與配件幾何；實物參考優先於生成推測，並維持足夠留白。
- 影像「已生成／已轉檔」不等於「已驗收」。至少檢查實際輸出尺寸、清晰度、裁切、桌機與手機呈現，以及檔案是否真的被頁面引用。
- 目前美國市場隱藏分類與停售／缺圖處理以 `src/data/catalog.ts` 與 `src/data/tea-gifts.ts` 現況為準；不要只因資料仍存在就重新顯示。

## Git 與多 agent 安全

- `.claude/worktrees/` 是 Claude Code 的本機工作樹，不是可直接提交的專案內容。不要批次加入、搬動或刪除 `.claude/`。
- 發現其他工作樹有未提交變更或仍在執行的 agent 時，不得在同一工作樹或同一批檔案並行修改。先閱讀 `git -C <worktree> status`、diff 與程序狀態，再由使用者決定要完成、保存或放棄原工作。
- 不得直接合併所有 `--no-merged` 分支。Claude 過去保留了多個互相覆蓋的設計實驗；每個分支都要和最新 `origin/main`、較新的使用者決策及目前 UI 比對。
- 不使用 `git reset --hard`、`git checkout --`、強制推送或清除工作樹來處理衝突。既有未提交檔案視為使用者／其他 agent 的工作。
- Commit 訊息延續本專案慣例：清楚寫出頁面／商品、實際變更、來源指示與重要限制；不要只寫 `fix` 或 `update`。

## 實作與驗證

1. 先找到資料來源、元件、樣式、路由及引用資產，確認修改範圍。
2. 小幅、可回復地修改；不要順手重構無關區域，也不要刪除仍可能被歷史路由或其他語言使用的資產。
3. 至少執行：
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - 或一次執行 `npm run check`
4. `scripts/verify-catalog.py` 與 `scripts/verify-tea-gifts.mjs` 是 9 月的歷史 QA 工具，目前含過期假設，不能直接當 release gate。若任務要恢復它們，先讀 `docs/CODEX_HANDOFF.md` 的已知問題、改成不覆寫歷史證據，再用現行型錄校正 assertions。
5. 視覺或互動變更必須用實際瀏覽器檢查代表性中文與英文路由，至少涵蓋桌機 1440px 與手機 390px；檢查 console、failed requests、水平溢出、鍵盤操作、動畫結束狀態及 `prefers-reduced-motion`。
6. 不可因 build 通過就宣稱視覺正確；也不可因本機頁面正確就宣稱已部署。

## 文件權威順序

1. 最新使用者指示、目前 `origin/main` 與經檢視的未提交 diff。
2. `.translation/*` 與 `docs/shopify-integration.md` 的現行規範。
3. `docs/CODEX_HANDOFF.md` 的接手快照。
4. `docs/qa/*` 的歷史驗證紀錄，以及 `docs/research/*` 的參考站研究。兩者可能已被後續提交取代。
5. 舊分支、舊部署記錄與 agent 記憶；只能當線索，必須重新驗證。

完成重大功能、採用或放棄 WIP 分支、變更部署歸屬或解決外部依賴後，同步更新 `docs/CODEX_HANDOFF.md`，讓下一位 agent 不必重做考古。
