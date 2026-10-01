# 首頁「以手成形」改雜誌式版面＋商品頁情境照版型（2026-10-01 傍晚）

使用者 2026-10-01 17:49（附現行輪播截圖與 Jakobsen 首頁截圖，`reference/user-*.jpg`）：
「這一屏我要改成 https://jakobsencopenhagen.com/en/ 的這樣的 layout 與效果，像雜誌的排版，有左邊兩張小圖。商品內頁如果有多圖的情況也是用相同的邏輯處理」。
18:13 再說：「先幫我處理首頁跟商品頁的版型」。之後同一輪又給了三項：
- 「情境照３張的版型 https://jakobsencopenhagen.com/en/products/joana-longchair-xl-2-seater」
- 白色包商品頁兩張墨綠底情境照的截圖：「刪」
- 首頁精選的截圖：「首頁清單 hover 時也要換情境照」

## 參考頁量測（`reference/ref-home.mjs`，1440×900，本機 Chrome）

截圖裡是參考首頁連續的兩個區塊：

| 區塊 | 結構 | 數字 |
|---|---|---|
| `gallery` | 兩欄（各 6／12 欄）。左：兩張小圖並排、`position: sticky; top: 64px`；右：一張大圖 | 頁邊 30、欄距 20；小圖各 2 欄 213×284（3:4），在 x=30、263；大圖 7–12 欄 673×897；上下內距 60 |
| `text-media` | 左：文字（標題在最左、內文內縮 2 欄寬 3 欄、底線連結）；右：大圖 `sticky; top: 80px` | 標題 x=30 寬 213；內文 x=263 寬 330，標題與內文相距 60；文字上內距 60；大圖 673×897；兩張大圖上下相距 120 |

效果：每個區塊進入視窗時 0.7 秒淡入；小圖固定在頁首下，右側大圖捲過；文字區的大圖固定，文字捲過。沒有輪播、沒有視差。

## 首頁的作法

`src/components/sections/CraftMoments.tsx`（改為 server component，不再有狀態與捲動監聽）、`src/data/craft-moments.ts`（`ctas[]` → `cta`）、`globals.css` 的 `.craft-*` 整段重寫。

- 第一列：左邊兩張小圖（製革、金工，各 2 欄、4:5，固定在頁首下），右邊大圖（茶，7–12 欄）。
- 第二列：左邊標題「從一雙手，到一日的風景。」，往內 2 欄是四位職人的文字（工藝・商品小標、兩行引言、底線連結），右邊大圖（木作，7–12 欄，固定到文字捲完）。
- 欄位用官網自己的頁邊（`--page-gutter`）與 12 欄；照片維持官網的 4:5（參考站是 3:4）；字用官網字型。
- 大圖位置給解析度最高的兩張（茶 1200 px、木作 896 px）；文字順序維持茶 → 皮革 → 金工 → 木作。
- 拿掉的：輪播、傾斜卡片、進度點、鍵盤切換、釘住整屏的捲動距離（`.craft-pin`／`.craft-track`）。框線按鈕改成底線文字連結（參考站的作法）。
- 文案沒有改，中英文都沿用原本的字串。
- 768px 以下：兩張小圖並排 → 大圖 → 第二張大圖 → 標題與文字，全部不固定。
- `.partners-statement` 的字級規則原本與 `.craft-quote` 寫在一起，已拆開保留，合作夥伴那段文字大小不變（與本區標題同級）。

## 商品頁的作法

`src/app/[lang]/(catalog)/products/[slug]/page.tsx`、`globals.css` 的 `.product-spread*`。

資訊欄放不下、留到頁面下方的情境照，如果剛好是三張直式（或三的倍數），就排成同一種跨頁：第一張放大在右（7–12 欄），另外兩張小圖在左（1–2、3–4 欄），小圖固定在頁首下直到大圖捲完。目前符合的是 **鑽石垂墜耳環**（4 張：1 張在資訊欄＋跨頁）。白色包原本 5 張也符合，刪掉兩張後是 3 張，改走下面的三張版型。

不變的：只有 1–2 張情境照的頁面（都在資訊欄）；橫式照片與聖誕版的長條圖維持原本的列。手機上三張照片各佔一整列，大的在前。

### 情境照剛好 3 張：照 Joana Longchair 頁

參考頁量測（`reference/joana-capture.mjs`、`reference/joana/`，1440）：資訊欄下一張（9–12 欄，447×596）；往下左邊大圖 1–6 欄（673×897）；右邊從第 9 欄起，離大圖頂端 153px 是一段文字（標題、灰色說明、底線連結），文字下 70px 是小圖（2 欄，213×284，`sticky; top: 80px`）。Liam 頁是同一個版型。

