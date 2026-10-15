# CHARM VILLA 開發交接

更新：2026-10-15。這是有日期的接手快照，不是新任務或發布授權。進行中任務與 FIFO queue 只看 [PLAN.md](agent/PLAN.md)，工作規則看 [AGENTS.md](../AGENTS.md)。

## 2026-10-15 root 同步與 Shopify MCP 接續

- 本輪使用者授權本機／GitHub 最新版整合、正式 www 發布與 Ego／Shopify MCP 設定。root fetch/push 都是 `tentenco/charmvilla_shopify_official.git`。
- root 原 main `2232e74` 的21個本機修改檔已保存為本機分支 `codex/preserved-local-client-work-20261015`／`4589147`，再 fast-forward 到 `729d6fa`。舊 WIP 的核准圖片／文案已在先前 release curated merge；本輪合併補回影像 Lessons，沒有把舊檔覆蓋到同事新 Shopify。歷史 CSV、QA、rejected 圖片及 output 原路保留、未批次發布。
- root 應用程式與已驗收 `afc5199` 相同；Node24 check／Shopify12及 MCP 改動後 lint 通過，本機與 www 各5路由及5圖片 hash 通過。`729d6fa` 已由正式 www/apex/demo2 alias 指向 READY deployment `dpl_7byj5Wsz4zprzHPbxYBsR1pwxtCg`。本輪後續 MCP／文件提交不變更 storefront 程式。
- root `npm start` port3146 為本輪持有，Ego task44 p1 已開此網址。p2 Shopify 密碼登入已 handOff；沒有使用者確認前不可操作 task44。MCP server handshake 通過但商店查詢缺 Admin credentials；production sensitive env 不可回讀。未修改 Shopify 商品、庫存、憑證或 app scopes。接續見 [整合文件](shopify-integration.md) 與 [QA](qa/2026-10-15-local-sync/README.md)。
- 團圓金色可售數量仍待使用者回答，不能把目前藍色3盒當成金色。隱藏無貨色款須等商店實際資料更正再驗證，未宣稱已完成。

## 2026-10-15 核准雪花圖片與客戶定稿正式發布

- 在隔離 `charmvilla-release-20261015` 整理核准五張圖片、定稿、政策連結、聖誕兩選單、最新加大的沖泡留白；已整合 `9beeb11`，保留同事最新 Shopify/checkout/SEO/配送/庫存與 Logo 修正。
- Node24 check、Shopify12、API37、E2E16、Ego zh/en1440/390 通過。67a9091 圖片與定稿已正式發布；底部對齊補充 afc5199 的正式部署為 dpl_79UtGMhWkVkjfG1jHKHA4zipXjmP，READY/www/apex/demo2，正式12組視窗/語言/motion檢查通過，桌機底緣差0px。[本批 QA](qa/2026-10-15-client-images-release/README.md)。
- 當時 root `10-02-charmvilla-demo2` 在舊主線2232e74並保留WIP；其後已依上節保存與同步。照片只有五個核准新檔案納入，不納入 rejected outputs。
- Shopify後台本輪無寫入；後續團圓金色庫存待使用者提供實際數量，粉紅/藍隱藏選單為獨立新任務。

## 本輪交付（2026-10-15）

- 使用者明確授權「commit、push everything」及merge同事branch，全部已完成：`d18197e`全部WIP、`7809393`整合已部署Logo、`6ac2081`合併`origin/checkout-tests-wip`（kuankuan16，tip`abdc4c4`）。不是squash/cherry-pick，分支tip確為main祖先；其餘舊設計分支未批次合併。
- 正式Vercel `dpl_FeZSFXA9NWEwWCWKmu5iW3v4umJG` READY，來源`6ac2081`，www/apex aliases已指向，GitHub status success。所有SEO/schema、Search移除、配送前台、Logo、預購UI與三盒組資料均在線上。[完整release QA](qa/2026-10-15-full-release/README.md)。後續文件提交只補證據，程式同6ac2081。
- 驗證：check0 errors/7既有warnings、API37、E2E16、Shopify11、SEO7、GA4 8；正式56頁/43資產/12控制路徑0錯誤，12組zh/en桌機手機UI、Logo、真實cart CRUD/hosted account redirect通過。測試車清空，無訂單/付款/寄信。
- 庫存表：前8款Hayward/線上合計3/0/1/58/4/2/2/0保持正確；10款allocation已寫入。使用者確認聖誕心意禮三盒一組US$60、200組，已同步五款variant售價、雙語規格、共6包。兩款Christmas仍未Headless發布，未新增現貨或混搭variants。[庫存QA](qa/2026-10-15-inventory-alignment/README.md)。
- 配送：Hayward default/online，SGV/Fremont不配送，SGV現場銷售；本土48州+DC、滿199免運、AK/HI/軍郵不寄，Shopify及前台均一致。[配送QA](qa/2026-10-15-shipping-alignment/README.md)。
- 同事整合保留cart恢復/quantity/錯誤同步與測試；沒有恢復舊本機預購扣額度。mock只用loopback與測試token。正式會員仍Shopify hosted。test build與production build不能並行（同在.next）。
- Logo錯誤是沖泡動畫passive cleanup晚於首頁layout refresh，已改layout cleanup；另採用同事自架127.0.0.1英文rewrite marker修正（僅非Vercel），不是同一根因。[Logo QA](qa/2026-10-15-logo-navigation/README.md)。
- PLAN已完成、queue空。本機3026保留可檢視；brew-cup/3027與release工作樹均保留。使用者瀏覽器購物車未清除。以下段落保留歷史背景，以本節及最新Git讀回為準。

