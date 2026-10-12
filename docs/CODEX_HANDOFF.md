# Claude Code → OpenAI Codex 接手文件

更新時間：2026-10-12（Asia/Taipei）

這份文件是「時間點快照」，用來讓 Codex 接手 Claude Code 留下的主線、工作樹與未完成任務。每次開始工作仍要重新執行 Git 檢查；若本文件與最新使用者指示或 Git 現況不同，以後兩者為準。

## 接手結論

- 目前應使用的專案根目錄是 `/Users/kuan/Documents/Codex/10-02-charmvilla-demo2`。
- Git remote 是 `https://github.com/kuankuan16/charmvilla_demo2`；本次盤點已將根目錄 `main` fast-forward 到 `origin/main` 的 `0eea455b4e03d6b9567e5ae87838142c436a755b`。
- `CLAUDE.md` 只有 `@AGENTS.md`，所以 Claude 與 Codex 的共同規則應維護在根目錄 `AGENTS.md`，不另做兩份相互漂移的 agent 文件。
- 本機 `.vercel/project.json` 已確認連到 `tentenco/charmvilla-demo2`（project `prj_QWvvqmrK6UCFkDhY9DyPAQe2Cx23`，team `team_WwbxohHQlRJLjIfQJDEWpHFV`）。程式的 `siteUrl` 與歷史 QA 仍使用 `https://charmvilla-gallery-site.vercel.app`；正式發布前仍須確認 production alias 與最終 domain，不可僅憑舊 deploy log 推定。
- `.claude/` 內仍保留 Claude Code 工作樹作為歷史與復原依據；2026-10-12 的 About 未提交變更曾由 Codex 接手，但使用者後來明確取消 02＋03 合併，現行 `main` 已恢復四章並重新配置 02 圖片。

## 文件盤點與判讀

### 目前有效、修改前必讀

- `AGENTS.md`：所有 agent 的長期規則與驗證門檻。
- `.translation/project-brief.md`：雙語範圍、中文 source of truth、`/en` 路由與不可變事實。
- `.translation/style-guide.md`：英文語氣、拼字、標題、CTA、alt text 與數字格式。
- `.translation/decisions.md`：語系切換、商品命名、URL、404、日期、bag 等已定案決策。
- `.translation/protected-terms.txt`：不可翻譯或改寫的品牌／獎項／專利詞彙。
- `.translation/reviews/2026-10-01-english-review.md`：當時的英譯檢查證據；後續新增文案仍要重新檢查。
- `docs/shopify-integration.md`：Storefront API、環境變數、商品 mapping 與尚待 Shopify 後台完成的工作。
- `src/data/*.ts` 與相鄰註解：10/02–10/08 多輪使用者決策大多直接記在資料與元件旁，通常比 9 月研究文件新。

### 只作歷史證據／設計參考

- `docs/qa/*`：每一資料夾描述當時某次本機或正式站驗證；其中有些明載「尚未部署」或已被後續版本取代。需要查回歸來源、舊截圖、舊部署紀錄時再讀。
- `docs/research/components/*`：9/23 左右的 component spec，適合理解早期互動與素材來源，但目前商品頁、Header、茶款與沖泡區已多次重做。
- `docs/research/laxer/*`、`docs/research/afuri/*`：參考站拓撲與行為研究，不是要求逐字、逐圖或逐程式複製。
- `docs/research/**/*.json`：量測與素材證據；若現行元件或最新使用者指示不同，以後者為準。

## 現行架構摘要

- Next.js 16.3.8 App Router；Node 24；React 19.2.4；TypeScript；Tailwind CSS 4；GSAP／Lenis。
- `src/app/[lang]`：所有中英文頁面。中文公開 URL 無前綴，英文用 `/en`；`src/proxy.ts` 負責 rewrite／redirect。
- `src/data/`：內容、商品、茶禮盒、價格、commerce、影像與 Shopify mapping，是商品事實的主要來源。
- `src/components/catalog/`：商品清單、商品頁、圖庫、茶款、沖泡流程等。
- `src/components/chrome/`、`src/components/sections/`：全站導覽與首頁區塊。
- `src/lib/shopify/`、`src/app/api/cart`、`src/app/api/account`：購物車與會員 API 框架。
- `public/media/`、`public/brand/`：現行網站影像、影片與官方品牌資產。
- `src/app/globals.css`：大量全站與頁面樣式；改動前必須搜尋 selector 與所有斷點。

