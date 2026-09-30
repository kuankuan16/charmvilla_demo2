# 頂部選單修正（2026-09-29）

## 成品／交付檔

預覽：https://charmvilla-gallery-site.vercel.app/ 。修改 `src/components/chrome/Header.tsx` 與 `src/app/globals.css`；原 Header 保存於 `before/`。

## 製作方式與設定

頂部導覽改為參考網站的右側純文字排列，使用原有 Jost 500、自然大小寫、較寬間距；移除四個分類黑點及 Get in Touch 前方箭頭，聯絡項目前保留垂直點線分隔。手機選單「全部商品」也移除箭頭。依使用者後續指定，刪除 Hero 上緣水平細線（桌機與手機）。

## 參考與來源

參考：https://recruit.positive.co.jp/ 與使用者提供的選單、水平線截圖。未新增影像或字型資產；沿用前版商品照及官方 logo。

## 已檢視／驗證

- `npm run check` 通過（3 個既有原生 img 提醒，0 errors）；Vercel 重新建置包含最後移除水平線的 CSS。
- Chrome 1440×900 檢查選單排列：分類黑點為 0、無箭頭、`#hero::after` content 為 `none`。
- 導覽連結目的地保持原樣。
- 發布資料見 `verification.json`、`deploy.log`。

## 限制與不宣稱

本次只調整首頁頂部導覽樣式與上緣水平線；未重做展開式選單動畫，未新增 Git commit。

## 重建指令

```sh
npx --yes --package=node@24 -c 'npm run check'
```
