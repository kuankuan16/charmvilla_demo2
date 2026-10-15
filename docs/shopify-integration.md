# Shopify Headless 開發與資料來源

更新：2026-10-14。本文件取代舊的「本機價格／預購額度優先」串接規則。

## 已連接的環境

- Git remote：`https://github.com/tentenco/charmvilla_shopify_official`；本機 `main` 追蹤 `origin/main`。
- Shopify Admin：<https://admin.shopify.com/store/charmvilla/>。
- 經 API 驗證的商店網域：`zcs0bg-10.myshopify.com`；店名 Charmvilla，貨幣 USD，API `2026-10`。
- Storefront：沿用既有 Headless 管道的 **Charmvilla Headless02**。
- Admin：新建並安裝 **CHARM VILLA Headless CMS**，Dev Dashboard app ID `435346210817`；目前版本 `headless-zh-tw-2026-10`（新增產品 CMS、翻譯及語系權限）。
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
| reunion-paper-gift-box | joyful-reunion / Joyful Reunion | 15 入、US$170、Gold／Pink／Blue；目前僅 Blue 可售 |
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
| charmvilla-shopify | 此商店的 Admin GraphQL 唯讀查詢：商品、庫存、CMS pages／blogs／metaobjects | `node scripts/shopify/mcp.mjs` |

專案配置位於 `.mcp.json`（Claude）和 `.codex/config.toml`（Codex）；此 Mac 的 Codex 亦已登錄絕對路徑。重開 agent session 後工具才會自動出現在新 session。兩個 server 都已用 MCP SDK 完成 handshake／工具呼叫，官方 server 已驗證實際 Storefront query。

商店 MCP 使用 GraphQL AST 限制為單一 query，拒絕 mutations。App 的 CMS write scopes 供後續授權開發使用，不代表 MCP 會自動更改或發佈內容。授權 scopes：`read_products,write_products,read_translations,write_translations,read_locales,write_locales,read_inventory,read_content,write_content,read_metaobjects,write_metaobjects,read_metaobject_definitions,write_metaobject_definitions,read_customers,write_customers,read_orders`。Customer scopes 支援現有 newsletter API，但本次未寄送或做實際訂閱測試。

Shopify CLI 已安裝（4.9.3）；本次沒有建立 Charmvilla CLI store auth session，Headless Next.js 開發透過上述 API 憑證運作，不依賴 Theme／Hydrogen CLI 登入。官方 AI Toolkit plugin 未列於此環境的 marketplace，已採官方 Dev MCP 替代。

## 驗證與部署狀態

見 [初次整合 QA](qa/2026-10-14-shopify-headless/README.md) 及 [中文遷移 QA](qa/2026-10-14-shopify-chinese/README.md)。實際 Shopify API、MCP、購物車與 hosted checkout 頁面已驗證，未按付款、未建立訂單。2026-10-15 已依使用者授權正式上線至 www.charmvilla.com，Vercel production／preview 環境已設定 server-only 憑證；GA4 與結帳 pixel 見 [追蹤契約](analytics/ga4-tracking-plan.md)，發布證據見 [上線 QA](qa/2026-10-15-production-launch/README.md)。
