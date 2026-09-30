# 茶包禮盒上架調整

## 成品／交付檔

工作副本：`/Users/kuan/Documents/Codex/09-07-charmvilla/site-work/charmvilla-gallery-site`。
茶包分類路徑：`/collections/tea`。目前未部署，不能視為已更新的線上頁面。

`src/data/tea-gifts.ts` 是 16 款禮盒的單一資料來源；`catalog-snapshot.json` 為實際產出商品資料，`catalog-contact-sheet.png` 為圖片選擇與 4:5 容器檢視圖。

## 製作方式與設定

- 每一款官方禮盒對應一筆商品，販售單位為盒；入數、茶款、材質與尺寸屬於規格。
- 心有愛、春曉與暮雪的茶款為整盒擇一，內容數量不合併計算。
- 團圓紙盒與桐木盒各自上架，商品頁提供同系列盒型連結。
- 4 款使用既有 AI 情境圖，12 款使用官方商品圖；全部 16 款詳情頁都有官方照片。
- 主圖保留原始比例，以 contain 放入統一 4:5 清單容器；沒有重新生成或裁切商品。
- 更新首頁推薦、分類搜尋（含入數與茶款）、商品規格及官方購買連結。舊五款風味網址以 308 轉到禮盒清單。
- 不添加未核實售價、庫存或結帳功能；選購交由相對應的官方商店頁面。

## 參考與來源

官方經典清單：https://www.charmvilla.com.tw/product.php?lang=tw&tb=1&cid=20
官方珍稀清單：https://www.charmvilla.com.tw/product.php?lang=tw&tb=1&cid=48
官方中秋清單：https://www.charmvilla.com.tw/product.php?lang=tw&tb=1&cid=252
AI 素材庫：https://charmvilla-gallery.vercel.app/?tab=assets&collection=ai

2026-09-29 以瀏覽器核對現行清單為 10 款經典、4 款珍稀、2 款中秋純茶包。搜尋快取仍有小鮮月／大盈月含茶點版，但現行清單沒有這兩款，因此不新增舊款或失效選購連結。

16 張官方原始 PNG 的來源網址與 SHA-256 見 `official-images.json`；AI 圖的公開來源、群組、狀態與 SHA-256 見 `selected-scenes.json`。AI 圖為既有參考引導生成，非本回合新生成。

## 已檢視／驗證

- 四张 AI 圖 SHA-256 與素材庫已發布版本相符，未採用封存版本。
- 已逐款核對現行官方商品說明；所有固定配置與擇一配置的茶包總數都等於禮盒入數。
- 16 個獨立網址、所有官方圖存在、首頁精選連結能解析；舊風味商品已從目錄移除。
- 已目視 16 款選圖總覽，盒款對應；大盈月商品頁明示純茶包，不含情境中的茶點與茶具。
- TypeScript 通過；ESLint 無錯誤，保留 4 個既有 img 警告。

## 限制與不宣稱

修改僅存在工作副本。正式原始碼目錄目前唯讀，未同步；Google Fonts／Vercel 連線及本機監聽受環境限制，未完成完整建置、互動瀏覽器驗證或部署。本回合圖片總覽不能當成完整網站互動驗證。

不宣稱 AI 圖與真實商品像素級一致。選購時的盒色、價格、供應與配送由官方商品頁決定。紫斑蝶官方說明含過期的預估供應日期，本次不引用該日期、不宣稱現貨。

## 重建指令

在工作副本使用 Node 24 執行：

```sh
npm run typecheck
npm run lint
node scripts/verify-tea-gifts.mjs
npm run build
```

前三項可在目前環境執行；最後一項仍需 Google Fonts 連線。恢復網站目錄寫入與部署連線後，套用累積 patch 並同步新增 `public/media/gift-boxes/` 原圖，再完成建置、桌面／手機驗證及預覽部署。
