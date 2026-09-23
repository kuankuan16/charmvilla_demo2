# BEHAVIORS.md — davidlaxer.com 行為聖經（實測，2026-09-23）

來源：Playwright 慢速滾動探針（1440×900、390×844）、`main.bf1a86935810d5a24392.js`（286 KB）與 51.8 KB inline CSS 的逆向、`laxer-behaviour-attrs.json`（HTML 上 146 個宣告式動畫屬性）。
所有數值皆為實測或 bundle 內常數；本專案以自己的程式重新實作，不複製對方原始碼。

## 0. 全域基礎

| 項目 | 實測值 |
|---|---|
| 字級基準 | `html` 10px（`.text-base{font-size:1.6rem}` = 16px），所有 rem 以 10px 計 |
| 斷點 | md 768 / lg 1024 / laptop 1280 / 1440 |
| 色彩 | ink `#1f1f1f`、paper `#ebeae4`(gray-100)、gray-200 `#919598`、gray-300 `#6f7275`、input `#d8d9cf`、accent pink `#f387c8`、white |
| 字型 | Neue Haas Grotesk Text Pro 500/700（授權字型，僅供研究；本專案不使用） |
| 排版語法 | 全站大寫、`leading-xs .9`／`leading-none 1`／`leading-tight 1.1`、`tracking-tightest -.05em`、hero 標題 `12.96vw`（laptop）／`18.5vw`（mobile）、12 欄格線、container padding 2.5rem（lg 3rem） |
| 游標 | `body{cursor:auto}`，另有 20×20 px `[data-page-cursor]` 圓點（fixed，z-100，`mix-blend-mode:difference`），位置以 CSS 變數 `--cursor-x/--cursor-y`（0–1 正規化）驅動，每幀 `lerp(current, target, 0.2)` |
| 減少動態 | 未偵測到 `prefers-reduced-motion` 分支（本專案需自行加：停用 Lenis 平滑、所有 GSAP 進場改為立即完成） |

## 1. 滾動引擎（互動模型＝virtual scroll in a wrapper）

- `window` **不滾動**（`html/body overflow:hidden`，`scrollY` 恆為 0）。
- Wrapper `.page-holder [data-page-scroller]`（`overflow:auto`，高＝視窗高），content `[data-page-container]`；桌面 1440 內容高 23,106 px，手機 390 內容高 16,695 px。Lenis 以 wrapper `scrollTop` 為位置。
- Lenis 選項（bundle 常數）：`easing = t => min(1, 1.001 - 2^(-10t))`、`lerp = 0.1`（未給 duration）、`wheelMultiplier = 0.75`、`normalizeWheel = true`（deltaY 夾在 ±100）、`smoothWheel = !isSafari`、`smoothTouch = false`、`syncTouch = false`、`orientation/gestureOrientation = vertical`、`infinite = false`。`wheelEventsTarget = content`。
- 實測收斂：單次 wheel 後 scrollTop 每 33 ms 取樣 −20, −31, −35, −43, −51, −54, −58, −61, −64, −66, −68, −69…（≈ 指數趨近，符合 lerp 0.1 @60fps）。
- 手機：`smoothTouch:false` → wrapper 原生觸控捲動；`laptop:` 前綴的 sticky 全部關閉，版面改為單欄。
- 頁面轉場（Swup）：離場＝`[data-coverflow-overlay]` opacity→.9（1.75 s power3.inOut）；進場＝scroller `xPercent 100→0`（power3.inOut，delay .5）。本專案單頁優先，跨頁沿用同一組參數。
- 滾動狀態屬性：scrollTop > 50 → wrapper `data-not-top="true"`；scrollTop > innerHeight → `data-reveal-header="true"`（header 依此切換樣式）。
- 錨點／sticky：sticky 元素直接放在 wrapper 內（因 wrapper 是真正的捲動容器，`position:sticky` 正常運作）。

## 2. 前導動畫（Preloader）

- `[data-component=preloader]`：fixed 全螢幕、`md:grid-cols-2`、底 gray-300；左半白、右半 gray-200；含 `[data-year]`（.ch 逐字）與 `[data-title]`。
- 時間軸（GSAP，paused 後 play）：年份字 `yPercent 150 → -150`，1.5 s，`power4.out`，stagger .05；一般設定 `ease expo.inOut, duration 1.8`；左半 `xPercent 0 → -200`；首頁另做 hero 標題 `split(words,chars)` `yPercent 105 → 0`，1.35 s，stagger .05。
- 期間 `customScroll.stop()`，完成後 `start()` 並 `html.is-loaded`。

## 3. 宣告式動畫系統（`data-animation`，72 個實例）

基底（class `js`）預設：`trigger=自身`、`duration 1.25`、`delay 0`、`ease "power3"`、`start "top bottom"`、`end "bottom top"`、`toggleActions "play complete none none"`、`from 0`、`once`（有 `data-repeat` 才重播）、有 `data-scrub` 才 scrub、進場加 `is-shown`。

