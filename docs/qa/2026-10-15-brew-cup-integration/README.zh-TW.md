# 2026-10-15 沖泡區整合：合併 `brew-cup-scroll`、Ego Lite 檢視、捲動節奏微調、全商品與正式站驗證

使用者指示（2026-10-15）：把另一個 agent 在 `.claude/worktrees/brew-cup`（分支 `brew-cup-scroll`，`c8380b9`，QA 見 [2026-10-14 沖泡區](../2026-10-14-brew-cup-scroll/README.zh-TW.md)）做好的「固定一只杯子、隨步驟累積」設計整合進主線；整合後用 Ego Lite Browser 再看一次，在捲動動態或細節上再優化；確認中文與英文版、以及所有有沖泡區的商品頁都正確植入；完成後 commit、push 到 GitHub，部署到正式站。

## 整合

- `git merge brew-cup-scroll` 進 `main` → `fe38a98`，無衝突。主線同期對 `TeaPages.tsx`（LiveProductPrice）與 `globals.css` 的修改與分支互不重疊。
- 之後在 Ego Lite（1800×1125）與 agent-browser（1440×900）實際捲動檢視，找到一個節奏問題並做三處小調整（下節）。核准照片、右側五步文案與小 icon、節點／軸線規則、沖泡參數都沒有動。

## Ego Lite 檢視後的調整

| 觀察 | 調整 | 檔案 |
| --- | --- | --- |
| 軸線起點在「第一個節點到視窗 74%」時，桌機 1440×900 的壺已經開始倒水，但杯身還在摺線下方（圖的頂端在 485px、杯身 851–1008px），水位上升看不到，等到杯子進入畫面時步驟 01 已經快結束 | 桌機起點改為 60%，手機維持 74%（手機圖釘在 header 下，起點再往下會讓進行中的步驟被圖蓋住） | `src/lib/motion/animations.ts` `railStart()` |
| 照片在最後 0.3 段切入，和琥珀色幾乎不重疊，像「切換」而不是「到來」 | 照片改佔最後 0.4 段（`--brew-stage` 3.6→4），與琥珀色尾段重疊 | `src/app/globals.css` `--brew-photo` |
| 照片淡入時是靜止貼上 | 照片從 104% 隨淡入收回到 100%（`transform-origin: 50% 60%`，`Picture` 的 wrapper 負責裁切）；無 JavaScript 與 `prefers-reduced-motion` 時 `transform: none` | `src/app/globals.css` `.brew-photo img` |

## 本機驗證

### 靜態檢查

- `npm run check`（Node 24）修改前後各跑一次：lint 0 errors／7 個既有 warnings、typecheck 通過、`next build` 通過（`/tmp/brew-check.log`、`/tmp/brew-check2.log`）。
- dev server（port 3026）log 無 error。

### 實際捲動量測（agent-browser，主線 server；先關閉電子報視窗，見 LESSONS 2026-10-15）

| 視窗 | 路由 | 結果 |
| --- | --- | --- |
| 1440×900 桌機 zh | `/zh/products/year-of-plenty-gift-box` | 軸線 4667→5333；stage 0 時圖頂 359、杯身底 882（<900）、150 mL 標籤頂 774，都在畫面內；stage 2.0→4.0 圖釘在 top 90；stage 4 照片 opacity 1、`scale` 1.04→1；無水平溢出、無 console error |
| 1440×900 桌機 en | `/products/year-of-plenty-gift-box` | stage 0 圖頂 359、杯身底 1069 前的杯口／標籤在畫面內；stage 1.08 圖頂 147；stage 3.79 照片 0.48、scale 1.02；英文標籤 `150 mL · 5 fl oz`／`95°C · 203°F`／`About 5 minutes` 無溢位 |
| 1800×1125 Ego Lite zh | 同上 | stage 0 圖頂 494、杯身底 1061（<1125）；`/tmp/brew-review/after-00..07.jpg` |
| 390×844 手機 zh | 同上 | 圖釘在 72px（header 下）、高 388；stage 3.77 照片 0.42、scale 1.023；stage 4 照片 1、最後一步頂 477 > 圖底 460（沒被圖蓋住） |
| 390×844 手機 en | 同上 | stage 2.06 圖釘 72；stage 4 照片 1、最後一步頂 477；英文標籤在 390 寬內（最寬 58–165、220–315） |
| 1024×768 平板 zh／en | 同上 | 兩欄版型；圖釘在 88；stage 4 照片 1；無溢出 |
| reduced-motion 1440×900 zh | 同上 | `.brew-cup` `display: none`、照片 opacity 1、`transform: none`；只有照片 |

