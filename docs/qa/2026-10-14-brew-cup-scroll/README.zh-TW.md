# 2026-10-14 沖泡區：固定一只杯子，隨步驟累積（Daily Harvest「What's in the cup」方向）

使用者在 `10-14-charmv-landing-try/reports/brew-section-design-directions.html` 的研究中選定 Daily Harvest 的做法：圖不換、一只杯子固定在旁，每個步驟往杯裡加一樣東西。本輪在 `brew-cup-scroll` 分支（獨立工作樹）實作，只動本機，未部署、未推送。

## 本機實作

- `src/components/catalog/BrewCup.tsx`（新）：固定杯子的線稿 SVG，與右側五個小 icon 共用同一套筆畫（`brew-drawing.tsx`），加上 150 mL／95°C／約 5 分鐘三個指引標籤與五段進度條。數值全部來自既有步驟文案，沒有新增任何沖泡參數。
- `src/components/catalog/brew-drawing.tsx`（新）：把原本 `TeaPages.tsx` 內的 icon 路徑拆成可重用的圖元（壺、杯、水、茶包袋、小金魚、蒸氣）；右側小 icon 的輸出與先前相同。
- `src/lib/motion/animations.ts`：`brewProcess()` 多輸出連續的 `--brew-stage`（0→4）與 `is-brew-live`；手機版把軸線終點改為「最後一個節點停在固定圖下方 48px」。
- `src/app/globals.css`：`.brew-cup`／`.bc-*` 全部用 CSS `clamp()` 讀 `--brew-stage`：01 壺倒水、水位上升 → 02 茶包袋出現、小金魚被提起 → 03 小金魚落入杯中 → 04 碼表出現、茶色與整段背景轉為琥珀 → 05 既有核准照片淡入覆蓋線稿。
- 沒有 JavaScript 或 `prefers-reduced-motion` 時：只顯示核准照片，與先前一樣。
- 核准照片與右側步驟、文案、節點、軸線規則（2026-10-12 回饋）皆未更動。

## 本機驗證

- Node 22.23.1：`npm run lint` 0 errors／7 個既有 warnings；`npm run typecheck` 通過；`npm run build`（Next 16.3.8）通過。
- agent-browser 實際捲動截圖：`/zh/products/year-of-plenty-gift-box` 與 `/products/year-of-plenty-gift-box`，1440×900 與 390×844；桌機固定圖在照片完全淡入前都保持釘住（figTop 90px），手機固定圖釘在 header 下方（top 72px），無橫向溢位，console 無錯誤；reduced-motion 下線稿不渲染、只有照片。
- 截圖：`desktop-zh-01-pour.png` → `desktop-zh-05-photo.png`（五個階段）、`desktop-en-04-steeping.png`（英文標籤）、`mobile-zh-01-pour.png`、`mobile-zh-05-photo.png`、`desktop-zh-reduced-motion.png`。

## 取捨與待使用者決定

- 沒有前四個階段的實拍照，也不得用生成圖取代核准圖，所以前四步用品牌既有 icon 語彙的線稿累積，最後一步才交棒給核准照片。
- 右側每步的小 icon（10-14 使用者核准）現在與大圖重複；保留未刪，可依指示拿掉或改成只留數字。
