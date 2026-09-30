# 版面調整工作副本

已完成：全站共用左右留白（桌面 clamp(24px, 4.86vw, 96px)，手機 20px）、兩組獎項間距 40px、開場左側金色金魚與右側反白官方 logo。保留金魚輪廓及官方字標，不重繪。

工作副本：`/Users/kuan/Documents/Codex/09-07-charmvilla/site-work/charmvilla-gallery-site`。
原始網站：`/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site`（本回合唯讀，未同步）。

驗證：lint 通過（4 個既有 img 警告）、TypeScript 通過。完整建置因 Google Fonts 無法連線而失敗；Vercel 發布回傳 fetch failed。尚未完成瀏覽器目視驗證，線上預覽仍為先前版本。

本次差異：`layout-alignment.patch`。恢復網站目錄寫入權限後，可於原始網站目錄先執行 `git apply --check <patch路徑>`，再套用；重新以 Node 24 執行 `npm run check`、瀏覽器桌面及手機驗證、Vercel 部署並驗證公開頁面。

頁首追加調整：使用獨立 `.site-header-inner`，左右 padding 明確共用內容的 `--page-gutter`；logo 與選單按鈕不被 flex 壓縮。TypeScript 通過，Header ESLint 僅既有 img 警告。此追加修改同樣尚未上線。
