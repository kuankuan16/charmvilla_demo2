# Active Agent Plan

Status: `idle`（2026-10-14：使用者指示「直接發布」；商品頁桌機主圖清晰度已推送並部署 Production，線上中英文桌機／手機與互動驗證通過。）

## 新任務模板

- Objective：待下一個任務。
- Scope：待下一個任務。

| Step | Proof of completion | Status |
| --- | --- | --- |
| 待填 | 待填 | `pending` |

- Attempts and re-plan：發布的手機 QA 曾將 viewport 切換後導航造成的 canceled image 當成載入失敗；已保留原始觀測，以 about:blank 隔開測試後重跑成功，未修改 app。詳見本次 QA。
- Last completed：實作 commit `4b1e83a`、Production `dpl_2yd5e4hb4ALp8iB8iWwhR8NFrbjh` READY；5 組線上 QA、春曉互動與既有 www domain 只讀確認通過。發布證據見 CODEX_HANDOFF 與 `docs/qa/2026-10-14-product-image-clarity/production/`；本記錄對應實作 commit，後續文件 commit 不改程式。
- Next safe action：依下一個使用者指示開始；推送目標為 `tentenco/charmvilla_shopify_official`。即時查核 Git／Vercel；目前 `www.charmvilla.com` 已綁同一專案，Production 會同步更新既有 alias。以下歷史待辦保留，不自行續做。

## 以下為既有任務紀錄（保留待辦；不代表目前 Git 狀態）

Status: `idle`（2026-10-13：依 Google 文件「English Copy Review & Recommended Changes」改好英文文案，已提交、尚未推送；需客戶決定的項目見對話回報與交接清單。前一批 `bdc8c03` 也尚未推送）

開始新任務時以本模板取代下方欄位；完成並更新 handoff 後，恢復為 `idle`。

## Objective

- Outcome：一次發布 Codex 10-12 下午完成的三件事：
  1. 商品頁「沖泡方式」：方案 01 點到點進度動畫＋方案 02 左圖右文，左側新倒熱水照（杯中小金魚茶包、加回無孔茶標）。
  2. 六款禮盒（＋春曉粉紅、蝴蝶蘭粉紅）新增桌面「金魚商品圖／禮盒高清圖」正面實拍為圖二；原圖二往後移、全部舊圖保留；淺灰底、統一大小、contain 不裁切。
  3. 「茶款介紹」上方小標由固定的「小金魚茶包」改為各頁商品名稱（`product.name`，英文頁用英文名）。
- Release authorization：使用者在 Codex session（16:24、16:40）說「改完就直接發佈」「好了直接發佈」，16:52 說「上線完成跟我說」。依 AGENTS.md「授權不跨情境」，Claude 接手後先向使用者確認一次再推送。
- Out of scope：Shopify 串接（待真實商店資料）、`member-pages-wip`、其他 `--no-merged` 分支。
- Done when：commit＋push `main`；Git 觸發的 Production（`tentenco/charmvilla-demo2`，alias `charmvilla-demo2.vercel.app`）READY；線上中英文代表頁確認三件事都在；`docs/CODEX_HANDOFF.md` 與 QA README 補上線上證據。

## 未提交的檔案（全部屬於上面三件事）

- 程式：`src/app/globals.css`、`src/components/catalog/{BrewProcess,ProductGallery,TeaKinds,TeaPages}.tsx`、`src/data/{catalog.ts,tea-gifts.ts,images.json}`、`src/lib/motion/animations.ts`
- 新圖：`public/media/site/official-gift-front-*-cutout-v3.webp`（8 張）、`public/media/site/scene-brewing-hot-water-goldfish-tag-walnut.webp`
- 部署安全：`.vercelignore` 追加 `.env*`（保留 `.env.example`）與 `temp/`
- 證據：`docs/qa/2026-10-12-brew-photo-progress/`、`docs/qa/2026-10-12-gift-front-hd/`
- 文件：`docs/agent/{PLAN,LESSONS,README}.md`、`docs/CODEX_HANDOFF.md`
- 不提交：`temp/`（已被 ignore，存放未採用版本）

## 暫不上線的倒熱水照片（使用者 17:35「這張照片先別上線」）

