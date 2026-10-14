# CHARM VILLA 開發交接

更新：2026-10-15。這是有日期的接手快照，不是新任務或發布授權。進行中任務與 FIFO queue 只看 [PLAN.md](agent/PLAN.md)，工作規則看 [AGENTS.md](../AGENTS.md)。

## 接手時先確認

- 本輪 Agent 文件整理開始時，`main` 與 fetch 後的 `origin/main` 均為 `e83cc1b`，工作樹乾淨；本輪修改尚未 commit／push／部署。
- `origin` fetch／push：`https://github.com/tentenco/charmvilla_shopify_official.git`。Vercel 專案名稱仍是 `tentenco/charmvilla-demo2`，不可因 Git repo 改名就另建部署專案。
- 另有 `.claude/worktrees/brew-cup`，分支 `brew-cup-scroll`、HEAD `c8380b9`；本輪讀取 status 為乾淨。這不是合併或刪除它的指示，也不代表已確認執行者狀態。
- Node 以 `.nvmrc` 的 24 為準；本輪 shell 為 22.23.1，替代執行方式見 [VERIFY.md](agent/VERIFY.md)。不要沿用另一台機器的路徑。
- 既有本機測試使用 port 3026；動服務前先查證。使用者的 localhost 購物車要保留。

## 最近已交付：正式站、Shopify、GA4、SEO

正式站：<https://www.charmvilla.com/>。英文無前綴、中文 `/zh`；結帳測試入口：<https://www.charmvilla.com/zh/products/kyoto-gift-box>。

2026-10-15 已依使用者授權正式上線。當時核對 www／apex 都指向既有 Vercel 專案，沒有更動 DNS；`main` push 會觸發 Production。最後一次應用程式驗證的部署是 `dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt`，來源 `548a52a`、READY 且 aliasAssigned=true。`e83cc1b` 僅更新文件；現在的線上部署仍須即時回讀，不能從這個 ID 推測。

| 已交付內容 | 核對結果與證據 |
| --- | --- |
| 商品與結帳 | 14 商品／35 variants 對齊；商品、價格、庫存與購買資格跟隨原 Shopify，照片保留 demo2 Visual；[整合契約](shopify-integration.md) |
| 繁中 CMS | 14 商品、28 個原生商品翻譯、33 個資源涵蓋 37 個選項標籤、14 個中文 CMS 欄位；[遷移說明](shopify/chinese-copy-migration.md)、[中文 QA](qa/2026-10-14-shopify-chinese/README.md) |
| GA4 | `G-D3YCFQMZ2W`；property `559053952`、stream `16130398768`；checkout pixel `217153900` 已 connected。購買重要事件、營收／轉換率、購物／結帳漏斗、同意與跨域已配置；[事件契約](analytics/ga4-tracking-plan.md) |
| Search Console | 連結 GA4；sitemap Success，56 URLs；首頁與中文京都頁 request indexing 成功。提交不等於 Google 已收錄；[上線 QA](qa/2026-10-15-production-launch/README.md) |
| 核准圖片 | 保留遠端 `4b1e83a`、`860e631` 的主圖清晰度調整；桌機主圖原始 WebP、手機／縮圖最佳化；[圖片 QA](qa/2026-10-14-product-image-clarity/README.md) |

Git 證據：`c767233` Shopify／中文／GA4，`96e9207` 整合遠端圖片調整，`548a52a` 追蹤網址保護及線上驗證，`e83cc1b` 最終發布文件。歷史內容可從 Git 讀取，不另複製舊 handoff。

使用者另授權的上線通知已透過 Gmail 寄出並讀回 `SENT`；這項已交付，不因接手而重寄。

## 工程入口

