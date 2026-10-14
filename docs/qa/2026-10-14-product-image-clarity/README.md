# 商品頁主圖清晰度（2026-10-14）

使用者回報銀杏茶匙的桌機主圖模糊，要求優化程式的圖片呈現。原始商品圖、構圖與 CSS 版型均保留。

## 重現與根因

- 原圖：`public/media/site/studio2k-ginkgo-teaspoon-gift-box-v5.webp`，1792 × 2240，162,938 bytes。
- 線上基準：`https://charmvilla-demo2.vercel.app/products/ginkgo-teaspoon-gift-box`（修正前基準）。
- ProductGallery 的容器高度為 `max(480px, 100svh - 2 * 72px)`，照片以 `object-fit: cover` 填滿；但原本 `sizes` 只傳桌機 `50vw`，未涵蓋由高度主導的縮放。
- 可重現案例：viewport 1024 × 1400、DPR 1；圖片框 415.414 × 1256 CSS px。原圖比例 4:5，cover 實際需要約 1004.8 CSS px 寬；瀏覽器原本選 `w=640&q=90`，獨立 Image 解碼確認只有 640 × 800，再被放大約 1.57 倍。勿直接把帶 srcset 圖片的 naturalWidth 當作檔案像素：它可能已按 density 校正。
- 寬螢幕／高 DPR 可能已選到足夠寬的版本；本次另消除主圖重複有損編碼。不能說每個 desktop viewport 都會選到 640px。

## 最小修正

- 僅變更 `ProductGallery.tsx`：`picture/source` 在 >=768px 使用既有壓縮原圖；手機維持 Next Image 的 responsive srcset、quality 90，縮圖維持既有最佳化。
- 首張改為 eager + fetchPriority high，避免舊 priority/preload 把 desktop 不採用的 optimized fallback 也下載一次。其他圖片保持 lazy；沒有新增 dependency 或圖片處理。
- 桌機主圖改為下載完整原始 WebP；銀杏茶匙約 163 KB。這是清晰度與傳輸量的取捨，沒有宣稱流量降低。清晰度仍受原始像素上限限制。
- Network 實測銀杏茶匙僅請求一張原始主圖及一張 `w=256&q=75` 縮圖，沒有重複下載壓縮主圖。

## 驗證

- Node 24：`npm run check` exit 0，lint 0 errors／7 個既有 warnings、typecheck 通過、build 通過（79 個靜態頁）。
- 正式 build 在本機 port 3138 驗證；`browser-report.json` 含 8 組中英文案例：1440×1000 DPR 1/2、1024×1400、1940×1280、390×844 DPR 2/3，以及 767/768px breakpoint。零水平溢出、零意外 broken image、零 console error／runtime exception／failed request；中文手機含 reduced motion。
- 銀杏茶匙的單張圖庫／Sold out 保留；春曉多圖庫驗證 Enter 切縮圖、上一張／下一張、動畫結束 opacity=1、切粉紅色後重設第一張、中文手機切換。結果見 `interactions.json`。
- 失敗情境：僅在測試分頁封鎖第一張原圖的網路請求；商品標題／alt／4 個縮圖保留，仍可切至成功載入的第二張，零 app exception。結束後已解除封鎖。
- `before-tall.png` 與 `en-tall.png` 同 viewport、DPR、框尺寸。`detail-before-after.png` 為相同座標的 200% 最近鄰放大：左為修正前，右為修正後。已目視確認 logo、布料與木紋細節提升；未銳化／重畫商品。
- `en-desktop.png`、`en-mobile.png`、`zh-mobile-reduced.png` 為本機實際頁面截圖。

## 範圍與狀態

使用者指示「直接發布」後，實作 commit `4b1e83a` 已推送到 main，Git 觸發 Production `dpl_2yd5e4hb4ALp8iB8iWwhR8NFrbjh`，狀態 READY 且 aliasAssigned=true，線上驗證通過。未另建 Preview。共同 ProductGallery 的桌機主圖皆採此修正；資產、商品文案、圖片裁切與版型未變。Git 推送目標仍為 `tentenco/charmvilla_shopify_official`。

## Production 證據

- 實作 SHA：`4b1e83ac2be3f64c064746c590f97cca20b47a7d`；deployment URL：`https://charmvilla-demo2-myhze96ww-tentenco.vercel.app`。詳細 API 回讀見 `production/deployment.json`。
- `production/browser-report.json`：實際 alias `https://charmvilla-demo2.vercel.app` 中英文 1440×1000、390×844、較高桌機 1024×1400，共 5 案例，DPR 1–3；中文手機 reduced motion。桌機載入原圖 1792×2240，手機仍選 w=828 或 1200 的 Next 最佳化圖片。各案例無水平溢出、broken image、console/runtime error 或載入失敗。
- 首次由桌機切到手機 viewport 後立刻導航，曾記錄一個被導航取消的圖片請求 `ERR_ABORTED`（主圖成功載入）。保留於 `production/navigation-observation.json`。改以 about:blank 隔開測試 viewport 後，重跑兩個手機案例均零 failed request；未修改應用程式或忽略網路錯誤。
- `production/interactions.json`：春曉桌機 Enter 選縮圖、切粉紅選項重設第一張、下一張與淡入完成，零 app error。
- 已逐張檢視 Production 桌機、較高桌機與中文手機截圖；圖片清晰、原裁切與版型保留。
- 發布後 API 回讀顯示，專案在本次發布前已綁定 `www.charmvilla.com` 與 `charmvilla.com`（裸網域轉向 www），因此 Git Production 同時更新這些既有 alias。本次未更改 domain／DNS 設定。`production/existing-custom-domain.json` 是 www 商品頁的只讀瀏覽器確認：同樣載入 1792×2240 原圖。
- 本紀錄對應上述實作 commit；後續只補 QA／交接的文件 commit 不改程式。未來仍應即時查核 Git HEAD 與 Vercel alias。
