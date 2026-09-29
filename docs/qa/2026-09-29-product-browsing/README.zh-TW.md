# 商品瀏覽全流程（2026-09-29）

## 成品與交付

- 正式商品總覽：https://charmvilla-gallery-site.vercel.app/collections/all
- 四分類：真皮包 3、金飾 6、小金魚茶包 5、茶器與工藝 6。
- 20 個可直接連結的商品介紹頁，首頁所有商品卡片／品項已接上相對應頁面。
- Vercel Production `dpl_42gg2e7a2TraKaeAuMfk7RgAfHDf`，狀態 READY。
- 回復用前版：`dpl_FAJrYfsy4ZF1YNw74dQYfE7ezbPg`。
- 可編輯專案：`/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site`。

## 製作方式

參考 AFURI 商品頁的大幅視覺、細線分段、細節表、展開式資訊、固定操作列與相關商品；保留 CHARM VILLA 的白底、核准圖片、字型及 logo 金色 `#E4A038`。

商品資料集中於 `src/data/catalog.ts`。分類頁支援搜尋、空結果復原及網址保留關鍵字。每件商品提供圖片放大、可用的多角度縮圖、商品細節、相關商品、上一款／下一款與返回分類；皮包顏色、茶包風味可切換到各款獨立頁面。選購入口連至門市資訊及既有 Instagram 洽詢。

商品頁使用原生文件捲動；首頁保留既有 Lenis 捲動。補上跨頁 `/#visit` 的定位，及首頁錨點對 Next.js History 狀態的保留。搜尋使用原生 History API 與 `useSearchParams` 同步，瀏覽器返回後保留搜尋條件。

## 參考與來源

- 參考：https://afuribrewing.com/collections/all 、https://afuribrewing.com/products/yuzu-mexican-lager 、https://afuribrewing.com/products/original-glass-black 。研究紀錄在 `docs/research/afuri/README.zh-TW.md`。
- 商品內容：既有 `src/data/content.ts`、`docs/research/ASSETS.gallery.json`。沒有新增或重製商品圖片。
- 51 張本機與正式網站圖片的 URL 路徑、SHA-256、HTTP 狀態列於 `local-http.json` 與 `production-http.json`，逐張雜湊一致。

## 已驗證

- ESLint、TypeScript、正式建置通過；僅保留 Header／Preloader 原有的兩則原生 img 提醒。
- 26 個公開內容頁均回傳 200；首頁有 20 個不同商品目的地；商品及分類內連結、錨點、canonical、Product 結構資料、sitemap 皆通過。
- 三種無效路徑回傳 404，且只有一組頁首／頁尾，可返回總覽。
- Chrome 實際操作 1440 × 1000、768 × 1024、390 × 844；檢查搜尋、清除、重新整理、瀏覽器返回、商品切換、相簿、燈箱、Escape／方向鍵、焦點回復、FAQ、門市定位、相關商品及固定操作列。
- 正式站搜尋與商品圖片放大已重測；檢查中的頁面無水平溢出。
- Git main 本地保存。此專案未設定 remote，沒有宣稱 Git 遠端已同步。

## 限制

這次完成商品瀏覽與門市／商品洽詢，不包含購物車、付款或庫存系統。未杜撰售價、成色、尺寸、寶石等級、茶葉沖泡參數或配送條款。行動版以 Chrome viewport 測試，未宣稱在實體 iOS／Android 裝置完成測試。

## 重建與驗證

使用 Node 24：

```sh
npm run check
npm run start -- --port 3125
python3 scripts/verify-catalog.py http://localhost:3125 docs/qa/2026-09-29-product-browsing/local-http.json
python3 scripts/verify-catalog.py https://charmvilla-gallery-site.vercel.app docs/qa/2026-09-29-product-browsing/production-http.json
```

HTTP 檢查程式只讀取網站，不會變更產品、發送洽詢或建立訂單。
