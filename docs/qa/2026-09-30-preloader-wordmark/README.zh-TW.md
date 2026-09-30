# Preloader 官方字標逐字升起、導覽文字、全站底色（2026-09-30）

## 成品／交付檔
- Commit `ad40f10`；正式站部署 `charmvilla-gallery-site-f55k0mqzz` → https://charmvilla-gallery-site.vercel.app。
- `local/filmstrip-desktop.png`、`live/filmstrip-desktop.png`（每 220 ms 一格）、`local/top-{home,collections-tea,products-kyoto-gift-box}.png`（頁首 320px）、`live/live-check.json`。

## 製作方式與設定（使用者三項指示）
1. **刪除黑點與左邊小字、©2026 改成 CHARM VILLA、文字要跟標準字一樣**：品牌規則禁止重打或重繪字標，所以遮罩左下的字用官方 `public/brand/charmvilla-logo.png`（929×82）本身：以 sharp 掃描 alpha 得到 10 個字母的欄位範圍 `[[0,104],[123,199],[213,315],[330,398],[413,533],[562,656],[670,680],[703,754],[769,820],[826,928]]`，取間隙中點為切點 `LETTER_BOUNDS = [0,114,206,323,406,548,663,692,762,823,929]`，每個字母是一個 `span.ch`，以同一張 PNG 當 background sprite（`background-size: var(--lw) auto`、`background-position` 依切點偏移），拼起來與原圖逐像素相同。動畫參數不變（yPercent 150 → -150、power4.out、1.5 s、stagger .05）。字標寬 `min(50vw − 60px, 1000px)`，留在冷白左半內（金色字標不能壓在金色右半上）。Collections 清單與圓點整段移除。
2. **導覽文字改細改小**：`.hero-nav` weight 500 → 400、字級 `clamp(14px,1.05vw,18px)` → `clamp(12px,.9vw,15px)`、letter-spacing .02em（首頁與目錄頁共用同一個 Header）。
3. **底色每一頁都跟首頁一樣**：首頁 hero／開場區的底色是 `#f6f8fa`，其他頁面原本是純白（`.catalog-shell`、body）。新增 token `--color-page: #f6f8fa`，套用到 html/body（`bg-page`）、`.catalog-shell`、各頁 `[data-header]`、分類列、首頁精選區、商品主圖區、門市輪播與 preloader 左半；卡片、燈箱、門市卡維持白。

## 已檢視／驗證
- `check.log`：lint 0 錯誤（3 個既有 `<img>` 警告）、typecheck、build 通過。
- 本機：filmstrip 顯示字標逐字由左下升起（0.7–1.4 s）、2.2 s 起收掉並逐字上升大標、3.5 s 完成，無 console error；三頁 body／header 底色皆 `rgb(246,248,250)`、導覽字 12.96px／400。
- 正式站：`live/live-check.json`（preloader 10 個字母 span、0 個清單／圓點元素；三頁底色與導覽字同上）、`live/filmstrip-desktop.png`。
- 已目視 `local/filmstrip-desktop.png` 與 `local/top-collections-tea.png`。

## 限制與不宣稱
- 字標切片在字母之間的間隙處分割，若未來更換字標 PNG 需重新量測切點。
- 字標為 RGB 金（網站規則），在冷白底上與頁首字標一致；未提供白色版。
