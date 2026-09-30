# 筆刷延伸、Outfit 與文案縮放

## 成品／交付檔
全站英文改用 Google Fonts Outfit；品牌故事區英文標題、中文主文及得獎說明縮至原尺寸 70%。首屏、品牌故事與影像區的筆刷不再被各自區塊邊界裁斷。修改前檔案保留於 before/。

## 製作方式與設定
Outfit 由 next/font/google 在根 layout 載入可變字重，自行託管；全站英文及中英混排中的拉丁字母使用 Outfit，中文仍使用原 Noto Sans TC。官方字標仍是原圖片。
首屏及品牌故事共同放在 opening-sequence，僅裁切橫向超出螢幕的範圍；縱向筆刷自然延伸。相片另設裁切容器；文字層位於筆刷上方。影像輪播同樣把照片裁切窗口與筆刷分開，保留 sticky。
文字欄寬仍為 60.2vw，手機為 86vw。桌面 1440px：Our Craft 54.72→38.304px、正文 38.16→26.712px、得獎說明 15.12→10.584px。手機：30→21px、23→16.1px、13→9.1px。

## 參考與來源
使用者字型來源：https://fonts.google.com/specimen/Outfit?preview.script=Latn
筆刷及影像原檔均沿用，來源與 SHA-256 見 ../2026-09-29-brand-story/assets.json，未編輯素材。

## 已檢視／驗證
本機桌面已目視確認筆刷跨越首屏底部並自然收筆；Outfit 500 已載入，計算字級為原來 70%。lint、typecheck、build 通過（3 個既有原生 img warnings）。部署與線上驗證見 verification.json。

## 限制與不宣稱
畫面左右仍按瀏覽器可視寬度收邊；區塊之間不再裁斷筆刷。縮字限使用者截圖的品牌故事區，全站其餘區域字級維持原設定。

## 重建指令
`npx --yes --package=node@24 -c 'npm run check'`
`npx --yes --package=node@24 --package=vercel -c 'vercel deploy --prod --yes'`
