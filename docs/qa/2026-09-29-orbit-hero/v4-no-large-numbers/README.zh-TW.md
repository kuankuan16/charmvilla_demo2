# 移除首頁大型數字（2026-09-29）

## 成品／交付檔

預覽：https://charmvilla-gallery-site.vercel.app/ 。可編輯網站位於 `/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site`；修改前元件保存於 `before/`。

## 製作方式與設定

移除各區塊的巨型 SectionIndex 編號與其共用元件，並收整分類標籤上方間距。Manifesto 的標籤以 grid column start 對齊右欄，不再保留空編號容器。開場動畫移除大型 2026，仍保留官方 logo、原有雙色開幕動畫與揭幕時序。Hero 小型輪播頁碼、商品小編號與活動日期保持原狀。

## 參考與來源

依使用者本次「拿掉首頁的大數字」指示修改既有元件；未新增素材或字型。圖片、logo SHA-256 延用上層 `assets.json`。

## 已檢視／驗證

- lint、TypeScript、正式建置通過，仍有 3 個原生 img 提醒。
- 瀏覽器確認首頁沒有字級 80px 以上的純數字節點，也沒有 `data-year`。
- 開場正常結束為 `is-loaded`；Scroll 仍可到內容段落。
- 已目視檢查內容版面。發布記錄見 `deploy.log`、`verification.json`。

## 限制與不宣稱

未新增 Git commit；此為移除裝飾性大型數字，不是刪除商品編號、活動日期或輪播頁碼。

## 重建指令

```sh
npx --yes --package=node@24 -c 'npm run check'
```
