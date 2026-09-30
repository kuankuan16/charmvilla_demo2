# 商品清單影像規則、框線按鈕、極簡去線、金魚游標（2026-09-30）

## 成品／交付檔
- Commit `914304d`；正式站部署 `charmvilla-gallery-site-14j8ppv7k-tentenco.vercel.app` → https://charmvilla-gallery-site.vercel.app（`deploy.log`）。
- 截圖：`local/`（建置後本機 `next start`）、`live/`（正式站），各含桌面 1440 與手機 390 的首頁精選、`/collections/tea`、`/collections/all`、`/collections/teaware`、兩個禮盒商品頁；`report.json` 為每張卡片的影像模式（cutout／scene、object-fit、底色、內距）與 CTA 樣式稽核。

## 製作方式與設定（使用者 2026-09-30 四項指示）
1. **茶包商品一律禮盒**：茶包分類只剩 16 款官方禮盒（資料來源官方 cid=20／48／252，見 `../2026-09-29-tea-gift-boxes/`）；情境照來自 AI 素材庫（CV-0348/0350/0356/0357）。
2. **清單影像規則**：`Img.cutout` 旗標 + `imageFit()`。去背商品圖（16 張官方禮盒 PNG 全部有透明通道 30–68%，另 CV-0227 木筷、CV-0229 銀杏茶匙）→ `object-fit: contain`、內距 9%、統一底色 `--color-ground: #f6f2e9`；非去背情境照 → `object-fit: cover` 滿版。套用於 `ProductCard`（所有分類清單）與首頁 `FeaturedProducts`。
3. **黃底按鈕改框線**：`.catalog-button`（商品洽詢／選購禮盒／尋找門市／顯示全部商品）改透明底 + 1px 墨色 30% 框線，hover 墨色實心；商品圖前後箭頭按鈕加框線；門市地圖按鈕 hover 由金色改墨色。金色只留在品牌字標、分類列的作用中指示與進度點。
4. **全站去除裝飾線**：頁首底線、分類列上下線、卡片與精選標題上線、造訪區上線、商品頁的簡介線（含兩端圓點）、細節連結線、圖片工具列線、規格區與規格列線、故事／到店／延伸閱讀區上線、前後商品分隔線、底部 dock 上線、頁尾線、Hero 與導覽的點線分隔、首頁 Shown／Visit／Partners／ShowMore／Teaware 等區塊的 Tailwind 線條。保留功能性線條：FAQ 手風琴列、選項框、縮圖作用中框、搜尋欄底線、框線按鈕。
5. **游標**：白色圓點（mix-blend difference）改為金色向量小金魚 `/brand/goldfish-gold.svg`（30×25px，單一 fixed 元素，只更新 transform，觸控裝置隱藏）。

## 已檢視／驗證
- `check.log`：lint 0 錯誤（4 個既有 `<img>` 警告）、typecheck、build 通過；`node scripts/verify-tea-gifts.mjs` PASS。
- `live-routes.json`：sitemap 37 條路由全部 200（含 18 個禮盒相關頁）；5 條舊茶款網址 308 → `/collections/tea`；首頁標題「CHARM VILLA — 藝術即生活」；`goldfish-gold.svg`、字標 PNG、禮盒 PNG 200。
- Playwright（本機 Chrome）本機與正式站各 12 頁：0 個 console error；tea 16 卡 = 12 cutout + 4 scene；all 31 卡 = 14 cutout + 17 scene；teaware 6 卡 = 2 cutout + 4 scene；首頁精選 6 卡 = 1 cutout + 5 scene；所有 `.catalog-button` 底色透明、框線 1px rgba(31,31,31,.3)。
- 已目視：`local/desktop-collections-tea.png`（去背禮盒統一奶油底、情境滿版）、`local/desktop-products-kyoto-gift-box.png`（框線按鈕、無裝飾線）、`local/desktop-home.png`、`local/mobile-home.png`。
- 速度（`live-image-weights.json`）：清單上的禮盒圖經 next/image 以 AVIF 輸出，每張 13–24 KB（原始 PNG 264–707 KB 只在放大檢視時才載入）；游標 SVG 3.6 KB；tea 頁 HTML 約 115 KB（未壓縮量測）。CSS 變更與游標對效能無可量測影響。

## 限制與不宣稱
- 「去背」由影像透明通道判定並以資料旗標標記，未逐像素檢查每張情境照是否含白底攝影；若未來新增去背素材，需在資料層標 `cutout: true`。
- `scripts/verify-catalog.py` 的 26 路由／20 商品連結假設已過期，未更新。
- 未更動商品頁主圖區（仍為 contain 於白底）。

## 重建指令
```sh
npx --yes --package=node@24 -c 'npm run check'
npx --yes --package=node@24 -c 'node scripts/verify-tea-gifts.mjs'
npx --yes --package=node@24 --package=vercel@latest -c 'vercel deploy --prod --yes --scope tentenco'
```