鍵盤：沖泡區沒有可聚焦元素，本輪沒有另外做鍵盤測試。

### 全商品頁（1280×800，兩種語言）

`src/data/tea-gifts.ts` 中除 `fruit-infusion-gift-box` 外的 10 個可見茶禮盒：blossoming-prosperity、christmas、kyoto、orchid、purple-butterfly、reunion-paper、snowflake、spring-dawn、winter-blossom、year-of-plenty。每頁 `/products/<slug>` 與 `/zh/products/<slug>` 都確認：`.brew-process.is-brew-live`、`.brew-cup svg`、`.brew-photo img` 存在，五個節點；捲到軸線中段 `--brew-stage` ≈ 2，捲到終點 `--brew-stage` = 4.0000、照片 opacity 1、圖釘在 88；page errors 與 console error／warning 都是 0；無水平溢出。中文標籤 `150 mL`／`95°C`／`約 5 分鐘`，英文標籤如上。

## 截圖

- 桌機 zh 1440×900：`desktop-zh-stage-0-pour-begins.png`（杯子整個在畫面內才開始倒水）、`desktop-zh-stage-1-water-risen.png`、`desktop-zh-stage-2-goldfish-lifted.png`、`desktop-zh-stage-3-steeping.png`、`desktop-zh-stage-3.8-photo-arriving.png`、`desktop-zh-stage-4-photo.png`、`desktop-zh-reduced-motion.png`。
- 桌機 en 1440×900：`desktop-en-stage-1-pour.png`、`desktop-en-stage-3.8-photo-arriving.png`。
- 手機 390×844：`mobile-zh-stage-0.png`、`mobile-zh-stage-2.png`、`mobile-zh-stage-4-photo.png`、`mobile-en-stage-2.png`。
- 平板 1024×768：`tablet-1024-zh-stage-1.png`。

## Git 與部署

- Commit：`fe38a98` merge `brew-cup-scroll`；`297936e` 上一輪 agent 文件整理（與功能分開）；`864f7a0` 本次沖泡區調整、QA 與文件。`git push origin main`：`e83cc1b..864f7a0`。
- Vercel Production：`dpl_B3uNgcUTgd2eZhcu8K8K4YAQrgd8`（`charmvilla-demo2`，建於 2026-10-15 05:11 台北時間，29s，READY）；aliases 含 `https://www.charmvilla.com`、`https://charmvilla.com`、`charmvilla-demo2-git-main-tentenco.vercel.app`。沒有改 DNS 或專案設定。

## 正式站驗證（push 後實際回讀）

- `curl` `https://www.charmvilla.com/products/year-of-plenty-gift-box` 與 `/zh/products/year-of-plenty-gift-box`：HTTP 200，HTML 內各有 1 個 `class="brew-cup"`、`brew-photo`、10 個 `data-brew-node` 屬性（5 節點 × 2）。
- agent-browser 在正式站實際捲動（先關電子報視窗）：

| 視窗 | 路由 | stage 0 | 中段 | 終點 |
| --- | --- | --- | --- | --- |
| 1440×900 | `/zh/products/year-of-plenty-gift-box` | scrollY 4667（＝本機 60% 起點的值，證明新 `railStart()` 已上線）、圖頂 359、照片 scale 1.04 | stage 2.00、圖釘 90 | stage 4.0000、照片 1、scale 1 |
| 1440×900 | `/products/year-of-plenty-gift-box` | scrollY 4460、圖頂 359 | stage 1.91、圖釘 90 | stage 4.0000、照片 1 |
| 390×844 | `/zh/...` | 圖頂 182 | stage 1.90、圖釘 72 | stage 4.0000、照片 1 |
| 390×844 | `/products/...` | 圖頂 182 | stage 2.06、圖釘 72 | stage 4.0000、照片 1 |

四個組合都 `is-brew-live`、page errors 0、console errors 0、無水平溢出。其餘 9 個商品頁在本機已逐頁驗證（上節），正式站同一份 build；沒有逐頁再捲一次。
