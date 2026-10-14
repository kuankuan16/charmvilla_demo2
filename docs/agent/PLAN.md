# Active Agent Plan

Status: `in_progress` — 2026-10-15 正式上線、GA4電商追蹤與Search Console提交。

## Objective

使用者明確授權將現有Shopify購買功能上線至 https://www.charmvilla.com/，完成GA4標準電商事件／轉換漏斗與Google Search Console／sitemap提交。沿用demo2 Visual與已遷移中文；價格、庫存、配送及結帳以Shopify為準。

## Steps and proof

| Step | Proof | Status |
| --- | --- | --- |
| 核對正式部署、Git、GA4與GSC權限 | Vercel project/domain、現有property和store設定 | in_progress |
| GA4完整購物漏斗與SEO設定 | 事件契約、同意管理、Shopify checkout事件、canonical與sitemap | pending |
| 合入已發布圖片修正並部署 | check、Shopify測試、preview、production deployment | pending |
| 正式域名端到端驗證及提交 | 真實購物車／結帳、GA4事件、GSC sitemap結果 | pending |

## Findings

- www與apex已綁Vercel tentenco/charmvilla-demo2，Git來源為charmvilla_shopify_official；無需搬DNS。正式站目前仍是local cart，未啟用本機Shopify整合。
- origin/main為860e631，本機61e3a1a落後兩個已發布商品圖清晰度commits；須保留其ProductGallery修正。
- 既有Shopify整合和中文遷移仍在本機未提交。另一brew-cup worktree乾淨，不涉及本次檔案。
- EGO TaskSpace46：p1正式站，p2 GA4，p3 GSC。先前保留的checkout頁不操作。
- 既有隱私頁聲稱沒有Analytics cookies；啟用GA4時需同步改成實際同意／追蹤行為。

- Vercel CLI api透過stdin批次建立env兩次回Invalid JSON；改用官方env add逐項stdin傳入，不輸出值。GA4已建立property559053952、stream16130398768、G-D3YCFQMZ2W。

- Preview已部署並驗證實際加購，Pixel217153900已Connected（Analytics required、非資料販售）。本次checkout自動導到Shop Pay（shop.app），付款表單與US$60商品正常；尚未付款。需驗證GA4 checkout事件與正式同意橋接。

## Handoff

正式首版已部署並以 www 實測。GA4 已完成 Search Console 連結、14 個月保留、purchase 逐事件轉換、Developer QA 排除、跨網域與銷售收益總覽。GSC sitemap Success 56 URLs，首頁／京都中文 request indexing 成功。Pixel 真實錯誤 customerPrivacy 未定義已依 Custom Pixel 官方文件改成 api.customerPrivacy，正式 checkout begin_checkout 已成功，cart 私有 attributes 能讀取。

下一步：保留遠端圖片 QA／規則，提交並合併 origin/main，推送最終 referral 修正；讀回 Production READY、GA DebugView 最新 checkout 事件，完成文件與 EGO TaskSpace46。
