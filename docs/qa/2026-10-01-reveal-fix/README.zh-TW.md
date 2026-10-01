# 2026-10-01 首頁區塊整段空白（合作夥伴等）的根因與修正

使用者：「為什麼這一段老是會壞掉？」（英文首頁，OUR STORES 上方整屏空白）

## 重現
`repro.mjs` 用六種到達方式各掃一次首頁（中／英），列出「在畫面上但仍被進場動畫藏住」的元素：
- 從頂端往下捲、帶 `#visit` 開啟、點頁首門市圖示、跳到底再改視窗大小：0 個。
- **在首頁按語系切換**、**從內頁點字標回首頁**：18 個（推薦商品標題、Shown 各列、合作夥伴整段、最新消息各列…）——首屏以下所有帶 `data-animation` 的內容都不出現。修正前的結果在 `report-before.json`。

## 根因
這兩條路徑都會設 `cv-skip-preloader`，Preloader 在自己的 `useLayoutEffect` 裡直接呼叫 `finish()` → `reveal()` → `initAnimations()`。
子元件的 layout effect 比父元件早執行，這時 `PageShell` 還沒 `createScroller()`，`ScrollTrigger.defaults({ scroller })` 還沒指到 `[data-page-scroller]`
（內頁的 `CollectionBrowser` 還會把預設改成 `window`）。於是所有 ScrollTrigger 都綁在 window 上，而首頁的 window 從不捲動，
首屏以下的進場永遠不觸發，內容停在 `opacity: 0`／`clip-path` 收合的狀態。正常載入（有 preloader）時順序剛好對，所以時好時壞。

## 修正
- `PageShell.tsx`：`reveal()` 只記下「已揭幕」；動畫在 scroller 建好之後才建立（scroller 先好就立刻建，後好就由 layout effect 補建）。
- `animations.ts`：`onEnterBack` 時若該元素還沒顯示過就播放。ScrollTrigger 在 refresh 時對「已經在捲動位置上方」的 trigger 不會補發 `onEnter`，從下方回捲進來原本也會留白；這是第二道保險。

## 驗證
修正後同一支腳本十二個情境全部 0 個（`report-after.json`、線上 `report-live.json`）。
未涵蓋：Safari、觸控裝置（手機版 scroller 改用 window，走的是同一段程式）。