| 範圍 | 檔案／文件 |
| --- | --- |
| Shopify 即時內容與庫存 | `src/lib/shopify/catalog.ts`、`catalog-data.ts`；`src/components/catalog/useLiveProduct.ts`、`LiveProductPrice.tsx`；`src/app/api/products/route.ts` |
| 商品身分與快照 | `src/data/shopify-map.json`、`src/data/shopify-products.json`；快照不作即時庫存備援 |
| 購物車／會員 | `src/app/api/cart/`、`src/app/api/account/`；公開會員入口跳 Shopify hosted accounts，沒有重做 Customer Account API OAuth 前端 |
| Admin 憑證更新 | `src/lib/shopify/admin-auth.ts`、`scripts/shopify/runtime.mjs`；server-only client credentials；不輸出或提交 token |
| CMS／MCP | [Shopify 整合](shopify-integration.md)；`.mcp.json` 與 `.codex/config.toml` 的兩個 server；商店 MCP 拒絕 mutations |
| GA4 前台／checkout | `src/lib/analytics/ga4.ts`、`src/components/analytics/`、`scripts/analytics/shopify-checkout-pixel.js` |
| 秘密與設定 | `.env.example` 只有鍵名；真實值在忽略的 `.env.local`，先前已設 0600。不要讀出值來做交接或健康檢查 |

Shopify API 網域為 `zcs0bg-10.myshopify.com`，checkout host `account.charmvilla.us`。CMS app 使用 client credentials 自動換發 token；不用重建 app 或再遷移中文。zh-TW 未對 Shopify Online Store 發佈，翻譯需用 `translatableResourcesByIds` 讀取；不要因 `Product.translations` 為空而覆寫或發布整個語系。

## 已驗證與尚未驗證

以下是上線時證據，不是本輪重新測試。完整輸出見 [正式上線 QA](qa/2026-10-15-production-launch/README.md) 與 [初次整合 QA](qa/2026-10-14-shopify-headless/README.md)。

- `npm run check` 通過：0 errors／7 既有 warnings；Shopify 測試 8/8、analytics 測試 8/8。
- 正式 Shopify API／獨立測試購物車 CRUD、非法輸入與 hosted account redirect 通過；QA 購物車已清空。
- 英文 1440px／中文 390px、鍵盤、reduced-motion、同意／撤回；沒有 runtime errors、failed requests、破圖或水平溢出。56 個 sitemap URL 的 HTTP／canonical／hreflang 檢查通過。
- DebugView 實際收到瀏覽、加購／移除、購物車與 Shopify `begin_checkout`；配送、付款、purchase 邏輯以離線 fixture 測試。
- 未實際付款、未建立訂單。首筆真實訂單仍須對照 Shopify order ID 與 GA transaction_id；退款／取消的伺服器同步未包含，GA 收益不等於退款後淨營收。
- Newsletter 真實訂閱、登入 OTP、付款完成未測試；不要把 account redirect 通過當成完整會員測試。

## 保留限制，不自動啟動工作

- 兩款 Christmas 商品未開 Headless；保留展示但不可購買。小盒以 Shopify 單盒 2 入 US$20 為準，不恢復舊三盒組。價格仍須讀即時資料。
- Joyful Reunion 缺 Pink／Blue 專用照片，使用共用核准圖庫；四款 UNLISTED 工藝商品維持展示模式。
- 商品中文已遷移，品牌／News／政策頁未遷 CMS；英文一般編輯內容仍用既有來源。
- Shopify CLI 曾安裝 4.9.3，未建立該商店 CLI auth；Headless API／MCP 不依賴它。MCP 歷史 handshake 成功不等於目前 session 已載入工具。
- 上線時 npm audit 曾列 7 個既有 high advisories；目前情況須重新查證，不為文件任務執行 `audit fix --force`。
- [TASKS.md](../TASKS.md) 有上線前的價格／預購／帳戶假設；它是公開頁面內容，不是目前待執行任務。需更新時另按內容範圍核對，不能照舊清單改商店。

本輪 Agent 工作區整理的結果與驗證見 [PLAN.md](agent/PLAN.md)。後續發布依當次使用者指示，先核對 Git、專案與環境；不要把 push 當備份。