## 2026-10-12 Claude WIP 接手結果

工作樹實體路徑：

`/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/.claude/worktrees/brewing-steps-redesign`

實際 branch：`worktree-tea-notes-stack`（資料夾名與 branch 名不同）

基底：`0eea455`，與盤點時的 `origin/main` 相同。

盤點時 Claude session 已達使用上限，以下 3 個檔案留有未提交變更：

- `src/app/[lang]/(catalog)/about/page.tsx`
- `src/app/globals.css`
- `src/data/about.ts`

這批變更原先對應使用者 2026-10-12 的指示：將 About 的 02「一尾小金魚」與 03「被世界看見」合併並重新潤稿。原工作樹的內容包括：

- 四章改成三章，原 04 重新編為 03。
- 合併後標題為「一尾小金魚，被世界看見」。
- 將誕生、16 道工序、Red Dot／iF、34 國專利、媒體與京都店整理為三段。
- 移除原 02 的缺圖 placeholder，採用原 03 的 `CV-0169` 圖。
- 獎項標誌顯示條件由 `world` 移到 `goldfish`。
- 標題加 `text-wrap: balance`，並移除 placeholder 樣式。

接手時已執行：

```bash
git worktree list --porcelain
git -C .claude/worktrees/brewing-steps-redesign status --short --branch
git -C .claude/worktrees/brewing-steps-redesign diff --check
git -C .claude/worktrees/brewing-steps-redesign diff -- src/app/'[lang]'/'(catalog)'/about/page.tsx src/data/about.ts src/app/globals.css
```

後續決策與目前狀態：

- 原工作樹 commit：`d33869a`（`refactor: merge About story chapters`）。
- 曾 cherry-pick 至本機 `main`：`f89f9ac`，但這個三章版本已被後續使用者指示取代，不得再重複套用。
- 使用者隨後明確要求「取消合併，再幫我重新配圖」「挑適合 02 的圖」；本機 `main` commit `83a5d55` 已恢復四章。
- 02「一尾小金魚」改用 `public/media/site/about-02.webp`，畫面是雙手製作茶包、裁片、棉線與茶葉，呼應 16 道工序與 9 道手作；不再顯示缺圖 placeholder。
- 03「被世界看見」繼續使用 `CV-0169` 鏡面紙金魚照，Red Dot／iF 標誌仍顯示在 03 文字下方；04 恢復原編號與左右交錯位置。
- `npm run check` 通過：ESLint 0 errors／8 個既有 warnings、TypeScript 通過、Next production build 通過並產生 65 個靜態頁面。
- 已以 1440px 與 390px 實際截圖檢查 `/en/about`；02 手作圖裁切、四章交錯、03 獎項標誌與手機版排列正常。
- 本機 `next start` 對無語系前綴的 `/about` 會在 rewrite 與 `/zh` redirect 之間循環，但正式站同一路徑回應 200；這是本次 About 改動以外的既有 routing／本機執行差異，尚未另行修改。
- 尚未 push、尚未部署至 Production。最新 Vercel Preview 是 `dpl_J7VNa3dv4dH6rRVxKziw2TdxMeht`：`https://charmvilla-demo2-49d7ul1xe-tentenco.vercel.app`，狀態 READY；此版已縮小 iF Gold 標誌，使它與 Red Dot 標誌的視覺尺寸接近。專案啟用 Vercel Authentication，需具存取權的 Vercel 帳號登入。
- 已透過 Vercel protection bypass 驗證 Preview `/about` 回應 200，HTML 包含 `about-02.webp`、「一尾小金魚」與「被世界看見」。

工作樹先保留，不需刪除；其中的 About branch 已無未提交修改。

## 2026-10-12 茶款介紹改版

