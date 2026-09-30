# 上架 2026 聖誕特別版（2026-09-30）

## 成品／交付檔
- Commit `da735fb`；正式站部署 `charmvilla-gallery-site-qx6go7w7y-tentenco.vercel.app` → https://charmvilla-gallery-site.vercel.app（`deploy.log`）。
- 商品頁：`/products/christmas-edition-stocking`（聖誕襪款）、`/products/christmas-edition-candy-cane`（拐杖糖款），排在 `/collections/tea` 最前面。
- 圖片 15 張 `/media/site/xmas-*.webp`，來源與 SHA-256 見 `sources.json`。
- 截圖：`local/`（本機 `next start`）、`live/`（正式站），含首頁精選、tea／all 清單、兩個聖誕商品頁、京都版商品頁，桌面與手機；`report.json` 為卡片影像模式與 CTA 稽核。

## 製作方式與設定（使用者：「並上架聖誕節商品 studio.html?series=christmas-us-2026」）
- 來源系列「美國聖誕特別版」（gallery studio `christmas-us-2026`，10 張 IG 概念稿 31–40）對應兩款盒蓋設計原稿 PKG-41 拐杖糖、PKG-42 聖誕襪（燙金微凹壓印＋紅綠白刺繡＋金線 Logo，米金織布盒蓋，桐木盒）。
- **10 張 IG 稿都有英文標題與「CHARM VILLA CHRISTMAS EDITION」頁尾，不作商品圖**。商品情境改用素材專案 2026-09-16 依 18 張實拍桐木盒學習後生成、且無文字的三張：`christmas-red-real-geometry-2026-09-16/02-christmas-red-stocking-final.png`（2K，聖誕襪・紅桌布）、`christmas-product-scenes-2026-09-16/01-forest-green-stocking-v2.png`（聖誕襪・綠絲絨）、`02-berry-red-candy-cane-v3-perspective.png`（拐杖糖・莓紅）。盒蓋設計、正面、上方、材質特寫、平面原稿取自圖庫 `/packaging/assets/`（1344×576）。`christmas-two-giftboxes` 含標題，不用。
- 官方商店沒有聖誕分類（09-30 查 charmvilla.com.tw 分類：經典、珍稀、2026 中秋、豐盛系列、衍伸商品、其他等，無「聖誕」），入數、售價、供應日期未公布 → 商品不列販售單位、不帶 `giftBox`、不連官方商店；CTA 顯示「商品洽詢／欣賞與選購」，規格只列系列、盒蓋圖案、工藝、盒型與材質、配色、上市資訊。兩款以 variant group `christmas-edition-2026` 互相切換。
- 文案取自系列的中文 caption（「把聖誕留一點下來」）與包裝原稿描述，未新增未核實的說法。

## 已檢視／驗證
- `check.log`：lint 0 錯誤（4 個既有 `<img>` 警告）、typecheck、build 通過（43 頁）；`verify-tea-gifts.log`：PASS（茶包清單 18＝2 聖誕＋16 官方禮盒；聖誕款不得帶 officialUrl／giftBox；所有 views 檔案存在）。
- `live-routes.json`：sitemap 39 條路由全部 200；兩個聖誕商品頁 200；journal 與聖誕圖片 200；tea 清單聖誕款在最前；商品頁有「同系列盒型」切換、CTA 為商品洽詢、無「前往官方商店」。
- Playwright（本機 Chrome）本機與正式站各 12 頁：0 個 console error；tea 18 卡＝11 cutout＋7 scene；all 33 卡。
- 已目視 `local/desktop-products-christmas-edition-stocking.png`（情境主圖、七個視角縮圖、規格、綠絲絨故事圖）與 `local/desktop-collections-tea.png`。

## 限制與不宣稱
- 聖誕特別版為設計提案階段的商品呈現，不宣稱入數、價格、上市日期；官方公布後需補 `giftBox`／`officialUrl`／販售單位並更新 verify 腳本。
- 情境圖為參考引導生成，不宣稱與實際商品像素級一致；圖庫（charmvilla-gallery）未動、未上傳新資產（使用者：圖庫暫停）。
- `scripts/verify-catalog.py` 的 26 路由假設仍過期（現為 39）。

## 重建指令
```sh
npx --yes --package=node@24 -c 'npm run check'
npx --yes --package=node@24 -c 'node scripts/verify-tea-gifts.mjs'
npx --yes --package=node@24 --package=vercel@latest -c 'vercel deploy --prod --yes --scope tentenco'
```
