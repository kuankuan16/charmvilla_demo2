# Shopify 串接說明（框架已完成，等商店建立後填入）

## 需要填的值
| 位置 | 值 | 來源 |
|---|---|---|
| Vercel 環境變數 `SHOPIFY_STORE_DOMAIN` | `xxx.myshopify.com` | Shopify 後台網址 |
| Vercel 環境變數 `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | 公開 Storefront token | Shopify 後台 → 銷售管道 → Headless（或 Custom app）→ Storefront API |
| Vercel 環境變數 `NEXT_PUBLIC_COMMERCE_MODE` | `shopify` | 填完上面兩項後改為 shopify 並重新部署 |
| `src/data/shopify-map.json` | 每個可販售商品的 `handle` 與 variant GID（`gid://shopify/ProductVariant/…`） | Shopify 後台 → 商品 → 變體 |

## Shopify 後台要做的設定
1. **商品**：建立 16 款茶包禮盒（售價依 `src/data/official-prices.json`），之後聖誕款與其他商品照樣新增，再把 variant GID 填進對照表。
2. **Markets**：台灣（TWD）、美國（USD）、日本（JPY），各市場設定牌價、運費與稅金；結帳語言 zh-TW／en／ja。
3. **付款**：依市場啟用金流（Shopify Payments 若不適用台灣公司，則用第三方金流 app）。
4. **客戶帳戶**：使用「傳統客戶帳戶」（Email＋密碼），本站的登入／註冊／忘記密碼／個人資料／地址／訂單都走 Storefront API 的 customer 系列。若改用「新版客戶帳戶」，需改為 Customer Account API（OAuth 導向 Shopify 託管頁）。
5. **結帳品牌**：Shopify 後台 → 結帳 → 品牌設定（字標、色彩、字型），讓從本站導向的結帳頁一致。

## 程式對應
- `src/lib/shopify/`：`client.ts`（Storefront GraphQL）、`queries.ts`、`cart.ts`、`customer.ts`、`session.ts`（customerAccessToken 存 httpOnly cookie）。
- `src/app/api/cart`：GET／POST／PATCH／DELETE；`src/app/api/account/*`：register、login、logout、me、profile、recover、addresses。
- `src/components/cart/`：`CartProvider`（local／shopify 兩種模式）、`CartDrawer`（右側抽屜）、`AddToCart`、`CartButton`。
- `src/components/account/AccountClient.tsx` + `src/app/(catalog)/account/page.tsx`：會員頁。
- 未設定時：購物車以本站 TWD 售價運作、結帳按鈕停用；會員頁表單可看，送出時顯示「會員系統將於 Shopify 串接完成後啟用」。
