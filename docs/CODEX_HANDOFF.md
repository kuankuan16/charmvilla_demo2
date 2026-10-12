# Claude Code → OpenAI Codex 接手文件

更新時間：2026-10-12（Asia/Taipei）

這份文件是「時間點快照」，用來讓 Codex 接手 Claude Code 留下的主線、工作樹與未完成任務。每次開始工作仍要重新執行 Git 檢查；若本文件與最新使用者指示或 Git 現況不同，以後兩者為準。

## 接手結論

- 目前應使用的專案根目錄是 `/Users/kuan/Documents/Codex/10-02-charmvilla-demo2`。
- Git remote 是 `https://github.com/kuankuan16/charmvilla_demo2`；本次盤點已將根目錄 `main` fast-forward 到 `origin/main` 的 `0eea455b4e03d6b9567e5ae87838142c436a755b`。
- `CLAUDE.md` 只有 `@AGENTS.md`，所以 Claude 與 Codex 的共同規則應維護在根目錄 `AGENTS.md`，不另做兩份相互漂移的 agent 文件。
- 本機 `.vercel/project.json` 連到 Vercel project `charmvilla-demo2`（team `team_WwbxohHQlRJLjIfQJDEWpHFV`），但程式的 `siteUrl` 與歷史 QA 使用 `https://charmvilla-gallery-site.vercel.app`。兩者命名不一致；正式發布前必須重新確認 project、alias、Git integration 與最終 domain，不可僅憑舊 deploy log 推定。
- 根目錄主線本身乾淨，但 `.claude/` 內有 Claude Code 工作樹；其中一個在 2026-10-12 仍有進行中的未提交變更。

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

## 2026-10-12 進行中的 Claude WIP

工作樹實體路徑：

`/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/.claude/worktrees/brewing-steps-redesign`

實際 branch：`worktree-tea-notes-stack`（資料夾名與 branch 名不同）

基底：`0eea455`，與盤點時的 `origin/main` 相同。

盤點時 Claude 背景程序仍在執行，以下 3 個檔案有未提交變更：

- `src/app/[lang]/(catalog)/about/page.tsx`
- `src/app/globals.css`
- `src/data/about.ts`

這批變更對應使用者 2026-10-12 的新指示：將 About 的 02「一尾小金魚」與 03「被世界看見」合併並重新潤稿。現有 diff 大致包含：

- 四章改成三章，原 04 重新編為 03。
- 合併後標題為「一尾小金魚，被世界看見」。
- 將誕生、16 道工序、Red Dot／iF、34 國專利、媒體與京都店整理為三段。
- 移除原 02 的缺圖 placeholder，採用原 03 的 `CV-0169` 圖。
- 獎項標誌顯示條件由 `world` 移到 `goldfish`。
- 標題加 `text-wrap: balance`，並移除 placeholder 樣式。

接手前先執行：

```bash
git worktree list --porcelain
git -C .claude/worktrees/brewing-steps-redesign status --short --branch
git -C .claude/worktrees/brewing-steps-redesign diff --check
git -C .claude/worktrees/brewing-steps-redesign diff -- src/app/'[lang]'/'(catalog)'/about/page.tsx src/data/about.ts src/app/globals.css
```

不要在根目錄重做同一改動，也不要終止／刪除該工作樹。先確認 Claude session 已停止或由使用者明確決定交給 Codex，再在該工作樹完成文案、雙語、build 與桌機／手機視覺 QA。盤點時這批修改尚未 commit、尚未 merge、尚未 deploy，也沒有完成驗證紀錄。

## 其他未完成或未審工作

### `member-pages-wip`

- Commit：`ebce79e`。
- 提交訊息已明載「尚未檢查」。
- 相對主線有約 56 個檔案、2,503 行新增，重做會員註冊、登入、啟用、重設密碼、地址、訂單、偏好與 Shopify customer/admin 支援。
- 風險高：主線之後已修改相同 account／Shopify／CSS 區域，且真實 Shopify 仍未串接。不可直接 merge；應先做安全、session/cookie、API error、雙語、未設定模式與真實商店相容性 review，再逐段移植。

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

1. 確認 Claude 背景工作已停止，保存 `worktree-tea-notes-stack` 的未提交 diff。
2. 先完成 About 02＋03 合併：核對中文事實、英文忠實度、獎項 logo、三章交錯版型，以及 1440／390 實際畫面。
3. 在該工作樹執行 `npm run check`；若成功，再決定 commit 與如何整合回最新 `main`。不要從根目錄覆蓋該 diff。
4. 將 `member-pages-wip` 視為獨立的大型 review／重做任務，不和 About 小改一起合併。
5. 只有使用者要求正式發布時，才檢查 Vercel 專案歸屬、部署、alias、代表路由與資產；Git push 與 Vercel Production 是兩個獨立狀態。

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
