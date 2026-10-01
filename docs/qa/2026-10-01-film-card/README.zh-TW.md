# 2026-10-01 首頁影片卡片（由下往上滑出、在中間小區塊播放）

使用者 2026-10-01：「影片我想要像這個網站 https://recruit.positive.co.jp/ ——這一屏由下往上滑出來，在中間小小的區塊播放」（附該站 Strategy 區 03 MISSION／04 PROMISE 疊卡截圖）。

## 參考站的做法（讀其 main.js／common.css）
每張卡（`.board-item`，白底、寬 90.28%）用 GSAP ScrollTrigger 在 `center center` 釘住到整組結束（`pin: true, pinSpacing: false`），下一張卡從下方滑上來蓋住它；被蓋住的卡 `scale` 縮到 .907–.96、`yPercent` 往上 6–10%，並蓋上一層品牌藍（opacity 最多 1.5 → 實際 1）。卡內左文右圖（圖寬 41.67%）。

## 本站的做法
- `page.tsx`：`<div class="film-stage"><Hero /><BrandFilm /></div>`。hero 以 `position: sticky` 釘在原位（`top = header 高 − 50px`，等於它原本的位置，開始釘住時不會跳）。
- `BrandFilm`（沿用 Codex 4476593 的元件名稱與影片檔，改寫版面）：白色卡片寬＝頁寬扣兩側 0.72 個頁邊距，高＝視窗扣頁首與上下邊距；卡片本身也是 sticky，升到頁首下方後停住約 65svh 的捲動距離（手機 45svh），之後和 hero 一起捲走。
- 卡片升起的進度寫成 `--film-p`（0→1）：hero 縮到 .94、蓋上墨色 34%。
- 影片在卡片中間的小區塊（寬 `min(42vw, 700px)`，16:9；手機滿卡寬），靜音循環，只有區塊一半以上在畫面內才播放；右下角圓形框線鈕可暫停／播放（訪客自己按的暫停會保留）。減少動態或省流量設定時不自動播放。
- 影片下方：標題「淬鍊日常的詩意：當工藝遇上生活儀式」＋英文副標（使用者 09-30 hero 影片需求裡給的兩行）；英文頁為 Crafting Everyday Poetics／Where Artistry Meets Living.
- **開關**：`NEXT_PUBLIC_SHOW_FILM=1` 才會顯示。影片的手正在重做（使用者 10-01「等一下，手的細節有問題」），所以正式站不開；預覽部署開。新片核准後換檔名（`earring-to-tea-v3.*`）並在 Vercel 正式環境加上這個變數。

## 檢查（本機 `next start`，開關開啟的 build）
`film.mjs` → `report.json`＋截圖（zh／en 桌面 1440×900、zh 手機 390×844，各 5 個捲動位置）：
- hero 在卡片升起與停留期間 top 固定 22px；卡片從視窗底部升到 top 110px（手機 243px）後停住；`--film-p` 0 → 1。
- 影片區塊 605×340（手機 334×188）；進入畫面後 `paused: false`、`currentTime` 前進，離開畫面後暫停。
- 無水平溢出、無 console 錯誤。`npm run check` 0 errors（5 個既有警告）。
- 未檢查：Safari／iOS 實機、768–1279px 寬度、觸控慣性捲動時的觀感。

## 影片本身
目前是 `earring-to-tea-v2`（15.2 秒、30 fps），手還是舊的；新影格 `hero/keyframes/shot2-v3.png`（素材專案）等使用者確認後才重做影片。