- 依 Vizooli Home B 的「Working Process」版面邏輯重新設計商品頁「茶款介紹」，但只轉譯其構圖節奏：淺灰全幅背景、置中的小標與大標題、桌面三欄錯落卡片、卡片內的圖片／編號／進度標記／完整說明；未複製參考站的商標、文案、圖片或程式。
- 保留 CHARM VILLA 既有核准茶葉照片與雙語內容，使用品牌金色作為識別點，並將原本依賴 hover 的說明改為直接可讀。
- 桌面為三欄錯落排列，平板為兩欄，手機改成可鍵盤操作的橫向 snap 卡片，右側保留下一張卡片的預告。
- 以中文 5 張卡與英文 2 張卡兩種資料量驗證；1440px、390px、鍵盤水平捲動與 reduced motion 均完成檢查，沒有頁面橫向溢位或卡片內容裁切。
- `npm run check` 通過：ESLint 0 errors／8 個既有 warnings、TypeScript 通過、Next production build 通過並產生 65 個靜態頁面。
- 程式提交：`cd18e3e`（`redesign tea notes after Vizooli process layout`）。尚未 push、未部署 Production。
- Vercel Preview：`https://charmvilla-demo2-oo253y9bu-tentenco.vercel.app`，狀態 READY；已透過 Vercel protection bypass 確認中文與英文代表商品頁皆回應 200。專案啟用 Vercel Authentication，需具存取權的 Vercel 帳號登入。

### 2026-10-12 茶款與沖泡區第二輪調整

- 茶款卡片改為 CSS sticky：依 Vizooli Working Process 的捲動節奏，錯落卡片會逐張上滑並吸附到同一上緣；卡片進度方塊已移除。
- 卡片標示採 `TEA / 01` 至 `TEA / 05`；編號為品牌金色、200 字重的大字。茶葉照片裁切放大至 `scale(1.24)`，卡片桌面高度 500px、手機 490px，說明文字統一 16px，茶名與段落間距 18px。
- 「茶款介紹」及同層級「沖泡方式」標題縮小；FAQ、運送退換貨、隱私權、服務條款與 Prop 65 等純文字頁統一為茶款區的 `#efefed` 背景，既有進度方塊已刪除。
- 「美好的沖泡方式」改採 Agasis Brand Identity 的 `All you need to launch` 架構：左側小字「美好的」與大字「沖泡方式」為 sticky，右側 01–05 細線列表搭配金色線稿 icon；各列依捲動由下方 32px 逐列淡入上移。
- 本機視覺檢查確認 5 張卡片高度一致、茶葉裁切放大、`TEA / 01–05` 正確、無頁面橫向溢位；沖泡區 sticky 標題、列表列線、icon 與 stagger 動態正常。
- `npm run check` 通過：ESLint 0 errors／8 個既有 warnings、TypeScript 通過、Next production build 通過並產生 65 個靜態頁面。
- 程式提交：`b629f37`（`refine tea cards and brewing process`）。Vercel Preview `https://charmvilla-demo2-llxcrfa0g-tentenco.vercel.app`（deployment `dpl_9haegcNdXcddX7boPuShCqxAR5o4`）為 READY；線上代表商品頁已確認 `TEA / 01–05`、沖泡標題、零舊進度方塊與零水平溢位。尚未 push、未部署 Production。

### 2026-10-12 茶款與沖泡區第三輪調整

