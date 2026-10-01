# 2026-10-01 官網雙語（中文／English）QA

使用者 2026-10-01：「在網路上找出適合中英文官網文案的 skill 並套用。然後我要做雙語，幫我在介面上新增語系切換」。
本資料夾是上線前在本機 `next start`（Node 24，port 3120）對最終 build 做的檢查。**尚未部署、尚未 push。**

## 做了什麼
- **路由**：所有頁面改由 `src/app/[lang]/…` 產生（`zh`、`en` 兩個靜態參數，共 39 條路由 × 2 語言，全部 SSG）。
  中文維持原網址（`/collections/tea`），英文在 `/en`（`/en/collections/tea`），slug 共用。
  `src/proxy.ts`（Next 16 的 proxy，取代 middleware）把無前綴網址改寫到內部的 `/zh`，並把 `/zh/...` 308 轉回無前綴網址；
  不依瀏覽器語言自動跳轉。`next.config.ts` 的舊商品轉址補了 `/en` 版本。
- **語系切換**：頁首右側工具列最前面的文字連結（中文頁顯示「EN」、英文頁顯示「中文」，字級與 Menu 相同、無框無底色）。
  768px 以下頁首放不下，改放在全螢幕選單清單的最後一列（「English」／「中文」）。點了會到「同一頁」的另一個語言。
- **文案**：中文是來源，英文緊貼在旁以 `t("中文", "English")` 寫在同一處——資料層 `getContent(lang)`、`getCatalog(lang)`、
  `getCraftMoments(lang)`；元件內的介面字串用 `translator(lang)`（server）或 `useT()`（client）。
  規範與決策在 `/.translation/`（brief、style guide、glossary、decisions、reviews）。
- **SEO**：每頁 `<html lang>`（zh-Hant／en）、canonical、hreflang（zh-Hant／en／x-default）；`sitemap.xml` 兩種語言各一筆並附 alternates；
  商品頁 JSON-LD 的名稱、敘述、分類與網址隨語言。
- **API 錯誤訊息**：伺服器仍回中文；英文頁依錯誤代碼顯示自己的英文訊息（`src/i18n/errors.ts`），Shopify 自己的訊息原樣顯示。

## 檢查與結果
| 檢查 | 腳本 → 報告 | 結果 |
|---|---|---|
| 中英字串配對（515 組）：保護詞、`${}`、數字一致；英文無中文、無禁用詞、無驚嘆號、無破折號；無「子村莊園」 | `pair-check.mjs` → `pair-report.json` | 0 個問題；5 個已審核例外、3 個刻意留空的中文副標列在報告裡 |
| HTTP：39 路由 × 2 語言＝78 頁的狀態碼、`<html lang>`、title、canonical、hreflang；英文頁殘留中文；`/zh/*` 與舊商品網址轉址；未知網址 404 | `http-check.mjs` → `http-report.json` | 78 頁全部通過；7 個轉址、6 個 404 正確 |
| 中文頁與正式站逐頁比對可見文字（扣掉新加的切換連結） | 同上（`parity`） | 39／39 頁完全相同 |
| 瀏覽器（本機 Chrome，1440×900）：12 個樣本頁 × 2 語言，整頁捲過後檢查 DOM 殘留中文、水平溢出、console 錯誤；切換來回；兩種語言的 404 | `browser-check.mjs` → `browser-report.json` | 24 頁 0 個問題；切換皆回到原頁；`/nope`、`/en/nope`、`/products/nope`、`/en/products/nope` 皆 404 且為該語言 |
| 手機 390px：三個頁面水平溢出、選單內的切換 | 同上 | 通過 |
| `npm run check`（lint＋typecheck＋build） | — | 0 errors；5 個原本就有的警告（4 個 `<img>`、1 個 `scripts/tmp`） |
| `node scripts/verify-tea-gifts.mjs`（已更新：資料檔搬到 `data/`＋`i18n/` 結構、加上英文目錄檢查） | — | PASS |

英文頁上仍會出現的中文只有兩處，都是刻意的：切換連結的文字「中文」與它的無障礙標籤「切換為中文」。
圖片本身含中文字的（例如 SHOW MORE! 邀請卡 CV-0427）沒有另做英文版圖片，alt 文字是英文。

## 截圖
`zh-home-header-desktop.jpg`、`en-home-header-desktop.jpg`（頁首與切換）；`zh-mobile-menu.jpg`、`en-mobile-menu.jpg`、`en-mobile-top.jpg`（手機）；
`en-home-*.jpg`（hero、品牌故事、以手成形、精選、Partners、門市、News）；`en-collection-tea.jpg`；`en-product-tea-gift*.jpg`、
`en-mobile-product-top.jpg`；`en-account.jpg`；`en-bag-drawer.jpg`；`en-404.jpg`；`zh-product-tea-gift.jpg`（中文對照）。

## 已知限制／無法宣稱
- 英文未經母語人士或品牌審稿；`/.translation/draft-terminology.csv` 的詞（創辦人英文名、系列名、獲獎茶名、京都地址、職人稱謂等）待品牌確認。
- 404 頁的內容由瀏覽器端渲染（伺服器回 404 狀態與空殼）：因為根 layout 在 `[lang]` 之下，Next 在伺服器端沒有可用的根層 not-found。
  有 JS 時畫面與語言正確；無 JS 時是空白頁。要伺服器端輸出就得改成一張兩種語言共用的靜態 404。
- 會員頁登入後的畫面（個人資料、地址、訂單）與 Shopify 模式的購物車錯誤訊息只做了字串與型別檢查，Shopify 尚未串接，無法實際操作驗證。
- 未檢查 768–1279px 平板寬度的英文排版；未做螢幕閱讀器實測。
- 語系切換只帶路徑，不帶搜尋字串（`?q=`）與 hash。

## 重跑
```sh
npx --yes --package=node@24 -c 'npm run check && node scripts/verify-tea-gifts.mjs && node docs/qa/2026-10-01-bilingual/pair-check.mjs'
npx --yes --package=node@24 -c 'node node_modules/next/dist/bin/next start -p 3120' &
npx --yes --package=node@24 -c 'node docs/qa/2026-10-01-bilingual/http-check.mjs http://localhost:3120 https://charmvilla-gallery-site.vercel.app'
npx --yes --package=node@24 -c 'node docs/qa/2026-10-01-bilingual/browser-check.mjs http://localhost:3120'
```
部署後把 `http://localhost:3120` 換成正式網址再跑一次（`parity` 那一欄部署後就是自己比自己，可略）。
