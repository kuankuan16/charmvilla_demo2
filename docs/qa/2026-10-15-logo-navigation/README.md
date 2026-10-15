# Logo 返回首頁間歇錯誤（2026-10-15，正式發布）

使用者先指定忽略，後重新回報跨瀏覽器上方 Logo 出錯，已恢復排查。2026-10-15 正式預購版本 bbf555a 的 top Logo 首次操作即重現相同 toFixed TypeError，見 `reopened-top-logo.json`。既有最小修正仍適用。

## 原因及修正

- 正式站與修改前本機皆重現：京都版商品頁 → 頁尾大 Logo → 首頁。`segment.toFixed` 拋出 TypeError，進入 Next client global-error。證據見 [正式站](production-reproduction.json) 與 [本機基線](local-baseline.json)。
- error 當下舊沖泡區 `isConnected=false`、5 個節點位置全 0。首頁 layout effect 執行 `ScrollTrigger.refresh()` 時，舊 BrewProcess 的 passive effect 尚未 cleanup；節點間距 0 造成 NaN，GSAP 的 clamp 多載回傳 function，接著 toFixed 拋錯。
- `BrewProcess.tsx` 改用 `useLayoutEffect`，在 DOM 移除／隱藏前清理 triggers；fonts.ready callback 也檢查 connected。不吞錯、不用強制 reload，不改 Logo href／路由／動畫數值。

## 已完成驗證

- Node 24 `npm run check` 通過：0 errors、7 既有 lint warnings。[輸出](check.log)。
- Ego 同一 TaskSpace 86：中英文 × 頂部／頁尾 Logo × 3 次，共 12 次 soft navigation；切頁前動畫約 stage 1.57。無 client error，首頁正常掛載。[結果](ego-regression.json)。
- agent-browser：中英文 × 1440×900／390×844 × normal／reduced-motion 共 8 組。每組頁尾 Logo → 首頁、返回商品頁 → 鍵盤 Enter 頂部 Logo → 首頁、重新整理；皆通過。正常動畫 stage 0→4，減少動態模式保留照片、不啟用動畫；無水平溢出或破圖。[結果](viewport-regression.json)、[console／requests](browser-diagnostics.json)。
- 已檢視 1440／390 中文 stage 4 截圖；杯子動畫交接照片、五步內容及手機 sticky 正常。其餘英文截圖保存在同目錄。

新增正式 top Logo 重現後，在最新整合 production build 重新跑中英文上方 Logo 各3次，6/6通過且保留soft navigation、無runtime exception（`reopened-local-regression.json`）。首次測試選錯首頁 `.hero` selector導致等待逾時；實際頁面成功、errors為空，改以現行 `.orbit-title`驗證。

使用者2026-10-15已明確授權正式部署。release worktree僅帶入BrewProcess生命週期修正，Node24 npm run check通過，0 errors／7既有warnings（release-check.log）。正式部署與線上回歸證據於發布後補充。使用者購物車與port3027未動。