- 「小金魚茶包」與「美好的」前方品牌金色標記由方塊改為圓點；第一個程式提交為 `d92b392`（`round section kicker markers`）。
- 依最新畫面標註，茶款卡片別名／說明、沖泡步驟說明、商品簡介、故事／紫斑蝶背景，以及規格內容與括號次要標示，全部統一為 `17px`；標題、步驟編號與按鈕維持原尺寸。桌面與手機規則均已覆蓋，瀏覽器 computed style 檢查皆為 `17px`，且頁面無水平溢位。
- 本機購物車可能同時含美國茶禮盒的 USD 定價與其他商品的台灣 TWD 定價；原實作錯把不同幣別數值直接相加並套用第一項幣別。購物車現改為分幣別小計（例如 `$170.00 + NT$760`），不做未授權的匯率換算，並顯示市場／幣別提示。
- 沖泡步驟新增細緻垂直進度軸：灰線與灰色圓點為底，捲動時金線由上往下延伸，通過的步驟節點逐一轉為品牌金；保留既有文字淡入、右側線稿 icon 與 Agasis 式雙欄排版。Reduced motion 模式直接顯示完整金線與金色節點。
- 商品頁底部英文品牌標語最大寬度由 22ch 增至 30ch，字重由 500 降至 300。禮盒規格的「盒內茶款／茶款選擇」刪除括號中的英文與別名小字，只保留茶名與數量；茶款介紹仍保留完整名稱。
- `npm run check` 通過：ESLint 0 errors／8 個既有 warnings、TypeScript 與 Next production build 通過。瀏覽器確認沖泡進度 01–03 金色、04–05 灰色的中段狀態、五款禮盒茶名無別名小字、標語 300 字重與零水平溢位。
- 紫斑蝶商品的「關於臺灣的紫斑蝶」並非已確認的品牌原始文案：它由 Claude Fable 5.1 在 `d00bf091`（2026-10-07）加入，提交說明稱該批資料來自使用者提供的兩份 PDF，但專案未保留該段的 PDF 頁碼或逐句來源。自然史背景多可對應官方機構資料，但「禮盒刺繡確為端紫斑蝶」目前無可追溯品牌來源；未取得使用者決定前不得宣稱為核准文案，也不要自行擴寫。
- 本輪程式提交：`d8094e0`（`add brewing progress and refine product copy`）。Vercel Preview `https://charmvilla-demo2-7wb8nox0n-tentenco.vercel.app`（deployment `dpl_4dAoFHpPnciFehk676iy99SZvmz6`）為 READY；線上代表商品頁已確認 3 個進度節點隨目前捲動位置轉金、別名小字移除、圓點小標、300 字重品牌標語與零水平溢位。尚未 push、未部署 Production。

## 其他未完成或未審工作

### `member-pages-wip`

- Commit：`ebce79e`。
- 提交訊息已明載「尚未檢查」。
- 相對主線有約 56 個檔案、2,503 行新增，重做會員註冊、登入、啟用、重設密碼、地址、訂單、偏好與 Shopify customer/admin 支援。
- 風險高：主線之後已修改相同 account／Shopify／CSS 區域，且真實 Shopify 仍未串接。不可直接 merge；應先做安全、session/cookie、API error、雙語、未設定模式與真實商店相容性 review，再逐段移植。
- Codex 曾在隔離工作樹 `.claude/worktrees/codex-member-pages-review` 建立本機 review branch `codex/member-pages-review`，以目前 `main` 為基底試套 `ebce79e`；沒有合併回 `main`。
- 試套時 `AccountClient.tsx` 有 modify/delete 衝突，`src/data/commerce.ts` 與較新的美國政策文案衝突；保留現行政策後，型別檢查仍因兩個會員頁引用已不存在的 `company` 欄位而失敗。審查在使用者改回 About 任務時暫停，該 review branch 不可視為可合併版本。

### Shopify 正式串接

- `.env.example` 預設 `NEXT_PUBLIC_COMMERCE_MODE=local`。
- 正式模式仍需要真實 `SHOPIFY_STORE_DOMAIN`、Storefront token、商品 handle 與 variant GID，以及 Shopify 後台的 Markets、付款、帳戶與結帳品牌設定。
- 未完成前，local cart 與 `not_configured` 是預期行為，不可宣稱正式結帳或會員功能已可用。

### 商品圖 placeholder／停售狀態

- `src/data/catalog.ts`、`tea-gifts.ts` 仍有 `placeholderViews`、`缺圖` 與停售色塊；部分是使用者刻意下架、部分是真正待挑圖。
- 不可用一次全域搜尋後全部補圖或全部刪除。每個商品／選項要讀相鄰註解與最新提交，確認是停售、缺素材或仍待品牌方決定。

### 歷史 verifier 尚未現代化