## 已驗證：結帳 Logo 返回正式首頁（2026-10-15）

- 使用者要求修正結帳 Logo 返回舊網站。檢查時，active Shopify theme `187176714604`（Updated copy of Balance）的 `layout/theme.liquid` **原本已存在** index → `https://www.charmvilla.com` redirect；本輪沒有修改主題、DNS、商店 primary domain 或結帳設定。
- 原生 Logo href 仍是 Shopify primary domain `https://account.charmvilla.us/`，瀏覽器執行 redirect 後回到正式 www 首頁。從全新獨立購物車實際點擊 **Shop Pay accelerated checkout** 與 **Guest checkout** Logo，兩者均到 `https://www.charmvilla.com/`。不要只憑 href 是 account 網域便判斷仍有錯誤。
- 未付款／建單／退款；獨立測試購物車已清空（quantity 0）、含 key 的暫存檔已移除。前輪 SEO 未提交／未部署狀態不變。[結帳 Logo QA](qa/2026-10-15-checkout-logo/README.md)。

## 全站 SEO／schema（2026-10-15；已隨6ac2081發布）

- 使用者指定 AgricIDaniel/claude-seo 優化全部頁面並建立正確 business／entity schema；最初完成本機實作與驗證，後經使用者明確授權，已隨6ac2081 commit/push並部署。
- 基準 `main`／`origin/main` 為 `2232e74`，初始乾淨。現在未提交 diff 為這次 SEO；不覆蓋或當成已發布。既有 `.claude/worktrees/brew-cup` 與 port 3027 沒有動。
- 完成 56 個雙語頁面的 metadata、OG／Twitter，及 `OnlineStore`（Haoying LLC）、`Brand`、`WebSite`、各頁型／麵包屑／分類清單／Product／逐 variant Offer／Article／台日 Store 的 JSON-LD。美國僅線上銷售；門市沒有掛成美國經銷商分店。日本官網品牌創立年份與核准 About 不同，schema 省略有爭議年份。
- 實作入口：`src/lib/seo/{metadata,schema}.ts`、`src/components/seo/JsonLd.tsx`；`catalog-data.ts` 新增 `scheduledPreOrder` 區分明確預購與 BackOrder，保留原有 UI 行為。官方 logo 的 schema 版本只補白底留白，原圖保留。
- Node 24 `npm run check` 通過（0 errors／7 原有 warnings）；SEO 7/7、Shopify 8/8；56 URL、43 資產、12 控制路徑無錯誤；Schema.org 驗證器 0 errors／0 warnings；1440／390 中英文、reduced-motion、鍵盤與 Ego 導覽通過。
- [完整 QA／來源](qa/2026-10-15-seo-schema/README.md)、[entity 決策](qa/2026-10-15-seo-schema/SCHEMA-REPORT.md)、[JSON-LD 樣本](qa/2026-10-15-seo-schema/generated-schema.json)。本機 production server 在 port 3026 供檢視，實際部署仍是下方已發布版本。

## 接手時先確認

- 2026-10-15 沖泡區整合：`main` 在 `e83cc1b` 之後多了 `fe38a98`（merge `brew-cup-scroll`）、`297936e`（agent 文件整理）與沖泡區調整 commit。push／部署結果以下方「最近已交付」與 [沖泡區整合 QA](qa/2026-10-15-brew-cup-integration/README.zh-TW.md) 為準；接手時仍要 `git fetch` 回讀。
- `origin` fetch／push：`https://github.com/tentenco/charmvilla_shopify_official.git`。Vercel 專案名稱仍是 `tentenco/charmvilla-demo2`，不可因 Git repo 改名就另建部署專案。
- `.claude/worktrees/brew-cup`（分支 `brew-cup-scroll`、`c8380b9`）已於 2026-10-15 合併進 `main`（`fe38a98`）。工作樹、分支與其 dev server（port 3027）本輪沒有刪除；清理前先確認沒有其他執行者，這不是刪除指示。
- Node 以 `.nvmrc` 的 24 為準；本輪 shell 為 22.23.1，替代執行方式見 [VERIFY.md](agent/VERIFY.md)。不要沿用另一台機器的路徑。
- 既有本機測試使用 port 3026；動服務前先查證。使用者的 localhost 購物車要保留。

## 最近已交付：正式站、Shopify、GA4、SEO

