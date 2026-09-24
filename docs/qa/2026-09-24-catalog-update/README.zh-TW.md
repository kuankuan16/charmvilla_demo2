# 商品清單與大圖更新

- 金飾改為商品清單，保留四款並加入兩張使用者指定的素描耳飾圖；桌面三欄、手機單欄，共六款。
- 小金魚茶包改為正常商品清單，共五款，移除横向堆疊捲動。
- 皮革包區下方加入五張舞者大圖，保留完整構圖，無文字覆蓋。
- 茶包區加入官方 iF 與 Red Dot 獎項 SVG；iF 在左、Red Dot 在右。同步統一 Shown at 的圖示順序。
- 移除獨立 SHOW MORE! 單元，三場發表活動及原邀請卡整併到最新消息；原皮革包 CTA 連往新聞項目。

## 素材
`assets.json` 紀錄舞者圖來源、SHA-256 與輸出尺寸；`jewelry-assets.json` 紀錄兩張耳飾 PNG 來源及網站 WebP 校驗碼。全部取用乾淨原圖，WebP quality 94 / effort 6，不裁切、不放大、不覆蓋原始檔。

## 驗證
桌面 1440 × 900、手機 390 × 844 已以 Chrome 目視檢查；DOM 數量、欄數、圖片載入與水平溢出紀錄於 `verification.json`。執行 `npm run check`（ESLint、TypeScript、Next production build）；既有 Header / Preloader 的 native img 提示保留，未引入新錯誤。

## 發布與回復
正式站 https://charmvilla-gallery-site.vercel.app 。發布紀錄與上線 HTTP 驗證見 `release.json`。本次之前的 Ready deployment 為 dpl_8GVHypASFdXjsqJZiHddsN81Pkvs，網址記於 verification.json，可供回復。

## 限制
未測試結帳、未變更購物流程。本專案未設定 Git remote；變更保存在此本機 repository。原 ShowMore 元件保留作歷史程式參考，但首頁不再渲染它。