- `python3 scripts/verify-catalog.py` 不是無參數工具；它需要 `<base-url> <output-json>`，並硬編碼 9 月時的 26 條 sitemap route、首頁 20 個商品連結與舊 canonical／anchor 假設。現行美國分類與商品數已變動，使用前要逐項更新。
- `node scripts/verify-tea-gifts.mjs` 的暫存轉譯清單未包含後來新增的 `src/data/measure.ts`，盤點時先在 `Cannot find module './measure'` 中止；即使補上，contact-sheet 的 SVG 文字也會因商品名中的 `&` 未 escape 而失敗。它還會寫回 `docs/qa/2026-09-29-tea-gift-boxes/`、固定 16 款舊型錄與舊 gallery hashes，因此不可直接跑來覆寫歷史證據。
- 要恢復這些工具時，應改為顯式輸出到新的日期資料夾或暫存目錄，從現行 catalog 推導預期數量，保留真正需要固定的商業 invariants，並加入 package script 後再升格為 release gate。

### 其他 `--no-merged` 分支

盤點時還有 `save-oak-preview`、`worktree-about-remove-links-sources`、`worktree-about-remove-shop-buttons`、`worktree-brewing-steps-redesign`、`worktree-paren-note-inline`、`worktree-scene-hand-lifting-goldfish-tag`、`worktree-story-text-reference-block`、`worktree-swap-year-of-plenty-scenes`。

這些多數建立於 10/07–10/08，而 `main` 在同區域已有大量更晚、互相覆蓋的修改。它們的存在不代表仍應實作；先以 `git log --left-right origin/main...<branch>`、`git diff origin/main...<branch>` 與最新使用者決策判斷。尤其：

- `worktree-scene-hand-lifting-goldfish-tag` 的提交訊息明載「尚未放到任何頁面」。
- About、故事區塊、括號文字、年年有魚圖序與沖泡區已在主線反覆改版；舊分支很可能已過時或只剩部分概念可移植。

## 已確認的現行產品／內容原則

- 中文是核准來源，英文頁需同步，但不可擴張中文未聲稱的賣點。
- 美國市場目前隱藏真皮包、金飾與豐盛系列；資料保留不等於應顯示。
- 商品事實不可推測。價格、材質、尺寸、茶款、包數、獎項、專利與政策要能追到現行資料或使用者來源。
- 官方 logo、金魚輪廓、Red Dot／iF 標誌使用既有品牌資產。
- 茶禮盒商品圖目前有明確的盒型、刺繡、無緞帶、三張情境圖與場景選擇歷史；修改前讀 `src/data/catalog.ts`、`src/data/tea-gifts.ts` 的最新註解與 `git log -- <file>`。
- 視覺參考要轉譯成 CHARM VILLA 的品牌語彙，不能複製參考站商標、文案、影像或程式。

## 建議的 Codex 接手順序

1. About 維持四章：02「一尾小金魚」使用 `about-02.webp` 手作照，03「被世界看見」使用 `CV-0169`；不要再套用舊的 02＋03 合併 commit。
2. 將 `member-pages-wip` 視為獨立的大型 review／重做任務，不和 About 小改一起合併。
3. 若要處理其他未合併分支，先比較它和最新 `main` 的實際差異，再判斷是否仍符合最新使用者決策。
4. 只有使用者要求正式發布時，才檢查 Vercel 專案歸屬、部署、alias、代表路由與資產；Git push 與 Vercel Production 是兩個獨立狀態。

## 驗證清單

基礎檢查：

```bash
nvm use
npm run check
```

截至本次盤點，`.claude/**` 加入 ESLint global ignore 後，主線 lint 為 0 errors／8 個既有 warnings，TypeScript 與 Next.js production build 均通過。上述兩支歷史 verifier 不列入這次通過範圍。

視覺／互動至少檢查：

- `/` 與 `/en`
- `/about` 與 `/en/about`
- `/collections/tea` 與 `/en/collections/tea`
- 一款有多選項的茶禮盒商品頁
- 一款香氛或柴燒商品頁
- `/faq`、一個 policy route、`/account`
- 1440px、390px、鍵盤操作、reduced motion、console 與 failed requests

發布（僅在獲得發布授權後）要另外確認：

- 目前登入的 Vercel 帳號與 team。
- `.vercel/project.json` 指向的 project 是否就是本次目標。
- Preview／Production deployment 都是 Ready，最終 alias 指向新 deployment。
- `https://charmvilla-gallery-site.vercel.app` 與實際目標 domain 的代表頁、語系、媒體與 API 行為。
- Git remote 的目標 branch 已 push；不要把本機 commit、Git push、Vercel deploy 混為同一件事。
