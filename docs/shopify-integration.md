# Shopify Headless 開發與資料來源

更新：2026-10-15。本文件取代舊的「本機價格／預購額度優先」串接規則。

## 2026-10-15 更新：預購獨立批次

使用者已確認按原表格啟用10款新預購額度，無現貨也可預購。每款增加1個獨立tracked/DENY SKU，各茶／盒蓋以原生PRE_ORDER selling plan共用它；ON_SALE在訂單成立時占用額度。原商品／variant／價格／文案／現貨保留，前台仍用原身分配圖與選項，cart轉換成預購SKU＋plan。`src/data/shopify-preorders.json`記錄實際GID；即時數量及價格來自Shopify，`/api/preorder`不快取。

新批次只Headless02發布。團圓Gold only、聖誕心意禮200組×3盒。App新版`headless-preorder-batch-2026-10-15`補write_purchase_options/write_publications/read_shipping，保留既有secret；實際23 scopes。以下「18 scopes／未改庫存」段落是前階段連線歷史。

操作／取消回補／改價同步／停單與限制請見[預購後台管理](shopify/preorder-batch-2026-11.md)，驗證見[本輪 QA](qa/2026-10-15-preorder-batch/README.md)。此段優先於下方舊的商品現貨／未發布狀態表。

## 目前這台 Mac 的連線狀態（2026-10-15 登入後重查）

- root 已用使用者登入的既有 **CHARM VILLA Headless CMS** client credentials 與 **Charmvilla Headless 02** Storefront token 接通真實商店；僅存 ignored `.env.local`、0600 權限。沒有輪替密鑰或更動 Vercel 環境。
- `npm run shopify:mcp:check` 已通過 transport、工具清單、商店網域與18個實際授權 scopes；locations／團圓金色庫存讀取成功。官方 Dev MCP 提供文件；商店 MCP 提供 query、限定商品 CMS metafield 更新及庫存修正。
- App 新版本 `headless-mcp-inventory-2026-10-15` 僅新增 `read_locations,write_inventory`。經 Dev Dashboard Install app → Charmvilla → Update data access 升級既有安裝，保留其他權限、URL、憑證與所有商店資料。
- 庫存工具要求實際 variant/location、舊數量 `expectedQuantity` 與 UUID `idempotencyKey`，用 API 2026-10 `changeFromQuantity` 原子比對。CMS 工具限已映射商品的 `custom` metafield，要求明確 `compareDigest`（新建為 null）。不提供任意 mutation、圖片覆蓋、價格／發布／配送／金流操作。
- 4份讀寫 GraphQL 均以真實 API schema 驗證，5項隔離測試通過；沒有為測試而修改真實商品或庫存。新 agent session 會載入工具；舊 session 可透過 MCP SDK 驗證但不會自動新增工具。
- 本機 commerce 已設定 Shopify，需用 Node24 build/start；本輪完整網站驗證見後續發布 QA。詳細 MCP 證據見 [連線 QA](qa/2026-10-15-shopify-mcp-connected/README.md)。

## 已連接的環境

- Git remote：`https://github.com/tentenco/charmvilla_shopify_official`；本機 `main` 追蹤 `origin/main`。
- Shopify Admin：<https://admin.shopify.com/store/charmvilla/>。
- 經 API 驗證的商店網域：`zcs0bg-10.myshopify.com`；店名 Charmvilla，貨幣 USD，API `2026-10`。
- Storefront：沿用既有 Headless 管道的 **Charmvilla Headless02**。
- Admin：新建並安裝 **CHARM VILLA Headless CMS**，Dev Dashboard app ID `435346210817`；目前版本 `headless-mcp-inventory-2026-10-15`（保留 CMS／翻譯，補上倉庫讀取與庫存寫入）。
- App 使用 client credentials grant；伺服器在 token 到期前自動換發，不把 Admin 憑證傳給前端。
- 會員入口導向商店現有 Shopify hosted customer accounts：`https://shopify.com/98570830188/account`。本次沒有啟用舊版密碼會員流程。
- 結帳使用 Storefront Cart 回傳的 `checkoutUrl`，已確認導向 `account.charmvilla.us`。
- 2026-10-15 結帳 Logo 已驗證：原生連到 `account.charmvilla.us/`，現行 Shopify 主題首頁既有 redirect 導回正式 `https://www.charmvilla.com/`；Shop Pay 與 Guest 實際點擊皆通過。本輪未改遠端設定，詳見 [Logo QA](qa/2026-10-15-checkout-logo/README.md)。

## 來源契約