| 類型 | 數量 | 規格 |
|---|---|---|
| `moveUp` | 25 | 進場：`y: 從下方位移 → 0`＋opacity（duration 1.25, power3）；delay 依 `data-delay`（0 / .1 / .15 / .2 / .4 交錯） |
| `split` | 17 | SplitText 型：`data-split` = lines（預設）/ words, chars；`default`：`yPercent 105 → 0`，stagger `.05`（`data-stagger-interval`），`clearProps transform,opacity`；行包在 `.line-w`（overflow hidden）並在開始時加 `is-animated`；`fade` 變體：opacity from→to；`type` 變體：visibility hidden→visible 逐字 |
| `parallax` | 12 | `y: -(vh × speed × 0.1) → +(vh × speed × 0.1)`，`ease none`，scrub；`data-scroll-speed` 值：5（hero 區）、6、0.85（hero 圖）、−1 / −1.5 / −2（策略區三層背景，`data-end="top +=100"`、`data-stop-at=0`） |
| `clip` | 8 | `clip-path: polygon(0 0,0 0,0 100%,0 100%) → polygon(0 0,100% 0,100% 100%,0 100%)`（由左向右揭開），delay 0 / .2 |
| `scale` | 6 | 變體 scaleLeft/Right/Up/Down/scale；圖片 `1.15 → 1`（`power2.out`）；小圓點 scale 進場（delay .4） |
| `stack` | 2 | 橫向捲動：`[data-stack-cards]` 容器 `x: 0 → -(cards×cardW − innerWidth)` ease none scrub；每張卡再以 `containerAnimation` 個別 `x += totalW`；`start "top+=60rem"`、`end "bottom bottom"`、`data-repeat`；桌面靠 `laptop:sticky top-50` 釘住；手機退化為直向 `gap-y-40` 網格 |
| `fade` | 1 | hero 深色 overlay：opacity 0→1，scrub，`end "bottom top"`（hero 隨滾動變暗） |
| `ambient-move` | 1 | hero 人像：滑鼠環境位移，方向 x，幅度 `0.005 × 視窗寬`，位置 `lerp 0.05`，`mapRange(0,1,+m,−m)` |

## 4. 元件行為

- **Header** `[data-header]`：fixed top 0，高 50px（`h-50` = 5rem），z-30；logo 左、選單開關 `[data-menu-opener]` 右；`menu--opened` class 切換。
- **Menu** `[data-menu]`：absolute 全螢幕 `bg-gray-900`；桌面呈階梯式面板（左 1/3 深色、右側 CLOSE 大字＋ ABOUT / BLOGS / CONTACT US 面板逐格由右下向左上錯位出現），面板以 `clip-path` `.5s cubic-bezier(.3,.86,.36,.95)` 揭開、文字 opacity `.35s` 同曲線；手機為全幅深色清單。Escape 關閉。
- **Accordion**（策略區 21 個 `[data-accordion-item]`）：`height 0 / opacity 0` → 展開，`.3 s power3.inOut`，同組單開（`accordion:true`），`is-active` / `has-active-item`。
- **Tabs**（2 個 `[data-tab-toggle]`，表單區）：內容 opacity 0→1 `.3 s power3.inOut`。
- **Link 樣式**：`.link--underline:after` 下底線 `scaleX 0→1`（動畫 `link .75s forwards`）；`.link--custom` hover 文字上移 `translateY(-125%)` 換字（`.link__hover-text`），轉場 `transform .5s cubic-bezier(.215,.61,.355,1)`。
- **Button**：`.btn--outline` inset 1px `rgba(31,31,31,.3)`，hover 填色 `#1f1f1f` 白字（`:before` 背景 transform）；箭頭圖示 `button-icon-movement`：0→49.9% `translateX(110%)`，50%→ `translateX(-110%)` → 0（穿越再回來）。
- **Lazyload**：`[data-component=lazyload]`，觀察容器＝wrapper，threshold＝視窗高；影片 `data-src` 進入視窗後才載入，autoplay muted loop playsinline。
- **CSS 轉場統計**（實測 getComputedStyle）：opacity `.35s cubic-bezier(.3,.86,.36,.95)` ×24；clip-path `.5s` 同曲線 ×21；`all .3s cubic-bezier(.19,1,.22,1)` ×10；color/bg `.3s cubic-bezier(.4,0,.2,1)` ×7；background-size `1s` ×7；transform `.5s cubic-bezier(.215,.61,.355,1)` ×7。

## 5. Sticky／釘住（桌面 ≥1280 才生效）

| 區塊 | 元素 | 規則 |
|---|---|---|
| 1 First impressions | 左側文字欄 | `sticky top-50`（高 661） |
| 2 How we think | 整個策略面板 | `sticky top-50`，區塊總高 7853 = 橫向 stack 的滾動距離 |
| 3 Process | 左側標題欄 | `md:sticky top-80` |
| 4 Additional services | 「SCROLL TO EXPLORE」清單 | `sticky top-150`（高 531） |

## 6. 手機（390×844）差異

- Header 50px fixed（含漢堡），hero 標題 18.5vw 兩行，人像置於灰色區塊內。
- 所有 sticky 取消、stack 橫向改直向；策略區高度由 7853 → 3397。
- 觸控＝原生捲動（無平滑），進場動畫同桌面。

## 7. 本專案採用／不採用

- 採用：wrapper 型 Lenis（同參數）、宣告式 `data-animation` 系統（moveUp / split / parallax / clip / scale / stack / fade / ambient）、header 狀態屬性、階梯式選單、accordion、link/button 微互動、游標圓點、preloader 雙面板＋逐字。
- 不採用：Neue Haas（改用品牌開源字型）、Typeform 嵌入、Swup 多頁轉場（單頁站）、GA。
- 必加：`prefers-reduced-motion` 全面關閉平滑與進場動畫；鍵盤可用的選單（focus trap）。
