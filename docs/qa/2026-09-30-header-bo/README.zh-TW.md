# 頁首改為 Bang & Olufsen 式配置（2026-09-30）

## 成品／交付檔
- Header：左「Menu」（兩條線＋文字，開啟時變 ✕ Close）、中央官方字標、右側門市圖示（跳到門市區）與購物袋圖示（官方線上商店）。桌面與手機同一結構；手機省略「Menu」文字只留線條。
- 選單：所有導覽集中在既有全螢幕階梯選單，加入 All Objects；選單開啟時右側圖示淡出（避免壓在白色面板上）。
- Preloader 頂端字標改為置中，與頁首位置一致。
- 截圖：`local/header-{desktop,mobile}.png`、`local/menu-open-{desktop,mobile}.png`、`local/home-{desktop,mobile}.png`。

## 製作方式與設定
- `.site-header-inner` 改為 `grid-template-columns: 1fr auto 1fr`；`.header-menu-btn`、`.header-menu-lines`、`.header-brand`（150px／手機 118px）、`.header-tools`（間距 22px／手機 16px）。
- 參考 Bang & Olufsen 的三個圖示為帳號、地點、購物袋；本站沒有會員功能，所以只做地點與購物袋，不放無目的地的帳號按鈕。

## 已檢視／驗證
- `check.log`：lint 0 錯誤、typecheck、build 通過；本機 Playwright 無 pageerror。
- 已目視桌面／手機頁首與開啟的選單（All Objects → Visit 六個階梯面板）。

## 限制與不宣稱
- 品牌沒有提供創立年份，字標下方不加「Est.」字樣。
