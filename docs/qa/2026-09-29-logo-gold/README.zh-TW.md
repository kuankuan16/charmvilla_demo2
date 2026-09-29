# 網站金色與 logo 統一

網站所有自有金色介面元素統一為 #E4A038（RGB 228, 160, 56）。取樣來源為目前核准的 `public/brand/charmvilla-logo.png`；16,032 個 alpha ≥ 250 像素皆為相同色值，SHA-256 詳見 verification.json。

修改 globals.css 的 gold token，gold-light 改為同一色值的別名；icon.svg 的金色圓點同步更新。涵蓋開場背景、Shown at 金色飾條、CRAFT 文字及瀏覽器圖示。商品影像、官方得獎標誌及 logo 原檔保留。

已通過 npm run check（ESLint、TypeScript、production build），僅保留 Header / Preloader 兩項既有 native img 提示。線上 DOM 的背景色與文字色皆確認為 rgb(228, 160, 56)，並目視檢查開場 logo 與金色背景、CRAFT 文字。首頁、圖示、logo 皆 HTTP 200；logo SHA-256 與原檔一致；浏览器無 console error。

正式站：https://charmvilla-gallery-site.vercel.app
部署 ID：dpl_FAJrYfsy4ZF1YNw74dQYfE7ezbPg
回復版本：dpl_GRMDVc2g4LrTExaFfkh7EtMFreow

本次為介面色彩調整，未重新生成圖片、未改版面，未新增生成費用。重新建置與驗證可執行 `npm run check`。此網站未設定 Git remote，程式保存在本機 repository。
