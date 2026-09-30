# 回併 site-work 工作副本並部署（2026-09-30）

## 成品／交付檔
- Commit `5b441f0`：把 09-29 已部署到正式站、但從未提交的「藝術即生活」改版工作樹提交（HEAD 與正式站對齊）。
- Commit `a39e52c`：回併 `~/Documents/Codex/09-07-charmvilla/site-work/charmvilla-gallery-site`（Codex 09-29 16:31–17:26 的無 git 副本）：版面留白對齊、移除裝飾箭頭、茶包改為 16 款官方禮盒（`src/data/tea-gifts.ts`、`public/media/gift-boxes/`）、舊 `goldfish-tea-*` 網址 308 轉址。
- 正式站部署：`charmvilla-gallery-site-g1py72x27-tentenco.vercel.app` → alias https://charmvilla-gallery-site.vercel.app（`deploy.log`）。

## 製作方式與設定
- 以 rsync 把副本的 `src/`、`next.config.ts`、`public/brand/goldfish-gold.svg`、`public/media/gift-boxes/`、三個 QA 目錄覆蓋進 repo；副本只多一個 `publish-preview.command`（指向副本路徑，未採用）。
- Node 24（`npx --package=node@24`）：`npm run check`（`check.log`，0 錯誤、4 個既有 `<img>` 警告，41 頁靜態產生）、`node scripts/verify-tea-gifts.mjs`（`verify-tea-gifts.log`，PASS）。

## 已檢視／驗證
- 部署後 `/`、`/collections/tea`、`/products/reunion-paper-gift-box` 200；`/products/goldfish-tea-rose-jinxuan` 308 → `/collections/tea`；`/media/gift-boxes/official-891.png` 200。
- 完整路由與視覺 QA 併入同日的 `../2026-09-30-listing-image-ground/`。

## 限制與不宣稱
- `scripts/verify-catalog.py` 仍假設 26 條路由與首頁 20 個商品連結，是 09-29 上午的規格；禮盒上架後為 37 條 sitemap 路由，本次未更新該腳本。
- 副本目錄未刪除，之後以 repo 為準。
