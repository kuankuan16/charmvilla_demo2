# CHARM VILLA 開發交接

更新：2026-10-15。正式站 Shopify／GA4 上線；Git 與部署仍須即時回讀。

## 2026-10-15 正式上線

使用者明確授權正式部署、GA4 電商追蹤與 Search Console 提交。正式站 https://www.charmvilla.com/ 已由本輪 Production `dpl_7bWh8qzQLH1r41kkgV9acb969U6x` 啟用 Shopify。www／apex 原先已綁 tentenco/charmvilla-demo2，無 DNS 變更。Git production branch 為 main，來源 tentenco/charmvilla_shopify_official。

GA4 `G-D3YCFQMZ2W`，property 559053952、stream 16130398768；Shopify custom pixel 217153900 已連線。標準前台／結帳漏斗、購買重要事件、14 個月保留、跨網域、debug 流量排除及 Search Console 連結已配置。GA「銷售和收益」數據匯報包含工作階段重要事件發生率；提升銷售量含購物歷程與結帳流程。詳見 [追蹤契約](analytics/ga4-tracking-plan.md)。

Search Console sitemap 重新提交 Success，56 URLs；首頁及中文京都商品頁均已 request indexing。提交不等於已收錄，首頁原已收錄。商品圖／中文來源契約保留。

2026-10-14 遠端 4b1e83a、860e631 的桌機主圖清晰度修正保留：桌機 >=768px 使用原始 WebP，手機與縮圖維持 Next 最佳化；其歷史 QA 在 [圖片清晰度](qa/2026-10-14-product-image-clarity/README.md)。本輪不改圖片資產。最終 Git Production 已升級為 `dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt`（548a52a，READY），正式 API／購物車 verify 通過。

付款前流程已實測，未付款、未建立訂單。原 localhost:3026 使用者購物車保留；本輪正式站 QA 購物車已清空。首次真實付款後仍需對照 Shopify order ID／GA transaction_id；退款 webhook 未納入此 pixel。

## 現行工作樹

- 專案：`tentenco/charmvilla_shopify_official`。
- `main` 追蹤 `origin/main`，本次開始基準為 `61e3a1a`。
- 功能 c767233、合併遠端圖片 QA 96e9207、追蹤網址保護 548a52a 已推送 origin/main；Git Production dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt READY，www aliasAssigned=true。後續文件提交不變更應用程式。
- Node 24、Next.js 16.3.8、React 19.2.4。環境的預設 Node 是 22，可用 `npx -y -p node@24 -c 'npm run check'`。
- 英文預設無前綴，中文 `/zh`；舊 `/en` 由 proxy 重新導向。
- 舊版 handoff 來自另一台 Mac、另一個 demo repo；其中分支、worktree、Vercel project 和發布待辦不適用於這個 checkout。歷史內容保存在基準 commit 的同名檔案，不能將舊「下一步 push」當作目前授權。

## 本輪已完成

1. 使用使用者已登入的 EGO Lite Browser 連接 Charmvilla，確認實際 API 網域為 `zcs0bg-10.myshopify.com`。
2. 沿用既有 `Charmvilla Headless02` Storefront token；建立、設定並安裝 `CHARM VILLA Headless CMS` app，啟用 client credentials grant 與自動換發 token。
3. 對齊 14 商品、35 variants：商品資料／價格／選項／庫存讀 Shopify，圖片與版面沿用 demo2 Visual。完整表格和來源規則見 [Shopify 整合](shopify-integration.md)。
4. SSR 讀即時商品內容，前端每 30 秒／focus 更新價格與庫存；無法驗證庫存時停用購買，Shopify 最終驗證購物車與結帳。不再用本機預購額度計算庫存。
5. 配置官方 Dev MCP 與專案唯讀 Admin MCP，兩者 SDK handshake／工具呼叫成功；Codex global 與專案設定均已登錄。新 agent session 才會載入新工具。
6. 會員入口導向現有 Shopify hosted accounts。未重做 Customer Account API OAuth 前端。
7. 完成 Shopify 真實 API 和購物車測試，以 EGO 打開 hosted checkout 的配送／付款畫面；沒有下單、付款或寄信，測試購物車已清空。

## 重要檔案