| 內容 | 唯一依據 | 實作位置 |
| --- | --- | --- |
| 商品照片、各角度、情境照與版面 | [現有 Visual](https://charmvilla-demo2.vercel.app/) 與專案既有影像 | `src/data/catalog.ts`、`public/media/` |
| 商品內容、規格、故事、選項、SKU | 原 Shopify 商品、custom metafields、translations | `src/lib/shopify/catalog.ts`、`catalog-data.ts` |
| 售價、購買資格、可用庫存 | Shopify Storefront，US market；未發佈商品僅從 Admin 讀取資料，不能購買 | 同上、`/api/products` |
| 預購 campaign 與雙語付款／出貨說明 | Shopify merchant-owned `custom.preorder_details` JSON，依使用者 2026-10-15 截圖恢復 10 款原預購商品；`enabled: false` 可停用 campaign | `catalog-data.ts`、`AddToCart.tsx`；不更動庫存、價格或管道 |
| product / variant 身分 | Shopify GID；不得用陣列索引猜配 | `src/data/shopify-map.json` |
| 結帳價格、折扣、庫存驗證、稅金、運費 | Shopify hosted checkout | `/api/cart` |

商品 SSR 每次讀取 Admin 內容與 Storefront 價格／庫存，React cache 只合併同一 request 的讀取。商品頁再每 30 秒／視窗重新取得焦點時更新價格和庫存（10 秒內共用請求）。無法確認庫存時停用加入購物車；不以本機預購額度放行。Shopify 對購物車數量與最終結帳再次驗證。

`shopify-products.json` 是唯讀同步的非機密商品快照，用於既有同步型錄與選項影像對照，不作為 live commerce 的庫存備援。Live 模式缺少 Admin 或 Storefront 憑證會報錯。超過每個商品 100 個 variants／metafields 時會明確要求補上分頁，避免截斷後悄悄顯示部分商品。

## 商品對照

價格為 2026-10-14 查證記錄，實際畫面以即時 Shopify 回應為準。35 個 variants 的完整 GID 見 mapping JSON。

| 專案 slug | Shopify handle／名稱 | 已對齊的重點 |
| --- | --- | --- |
| reunion-paper-gift-box | joyful-reunion / Joyful Reunion | 15 入；前台依2026-10-15指示只販售Gold，Pink／Blue選單隱藏；原Shopify規格保留、價格庫存即時讀取 |
| year-of-plenty-gift-box | abundance-prosperity-lunar-new-year-gift / Abundance & Prosperity | 18 入、US$220、目前無庫存 |
| blossoming-prosperity-gift-box | prosperity-in-bloom-lunar-new-year-gift / Prosperity in Bloom | 18 入、US$220 |
| kyoto-gift-box | kyoto-artisanal-reserve-6-ct / Kyoto Artisanal Reserve | 6 入、US$60、4 茶款；東方美人目前無庫存 |
| spring-dawn-gift-box | spring-awakening-12-ct / Spring Awakening | 12 入、頭等玫瑰 US$230／參等東方美人 US$260，各 Blue／Pink |
| winter-blossom-gift-box | snowy-twilight / Snowy Twilight | 12 入、頭等玫瑰 US$230／參等東方美人 US$260 |
| orchid-gift-box | royal-orchid-gold / Royal Orchid | 18 入、頭等玫瑰 US$300／參等東方美人 US$340，各 Gold／Pink；Pink 目前售罄 |
| purple-butterfly-gift-box | sapphire-wings / Sapphire Wings | 18 入、貳等東方美人、US$425、目前無庫存 |
| christmas-gift-box | christmas-edition-12-count / Christmas Edition (12-count) | 12 入、US$120、3 茶款 × Blue／Orange；Headless 未開放 |
| snowflake-gift-box | christmas-edition-2-count / Christmas Charming Gift (Limited Edition) | 使用者2026-10-15確認三盒一組、每盒2入／共6入、US$60、5茶款；allocation共200組；Headless未開放 |
| cloud-coaster | coaster / Cloud Coaster | UNLISTED；沿用展示商品狀態，不顯示購買按鈕 |
| bird-chopstick-rest | songbird-chopstick-rest / Songbird Chopsticks Rest | UNLISTED；沿用展示商品狀態 |
| ginkgo-teaspoon-gift-box | tea-spoon / Ginkgo Style Tea Spoon | UNLISTED；沿用展示商品狀態 |
| wooden-chopsticks | chopsticks / Hinoki Wood Chopsticks | UNLISTED；沿用展示商品狀態 |

### 影像與內容限制

- 本次沒有新增、替換或匯入 Shopify 影像；`public/` 無修改。
- 有明確身分的盒色照片按茶款＋盒色配對，即使 Shopify 改變 variant 排序也不會換錯。Christmas 的既有 Stocking 圖對 Blue、Candy Cane 圖對 Orange。
- Joyful Reunion 的既有主圖是金黃盒蓋，尚無可確證的 Pink／Blue 專用照片；保留共用圖庫，不能把它當作已完成所有盒色實拍對照。照片清單不會自動覆蓋 Shopify 媒體。
- 依使用者補充指示，已把 demo2 的14個商品繁體中文遷入 Shopify：28個原生 title／body_html 翻譯、33個原生翻譯資源涵蓋37個選項標籤（含共用顏色 metaobjects），以及14個 `custom.headless_copy_zh_tw` CMS欄位。中文頁的介紹、規格、故事、茶款介紹與沖泡步驟均讀 Shopify；來源與調整清單見 [中文遷移說明](shopify/chinese-copy-migration.md)。
- 原有中文茶葉介紹與沖泡圖文已存入商品CMS欄位；影像仍用本機核准資產。英文一般編輯內容及 About／News／政策頁維持既有來源，未做全站CMS搬遷。
- Shopify 商品本身若有文案錯誤（例如部分木製商品的保養段落仍寫 tea spoon），應由商店修正；本次不自行改寫原始事實。

## 本機使用

使用 Node 24（`.nvmrc`）：

```sh
npm ci
npm run dev -- --port 3026
npm run shopify:sync
npm run shopify:test
npm run shopify:verify
npm run check
```

- `.env.example` 記錄必要鍵名。真實值已存放忽略的 `.env.local`（檔案權限 0600），不可提交或貼到對話。
- `SHOPIFY_CLIENT_ID`、`SHOPIFY_CLIENT_SECRET` 為 server-only；`SHOPIFY_ADMIN_ACCESS_TOKEN` 僅供已有 legacy token 的環境選用。
- `NEXT_PUBLIC_COMMERCE_MODE=shopify` 控制購物車模式；切換後需重新啟動／建置。
- `shopify:sync` 只讀 Shopify，更新 mapping 和快照，不更新任何照片、庫存或商品。
- `shopify:verify` 預設使用 `http://localhost:3026`，可用 `SHOPIFY_VERIFY_URL` 改寫。會新增／增減／移除測試購物車商品，不建立訂單、會員或寄信。
- 新增商品須先查證 Shopify product GID、加入 mapping，選定現有核准影像，再同步；不自動匯入未知商品。

## MCP 與開發工具

已設定兩個 stdio servers：

| Server | 功能 | 配置 |
| --- | --- | --- |
| shopify-dev-mcp | Shopify 官方文件、API schema、GraphQL 驗證 | `npx -y @shopify/dev-mcp@1.16.0` |
| charmvilla-shopify | 商店唯讀查詢＋限定商品 custom metafield CAS 更新＋庫存 CAS 更新 | `node scripts/shopify/mcp.mjs` |

專案配置位於 `.mcp.json`（Claude）和 `.codex/config.toml`（Codex）；此 Mac 的 Codex 亦已登錄絕對路徑。重開 agent session 後工具才會自動出現在新 session。兩個 server 都已用 MCP SDK 完成 handshake／工具呼叫，官方 server 已驗證實際 Storefront query。

`shopify_admin_query` 使用 GraphQL AST 限制單一 query。兩個獨立寫入工具只在使用者具體指示的商品／欄位／數量範圍內操作：`shopify_set_inventory` 與 `shopify_set_product_metafield`。先讀現況，保留舊數量／digest，再寫入；遇到並行衝突需重新讀取並釐清，不能跳過比較。網路不確定時不自動重送，庫存重送必須沿用同一 key 與參數。庫存 mutation 成功而 readback 失敗會保留 receipt 並明示 readbackError，不謊報整體失敗後重複扣加庫存。

原16項 scopes 均保留，新增 `read_locations,write_inventory`；權限存在不代表可以任意變更商店。真實數量與倉庫需使用者／庫存系統提供，禁止用舊預購額度或其他顏色的數量推算。

Shopify CLI 已安裝（4.9.3）；本次沒有建立 Charmvilla CLI store auth session，Headless Next.js 開發透過上述 API 憑證運作，不依賴 Theme／Hydrogen CLI 登入。官方 AI Toolkit plugin 未列於此環境的 marketplace，已採官方 Dev MCP 替代。

## 驗證與部署狀態

見 [初次整合 QA](qa/2026-10-14-shopify-headless/README.md) 及 [中文遷移 QA](qa/2026-10-14-shopify-chinese/README.md)。實際 Shopify API、MCP、購物車與 hosted checkout 頁面已驗證，未按付款、未建立訂單。2026-10-15 已依使用者授權正式上線至 www.charmvilla.com，Vercel production／preview 環境已設定 server-only 憑證；GA4 與結帳 pixel 見 [追蹤契約](analytics/ga4-tracking-plan.md)，發布證據見 [上線 QA](qa/2026-10-15-production-launch/README.md)。

## 同事checkout-tests-wip整合（2026-10-15）

- `npm run test:api`、`npm run test:e2e`、`npm test`執行隔離loopback mock；模擬購物車、傳統會員API/備用UI、newsletter及即時商品CMS/庫存。網站正式會員仍轉Shopify hosted accounts。
- 測試讀目前核准商品快照作身分/內容fixture；可售數量使用測試情境。`CV_TEST_BUILD`僅接受`.next/test-shopify`/`.next/test-local`且Vercel忽略。完整HTTP商店origin僅在本機test build接受127.0.0.1；所有真實SHOPIFY憑證/GA欄位明確清空，避免Next重新載入.env.local。
- tests與正式build都寫.next子目錄，必須循序執行；`-- --no-build`僅適用程式未改的相同測試build。
- 合併保留失效購物車恢復、拒絕變更時回傳即時cart、整數1–99驗證、上限UI、會員錯誤分類與隱私文案；GA4仍依成功的實際cart差額追蹤，結帳更新中不可跳轉。
- 舊的本機預購額度/訂單扣量模型已被Shopify即時庫存取代，未恢復。未發布Christmas商品保持不可買；三盒組每組60由Shopify實際資料決定。
