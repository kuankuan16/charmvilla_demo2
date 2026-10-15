# 移除商品 Search UI（2026-10-15，本機）

使用者認為產品數量少、不需要 Search。移除共用 CollectionBrowser 的搜尋欄、清除按鈕、query 篩選及相關桌機／手機 CSS；舊 `?q=` 連結仍顯示整個分類。分類切換、商品數與卡片保留，移除不再需要的 Suspense 搜尋 fallback，調整分類與商品間距。

- Node 24 `npm run check` 通過：0 errors、7 原有 lint warnings，[輸出](check.log)。
- [16 組瀏覽器結果](browser-regression.json)：中英文 × 1440×900／390×844 × 4 分類。All 14、Tea 10、Scents 3、Wood-fired 1；即使 URL 有不命中的 q 也不隱藏商品。無 Search／破圖／水平溢出，分類可鍵盤 Enter 切換。
- [Reduced motion](reduced-motion.json)：分類商品可見，預購說明保留且沖泡動畫未啟用。[Browser errors](browser-errors.json) 為空。已檢視英文桌機及中文手機截圖。
- 首次 QA 在 server 重啟尚未 ready 時連線被拒，確認 Ready／HTTP 200 後才重跑並通過，並非應用程式失敗。

未 commit／push／部署；port 3026 是本機整合成果。先前 SEO／預購 UI 與本機 Logo 修正完整保留。

## 後續正式發布（2026-10-15）

已經使用者明確授權，隨main `6ac2081`正式發布；Vercel READY、www/apex及正式瀏覽器/全站crawl驗證通過，詳見[完整release QA](../2026-10-15-full-release/README.md)。本文較早的未部署狀態為當時快照，已由此結果取代。