- 問題（Claude 放大檢查）：茶標字樣是「CHARMVILLA」少了空格（受保護詞彙須為「CHARM VILLA」）；棉線接在茶標短邊，不是長邊中間。材質已是霧面金，正確。
- 目前網站：沖泡區新版型照常上線，但左圖用回 10-08 的 `scene-brewing-glass-cup-cloud-coaster-walnut.webp`（無茶標）。
- 未提交、保留在工作樹：`public/media/site/scene-brewing-hot-water-goldfish-tag-walnut.webp`、`docs/qa/2026-10-12-brew-photo-progress/`。
- 修好並經使用者看過後，把 `src/data/tea-gifts.ts` 的 `brewImage` 換回下面這段，再提交圖片與 QA 資料夾：

```ts
// User 2026-10-12: proposal 02's left photograph, with the site's photography style and a visible hot-water pouring gesture.
// Latest correction: the cup must contain the goldfish tea bag. Imagegen edit uses real wet tea-bag photographs for body, tail and string.
// Original October 8 asset is retained; see docs/qa/2026-10-12-brew-photo-progress for the prompt and validation.
const brewImage = (t: (zh: string, en: string) => string) => site("scene-brewing-hot-water-goldfish-tag-walnut.webp",
  t("午後暖光下，一隻手將深灰色水壺中的熱水倒入圓肚玻璃杯，金色茶湯裡是一尾透出玫瑰花瓣與茶葉的小金魚茶包；杯子放在胡桃木桌的雲朵木杯墊上，右側是棉線連接的霧金色茶標，後方是橄欖綠扶手椅",
    "A hand pours hot water from a dark grey kettle into a round glass cup of golden tea containing a goldfish-shaped tea bag with visible rose petals and tea leaves, on a cloud-shaped wooden coaster on a walnut table, a matte gold tea tag connected by cotton string to the right, an olive-green armchair behind in warm afternoon light"), 1024, 1536);
```

## Steps and proof

| # | Step | Proof of completion | Status |
| --- | --- | --- | --- |
| 1 | 沖泡 10 個版型提案、使用者選 01＋02 | 畫布 https://claude.ai/artifact/5x6ND8xqRo8fPNTpXTJyuY | `completed` |
| 2 | 合併左圖右文與點到點動畫 | `docs/qa/2026-10-12-brew-photo-progress/report.json`：橫線起點誤差 0px、最後一點後無軸線 | `completed` |
| 3 | 倒熱水照＋小金魚＋無孔茶標 | 1024×1536 WebP；QA README 與截圖 | `completed`（Codex 驗證） |
| 4 | 八張禮盒正面實拍新增為圖二 | `docs/qa/2026-10-12-gift-front-hd/mapping.json`、`report.json`、各頁截圖 | `completed`（Codex 驗證） |
| 5 | 茶款介紹小標改商品名 | `TeaKinds.tsx` 收 `productName` | `completed`（程式已改；Codex 回報已驗證，QA 資料夾未單獨截圖） |
| 6 | 本機 `npm run check`（Node 24） | Claude 17:15 重跑：exit 0，65 個靜態頁 | `completed` |
| 7 | 使用者確認後 commit＋push `main` | `ce4067b`（程式＋禮盒圖＋QA）＋ docs commit | `completed` |
| 8 | Production 驗證 | `vercel ls charmvilla-demo2 --scope tentenco` 最新 Production READY；中英文 1440／390 商品頁確認三件事、零水平溢位、圖片 200 | `pending` |
| 9 | 補 handoff 線上證據 | `CODEX_HANDOFF.md` 有 commit 與 deployment id | `completed` |
| 10 | 修倒熱水照片茶標，使用者看過再換上 | v2 已上（`91da6a3`），使用者「可以」；棉線約在長邊 2/3、茶標偏大，已告知 | `completed` |

可用狀態：`pending`、`in_progress`、`blocked`、`completed`。

## 使用者對沖泡方式的明確回饋（2026-10-12）

- 橫線從文字欄開始（不從最左邊）；軸線不要超過最後一個圓點；數字掛在左邊。
- 杯子裡要有小金魚茶包；倒水照加回茶標，棉線黏在茶標內部、不打洞，以使用者本輪的茶標實拍為準。