- `src/lib/shopify/catalog.ts`：即時 Admin 內容＋Storefront 價格／庫存；保護缺設定、缺商品、分頁截斷。
- `src/lib/shopify/catalog-data.ts`：不含憑證的資料轉換，保留既有影像，按茶款／盒色配對，不依賴 variant 排序。
- `src/data/shopify-map.json`：真實 product／variant 身分；`shopify-products.json`：唯讀商品快照，不含 Shopify 圖片。
- `src/components/catalog/useLiveProduct.ts`、`LiveProductPrice.tsx`、`src/app/api/products/route.ts`：價格／庫存更新及失敗狀態。
- `src/lib/shopify/admin-auth.ts`、`scripts/shopify/runtime.mjs`：server-only client credentials 與 token 更新。
- `scripts/shopify/{sync,verify,mcp}.mjs`：同步、真實整合檢查、商店 MCP；`catalog.test.mjs`：資料／影像身分回歸測試。
- `.env.example`：環境變數鍵名；本機真實值在忽略的 `.env.local`，權限 0600。禁止輸出憑證。
- `.mcp.json`、`.codex/config.toml`：不含 token 的 MCP 設定。

## 未隱藏的限制

- 兩款 Christmas 商品未開放 Headless，保留商品展示但不可購買；本次未自行發佈到該管道。
- Christmas 小盒已按 Shopify 改為單盒 2 入 US$20，不再販售前台舊三盒組。
- Joyful Reunion 缺 Pink／Blue 專用照片；保留共用既有圖庫，不能宣稱所有顏色均已實拍配對。
- 四款 UNLISTED 工藝商品仍保留既有展示模式，資料可讀但無加入購物車。
- 2026-10-14 後續指示已完成中文遷移：14商品的28個原生商品翻譯、33個原生翻譯資源涵蓋37個選項標籤（含共用顏色 metaobjects）、14個中文CMS欄位。詳見 [中文遷移](shopify/chinese-copy-migration.md)；原本英文fallback限制已排除。
- 中文商品的沖泡／茶葉介紹已遷入Shopify；品牌／News／政策頁未做CMS搬遷。
- Shopify CLI 已安裝 4.9.3，但未建立 Charmvilla 的 CLI store auth；Headless API 與 MCP 正常運作，不依賴 CLI session。
- 舊 classic account routes 仍存在；公開會員頁已跳至 hosted accounts。Newsletter 實際訂閱、登入 OTP、付款與訂單完成均未測試。
- 安裝後 npm audit 仍列出 7 個既有 high advisories（sharp／source-map-js、ESLint glob 依賴鏈）；本輪新增 MCP SDK 已升至 1.32.1。未執行會改動不相關套件的 `audit fix --force`。

## 驗證

[完整 QA](qa/2026-10-14-shopify-headless/README.md)：

- `npm run check` 通過；lint 0 errors、7 既有 warnings，typecheck 和 production build 通過。
- `npm run shopify:test`：8 項通過，含中文CMS優先與商務／影像保留測試。
- `npm run shopify:verify`：Admin／Storefront／CMS、購物車新增／讀取／數量更新／移除、非法輸入 400、account 307 通過。
- EGO：英文1440×1000、中文390×843，售罄、變體價格／照片、鍵盤、reduced-motion、API 失敗／恢復檢查完成；正常載入沒有 runtime error／failed request／破圖／水平溢出。
- public 資產零修改；已掃描追蹤候選檔與前端 build chunks，沒有本機憑證值；`git diff --check` 通過。

## 中文遷移補充

- 使用EGO TaskSpace40擷取demo2的14頁，所有遷移文案在本機實際DOM比對皆零遺漏；390px手機、1440px桌機、鍵盤與reduced motion正常。
- zh-TW已啟用但未對Shopify Online Store發佈；未發佈語系須從 `translatableResourcesByIds` 讀取，`Product.translations` 會回空陣列。前台及sync已修正，不需發佈整個商店語系才能讀CMS。
- 原生 title／body_html 存放商品名稱與介紹；`custom.headless_copy_zh_tw` 存其餘中文內容。內容維護方式與調整差異見遷移文件。
- 本次fetch發現origin/main前進至860e631（2個商品圖清晰度commits）；未覆寫本機整合或直接合併遠端。後續提交／發布前需重新檢視。
- 本輪未下單、未寄信，保留使用者先前用於測試結帳的1件購物車；未推送或部署。

- 一般選項翻譯鍵為 `name`；7個顏色選項連結 Shopify taxonomy metaobjects，需沿 `linkedMetafieldValue` 翻譯其 `label`。共用資源去重後為33個資源、37個標籤，已讀回驗證；見 [中文QA](qa/2026-10-14-shopify-chinese/README.md)。

## 接續

本次正式上線已獲授權並完成初次部署；最終發布與測試證據見 [上線 QA](qa/2026-10-15-production-launch/README.md)。啟動 `npm run dev -- --port 3026` 可檢查目前結果，既有開發服務使用同一埠。未來新一輪發布依當次使用者指示，先核對部署專案／環境變數；不可從舊 handoff 猜 Vercel 綁定，也不要推送當作備份。所有圖片、翻譯或商品內容補齊須依使用者來源規則進行。
