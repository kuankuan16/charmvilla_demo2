# 原始筆刷、黑體與極簡介面修正版

## 成品／交付檔

- 預覽：https://charmvilla-gallery-site.vercel.app/
- 沿用同一網站專案及三張已選照片，男舞者維持腰部以上裁切。
- 原始筆刷：`public/media/hero/brushes/`，6 種 × 桌機／手機，共 12 個 WebP。
- 前版 Hero 與 CSS 備份：`before/`；部署記錄：`deploy.log`。

## 製作方式與設定

依使用者要求，移除 v1 程式繪製筆刷，改用範例網站的原始 WebP 透明紋理。以 CSS alpha mask 保留輪廓、飛白、透明細節與原生比例，填入 logo 的金色 `#E4A038`（官方 PNG 不透明像素實測 RGB 228,160,56）。採用範例的三組筆刷配置與相對座標；移除上一版額外持續旋轉筆刷的效果。不同深度仍保留淡化層次。

英文字恢復原網站的 Jost 500 黑體、全大寫兩行「EVERYDAY／LUXURIES」，移除 Cormorant Garamond 載入。右上文字改為「把日常的物件／當作展品」，去除全部標點，桌機字級由 2.65vw 縮至 1.8vw，390px 手機版為 16px。

底部只保留「1 / 3」、垂直點線及「Scroll ↓」。移除上一張／下一張／播放／暫停按鈕、底部品牌城市及右下商品說明連結。照片本身仍連到商品頁。自動輪播保留；游標停留照片或鍵盤焦點在 Hero 時暫停，系統減少動態偏好仍受尊重。

## 參考與來源（URL + SHA-256）

- 參考：https://recruit.positive.co.jp/
- 原始素材來源前綴：https://recruit.positive.co.jp/mg/wp-content/themes/recruit-theme2026/assets/img/top/1_kv/
- 12 個完整來源 URL、SHA-256、檔案大小皆列於 `assets.json`。檔案原封不動保存，金色由 CSS 上色。
- Logo 和三張商品照來源延用上層 `assets.json`。

## 已檢視／驗證

- `npm run check` 通過：lint 無錯誤、TypeScript 通過、正式建置通過；維持 3 個原生 img 提醒。
- Chrome 桌機與 390×844 手機目視檢查：原始筆刷紋理可見；標題恢復黑體；中文無標點且縮小；底部無多餘按鈕。
- DOM：Hero 按鈕數 0，手機選用 `_sp.webp`，brush background 為 `rgb(228,160,56)`，主文件無水平溢出。
- Scroll 實際操作抵達下一段，Manifesto 頂端為 50px。
- 公開首頁 HTTP 200；12 個線上筆刷檔案均與原始下載 SHA-256 一致。
- 部署 ID 與完整檢查在 `verification.json`。

## 限制與不宣稱

筆刷使用同一批原始形狀及透明紋理；頁面仍保留品牌白底、自有產品照與既有 CSS／GSAP 輪播，不宣稱整個畫面每個像素或原網站 Three.js 合成完全相同。手機以 viewport 模擬，未宣稱實體裝置全機型驗證。沒有重新生成商品圖、修改 Gallery／Figma，亦未新增 Git commit。

## 重建指令

```sh
npx --yes --package=node@24 -c 'npm run check'
npx --yes --package=node@24 -c 'npm run dev -- --port 3131'
```