## Attempts and re-plan

- 同名 WebP 會被 Next dev 圖片快取卡住（回傳舊的透明外框）→ 改用不可變的 `cutout-v3` 新檔名。
- 本機 QA 等所有圖片 load 會 timeout → 改等 `domcontentloaded`，再等指定圖片與淡入完成。
- ego-browser 一般 screenshot 會把 1440×1000 依 DPR 縮成 720×500 並 timeout → 用明確 viewport＋`raw:true`，先驗證 `innerWidth`。
- 本機預設 Node 是 20.14.0、沒有 nvm → 用 `npx -y -p node@24 -c 'npm run check'`（實測 v24.19.0）。
- Vercel 本機連結曾指向舊 team → 已重新 link 到現行 `tentenco`（同一 projectId）。
- dry deploy 發現 `.vercelignore` 未排除 `.env` 與 `temp/` → 已追加；Git 觸發的部署本來就不含未追蹤檔，但 CLI 部署需要這條。

## Handoff

- Last verified state（Claude 17:20）：`main` = `origin/main` = `1426122`，上方檔案未提交；10 個 `.claude/worktrees/*` 全部乾淨；Codex 最後動作 16:52，17:06 使用者問「好了嗎？」未獲回覆，判斷已停止。
- Next safe action：等使用者說要修時，只改倒熱水照片的茶標（一次一張，先給使用者看），通過後還原 `brewImage` 並提交。
- 注意：不要讓 Codex 與 Claude 同時在這個工作樹改檔。
- Other pending work：關於頁 02 職人圖（已在 `83a5d55` 配 `about-02.webp`，若使用者另有要求再做）；Shopify 待真實商店資料；`member-pages-wip` 需獨立審查。

## 上線前待辦清單（2026-10-12 深夜，Claude 只讀程式盤點，未實測）

需要使用者／客戶決定或提供：
1. 網域切換時程與操作人（`siteUrl` 已改為 https://www.charmvilla.com；網域本身尚未從 charmvilla-com-temp-site 移過來，需使用者當下同意）。
2. 美國站預設語言（目前無前綴 `/` 是中文、x-default 指向中文）。
3. 美金價格：雲朵杯墊、銀杏茶匙、木筷（目前台幣）、柴燒鳥形筷架（無價）。
4. 團圓粉紅色、藍色的照片與規格（沒有下架，待客戶補資料）；團圓本身缺尺寸、重量。
5. 公司正式名稱與地址（政策頁、頁尾）。
6. 最新消息中連到隱藏商品／系列的文章要下架或改寫（`news.ts`）。

已修（`bdc8c03`）：購物車台灣運費文字、網站介紹提皮件金飾、FAQ 門市頁、購物車「聯絡門市」、品牌金魚圖示、會員表單 +1／美國。客戶原文不改、改列客戶確認：服務條款 FDA、隱私權政策描述 Shopify、退換貨頁更新日期。

等 Shopify：每個茶款選項各自一個 variant、杯墊等四項的 mapping、新增地址資料格式、member-pages-wip 審查、電子報與 CCPA。

## 預購待辦（2026-10-13）

- 使用者：「之後會有聖誕節禮盒預購」，所以最新消息頁首「新品發表、禮盒預購與期間限定活動…」保留不刪。
- 聖誕禮盒預購上線時要準備：最新消息文章、商品頁「預購」標示與預計出貨時間、按鈕改「加入預購」、運送政策的預購規則（政策文字先給客戶確認）。
- 目前 demo2 只有紫斑蝶寫「限量供應，採預購製作」，沒有出貨時間；其他茶禮盒是否預購等客戶回覆確認表 B7／交接清單 Q11。
- 聖誕禮盒（使用者 2026-10-13 提供 4 張實拍：橘色盒＋紅色小金魚＋拐杖糖、藍綠色盒＋綠色小金魚＋聖誕襪，各有盒蓋正面與 12 包開箱）：上架方式定為「一個商品、兩個顏色選項」（同蝴蝶蘭／春曉的盒蓋選項做法，選色切換照片）。待客戶提供：中英文名稱、美金售價、12 包茶款、盒子材質、尺寸、重量、保存期限、預購期間與出貨時間。
