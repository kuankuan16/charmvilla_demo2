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

本機驗證完成；使用者已指示「直接發布」，本次正提交並推送 main，等待 Production 與線上驗證。未另建 Preview。共同 ProductGallery 的桌機主圖皆採此修正；資產、商品文案、圖片裁切與版型未變。Git 推送目標仍為 `tentenco/charmvilla_shopify_official`。
