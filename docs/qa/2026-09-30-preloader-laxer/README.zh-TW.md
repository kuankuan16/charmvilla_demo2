# Preloader 與首頁大標進場：高度模仿 davidlaxer.com/about（2026-09-30）

## 成品／交付檔
- Commit `823f219`（preloader＋大標）與 `bff9d20`（規格列細線）；正式站部署 `charmvilla-gallery-site-kambl3bm3`（preloader）→ `charmvilla-gallery-site-c6ulzi68i`（規格列）→ https://charmvilla-gallery-site.vercel.app。
- 影片式驗證：`local/filmstrip-desktop.png`、`local/filmstrip-mobile.png`（本機）與 `live/filmstrip-*.png`（正式站），每 220 ms 一格，附 `timeline-*.json`（每格的 html class、clip-path、第一個字元的 transform）；`live/specs-desktop.png` 為規格列。

## 參考站分析（來源：`https://davidlaxer.com/assets/js/main.bf1a86935810d5a24392.js` 與 about 頁內嵌 CSS）
- 載入中：`html.is-loading` → `body{background:#6f7275}`、`*{transition:none!important}`、`.page-holder{opacity:0}`。
- Preloader `[data-component=preloader]`：fixed、`md:grid-cols-2`、overflow-hidden；左半白（頂端 header logo、左下 Services 小清單）、右半 gray-200；`[data-year]` 的 `.ch`（©2026）初始 `translateY(150%)`、inline-block、vertical-align top；字級 laptop 21rem／md 15.4rem、line-height .75、letter-spacing -.05em、padding 25／30px；手機不顯示。
- 時間軸（桌面）：`fromTo(yearChars, {yPercent:150}, {yPercent:-150, duration:1.5, ease:"power4.out", stagger:.05})` → 完成時同時 (a) `hidePreloader()`：`clip-path` 由全幅 → `polygon(0 0,0 0,0 100%,0 100%)`（往左緣收掉），`power3.inOut` 1.1 s；(b) 初始化 `data-animation` 元件並 `onLoaded()` 移除 `is-loading`。手機：`opacity 1, duration 0` 後直接收掉。首頁另有雙面板滑開版本（左 -200%、右 -100%、標題逐字 1.35 s），本次依使用者指定採 about 頁版本。
- 「Hello / Laxer」：`<span data-animation="split" data-ease="expo.out" data-split="chars">`；split 預設 duration 1.25、stagger .05、`yPercent 105 → 0`、`clearProps transform,opacity`；每個字包在 `position:relative; display:inline-block; overflow:hidden` 的 `.line-w`。

## 本站實作
- `src/components/engine/Preloader.tsx`：同上時間軸（桌面 ©2026 逐字 → 收掉；手機直接收掉）；收掉開始的同一瞬間呼叫 `onReveal`（`is-revealing`：頁面顯示、`initAnimations` 讓大標逐字上升）；收掉結束 `onComplete`（`is-loaded`、Lenis 解鎖、遮罩卸載）；6 s 安全逾時；reduced-motion 全略過。
- 遮罩：左白（同 header 位置的字標、Collections 小清單，依「不加裝飾線」規則不畫列線）、右金；底色 stone-deep。
- `Hero.tsx`：EVERYDAY／LUXURIES 兩個 span 各加 `data-animation="split" data-split="chars" data-ease="expo.out"`；`.orbit-title .word { display:inline-block; overflow:hidden }` 作字元遮罩；原 `.orbit-title span` 規則改為 `> span` 以免套到 SplitText 產生的 span。
- CSS：`.is-loading body`、`.is-loading *{transition:none}`、`.is-loading:not(.is-revealing) .page-holder{opacity:0}`、`.preloader-year`（154px md／210px ≥1280、line-height .75、-.05em）、`.preloader-list`。
- 規格列：`.product-specs > div` 恢復 1px `#1f1f1f25` 底線、首列上線（使用者：方便對照）。

## 已檢視／驗證
- `check.log`、`check-specs.log`：lint 0 錯誤（3 個既有 `<img>` 警告）、typecheck、build 通過。
- 本機 filmstrip（桌面）：0–1.9 s 數字由左下升起並停在左下；2.0 s `is-revealing`＋clip-path 開始往左收（99% → 64% → 3%）＋第一個字元 translateY 31 → 5 → 0.45 → 0 px；3.0 s `is-loaded`。手機：0.2 s 即開始收掉、1.4 s 完成，無數字。正式站 filmstrip 同序列（網路延遲後移約 0.5 s）；兩端皆 0 個 console error。
- 已目視 `local/filmstrip-desktop.png`、`local/filmstrip-mobile.png`：白／金雙面板、數字字級與位置、收掉方向（頁面自右向左露出）、大標逐字上升、最終首頁完整。

## 限制與不宣稱
- 未在 Chrome 直接錄製參考站（本機連著兩個 Chrome，需使用者選擇），時間參數取自其程式碼；字型（Neue Haas Grotesk vs Outfit）與大標字級沿用本站，未改。
- GSAP `yPercent` 疊在 CSS 初始 `translateY(150%)` 之上的結果與參考站相同（同一寫法），未另行校正數字的最終停點。