原本（17:52 上線的 Liam 版）小圖與大圖齊頂、旁邊沒有文字，故事文字在資訊欄。現在改成：故事標題與內文移到大圖右側（第 9 欄起、3 欄寬、內文灰色），小圖在文字下方（2 欄寬），捲動時固定在頁首下直到大圖捲完；資訊欄的按鈕下面直接接第一張情境照。大圖是橫式（鳥形筷架）時不留頂端的 153px。適用 7 頁：白色包、珍珠長鏈、鑽石耳釘、杯墊茶匙、木筷、鳥形筷架、點心架。參考頁第 7 欄的小標（別的商品名）沒有照做——我們這裡是同一件商品的情境照，官網也不放圖說。

`docs/qa/2026-10-01-product-karla/pdp.mjs` 裡「小圖與大圖齊頂」「每張情境照寬度大於 200」兩項是舊版型的假設，現在會報不符；以本資料夾的 `spread.mjs` 為準。

### 白色包刪兩張情境照

`catalog.ts`：拿掉「人物回眸・墨綠底」（`scene-white-bag-over-shoulder-ink-green.webp`，原清單 hover 圖）與「懸空・墨綠底」（`scene-white-bag-floating-ink-green.webp`，圖庫 CV-0450）。兩個檔案與 `images.json` 的對應列一併移除（git 歷史可還原；圖庫沒有動）。白色包的清單 hover 圖因此變成「懸空・莫蘭迪灰綠」。

### 首頁精選 hover 換情境照

`FeaturedProducts.tsx`：六張精選卡加上與清單卡相同的 hover 層（`product.hoverImage`，沿用 `.catalog-card-hover` 的淡入）。

## 驗證

本機（`next start`，Node 24）：

- `npm run check`（lint＋typecheck＋build）通過；警告都是既有的。
- `craft.mjs`（中英 × 1440／1920／1100／390）：小圖在 1–2、3–4 欄，大圖在 7–12 欄；標題在最左、文字內縮 2 欄；捲動中小圖固定在頁首下（1440：top 92＝72＋20）；兩列淡入後不透明度為 1；沒有水平捲動。結果 `craft-local.json`、截圖 `local-*.jpg`。
- `spread.mjs`（32 件商品 × 中英 × 1440／1100／390，共 128 頁）：每張情境照都有畫出來且圖片載入、沒有水平捲動；兩個跨頁的小圖固定（1440：92／92）；問題 0。結果 `spread-local.json`。
- 三張版型（7 頁 × 1440／1100）：大圖在 1–6 欄，文字與小圖的左緣＝資訊欄左緣，文字在大圖頂端下 153px（1440），小圖在文字下 70px，捲動時小圖固定在頁首下（92／92）；資訊欄裡不再有故事文字。
- `featured-hover.mjs`：六張精選卡 hover 前不透明度 0、hover 後 1，情境照都有載入（白色包→莫蘭迪懸空、珍珠長鏈→CV-0377、銀杏茶匙禮盒→圓凳情境、團圓桐木盒→CV-0350、鳥形筷架→CV-0248、鑽石垂墜→CV-0372）。結果 `featured-hover-local.json`。
- 首頁進場回歸 `docs/qa/2026-10-01-reveal-fix/repro.mjs`（本機，改版後）：中英文十二個情境全部 0。

## 已知限制

- 第一版手機樣式少了 `align-items: stretch`，跨頁三張照片寬度變 0；已修（`spread.mjs` 就是為了抓這種情況寫的），390 寬的截圖是修正後重拍的。
- 製革（816 px）、金工與木作（896 px）的原檔不大；木作那張當大圖時，在 1920 寬的螢幕上是 823 CSS px，2× 螢幕會偏軟。要更清楚得有高解析原檔。
- 英文版的引言比中文長，3 欄寬會折成 2–3 行。
- 768–1023px 只做了版面規則，沒有逐一截圖。

## 重跑

```bash
npx --yes --package=node@24 -c 'node docs/qa/2026-10-01-craft-magazine/craft.mjs https://charmvilla-gallery-site.vercel.app live'
npx --yes --package=node@24 -c 'node docs/qa/2026-10-01-craft-magazine/spread.mjs https://charmvilla-gallery-site.vercel.app live'
npx --yes --package=node@24 -c 'node docs/qa/2026-10-01-craft-magazine/shot.mjs https://charmvilla-gallery-site.vercel.app live-pdp braided-leather-bag-white,diamond-goldfish-earrings 1440'
```