正式站：<https://www.charmvilla.com/>。英文無前綴、中文 `/zh`；結帳測試入口：<https://www.charmvilla.com/zh/products/kyoto-gift-box>。

2026-10-15 已依使用者授權正式上線。當時核對 www／apex 都指向既有 Vercel 專案，沒有更動 DNS；`main` push 會觸發 Production。最後一次應用程式驗證的部署是 `dpl_B3uNgcUTgd2eZhcu8K8K4YAQrgd8`（2026-10-15 05:11，來源 `864f7a0` 沖泡區整合，READY，www／apex alias 已指向；正式站 zh／en 商品頁實際捲動到 stage 4，見整合 QA）。之前的 `dpl_HkGe1sYsA6Z2277GYwErpRdbY7mt`（`548a52a`）是 Shopify 上線版。現在的線上部署仍須即時回讀，不能從這些 ID 推測。

| 已交付內容 | 核對結果與證據 |
| --- | --- |
| 商品與結帳 | 14 商品／35 variants 對齊；商品、價格、庫存與購買資格跟隨原 Shopify，照片保留 demo2 Visual；[整合契約](shopify-integration.md) |
| 繁中 CMS | 14 商品、28 個原生商品翻譯、33 個資源涵蓋 37 個選項標籤、14 個中文 CMS 欄位；[遷移說明](shopify/chinese-copy-migration.md)、[中文 QA](qa/2026-10-14-shopify-chinese/README.md) |
| GA4 | `G-D3YCFQMZ2W`；property `559053952`、stream `16130398768`；checkout pixel `217153900` 已 connected。購買重要事件、營收／轉換率、購物／結帳漏斗、同意與跨域已配置；[事件契約](analytics/ga4-tracking-plan.md) |
| Search Console | 連結 GA4；sitemap Success，56 URLs；首頁與中文京都頁 request indexing 成功。提交不等於 Google 已收錄；[上線 QA](qa/2026-10-15-production-launch/README.md) |
| 核准圖片 | 保留遠端 `4b1e83a`、`860e631` 的主圖清晰度調整；桌機主圖原始 WebP、手機／縮圖最佳化；[圖片 QA](qa/2026-10-14-product-image-clarity/README.md) |
| 沖泡區固定杯子（2026-10-15） | 商品頁「沖泡方式」一只線稿杯子釘在旁邊、隨五步累積，最後交棒給核准照片（Daily Harvest「What's in the cup」方向，研究在 `10-14-charmv-landing-try/reports/`）。合併 `brew-cup-scroll` 後依 Ego Lite 檢視微調：桌機軸線起點 60%、照片交棒 3.6→4、照片 104%→100% settle。10 個茶禮盒 × 中英文、390／1024／1440、reduced-motion 驗證；[整合 QA](qa/2026-10-15-brew-cup-integration/README.zh-TW.md)、[分支 QA](qa/2026-10-14-brew-cup-scroll/README.zh-TW.md) |

Git 證據：`c767233` Shopify／中文／GA4，`96e9207` 整合遠端圖片調整，`548a52a` 追蹤網址保護及線上驗證，`e83cc1b` 最終發布文件，`fe38a98` 合併沖泡區分支，`297936e` agent 文件整理，其後的沖泡區調整 commit 見整合 QA。歷史內容可從 Git 讀取，不另複製舊 handoff。

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
| 商品頁沖泡區 | `src/components/catalog/TeaPages.tsx`、`BrewCup.tsx`、`brew-drawing.tsx`；`src/lib/motion/animations.ts` `brewProcess()` 輸出 `--brew-stage` 0→4；`src/app/globals.css` `.brew-*`／`.bc-*`；步驟資料在 `src/data/tea-gifts.ts` `brew`，中文由 `catalog-data.ts` 合併。無 JS／reduced-motion 只顯示照片 |
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

- 兩款 Christmas 商品未開 Headless；保留展示但不可購買。最新使用者已明確指定小盒改為三盒一組，共200組；每組US$60已依使用者確認寫入，取代之前單盒規則。
- Joyful Reunion 缺 Pink／Blue 專用照片，使用共用核准圖庫；四款 UNLISTED 工藝商品維持展示模式。
- 商品中文已遷移，品牌／News／政策頁未遷 CMS；英文一般編輯內容仍用既有來源。
- Shopify CLI 曾安裝 4.9.3，未建立該商店 CLI auth；Headless API／MCP 不依賴它。MCP 歷史 handshake 成功不等於目前 session 已載入工具。
- 上線時 npm audit 曾列 7 個既有 high advisories；目前情況須重新查證，不為文件任務執行 `audit fix --force`。
- [TASKS.md](../TASKS.md) 有上線前的價格／預購／帳戶假設；它是公開頁面內容，不是目前待執行任務。需更新時另按內容範圍核對，不能照舊清單改商店。

本輪 Agent 工作區整理的結果與驗證見 [PLAN.md](agent/PLAN.md)。後續發布依當次使用者指示，先核對 Git、專案與環境；不要把 push 當備份。
