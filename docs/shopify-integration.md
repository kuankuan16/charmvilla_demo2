# Shopify 串接說明（美國站，框架已完成，等商店建立後填入）

最後更新：2026-10-13。美國站只賣到美國、只用 USD；英文是預設語言（無前綴網址），中文在 `/zh`。

## 需要填的值
| 位置 | 值 | 來源 |
|---|---|---|
| Vercel 環境變數 `SHOPIFY_STORE_DOMAIN` | `xxx.myshopify.com` | Shopify 後台網址 |
| Vercel 環境變數 `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | 公開 Storefront token | Shopify 後台 → 銷售管道 → Headless（或 Custom app）→ Storefront API |
| Vercel 環境變數 `NEXT_PUBLIC_COMMERCE_MODE` | `shopify` | 填完上面兩項後改為 shopify 並重新部署 |
| `src/data/shopify-map.json` | 每個商品的 `handle` 與 variant GID（`gid://shopify/ProductVariant/…`） | Shopify 後台 → 商品 → 變體 |

不可捏造 GID。空字串代表「Shopify 還沒建立」，shopify 模式下該商品會顯示「暫時無法加入購物車」。

## 美國站上架的 12 個商品（`getProducts("en")`）
| slug | 選項（各自一個 variant） | 網站目前售價 |
|---|---|---|
| `reunion-paper-gift-box` | — | $170 |
| `year-of-plenty-gift-box` | — | $220 |
| `blossoming-prosperity-gift-box` | — | $220 |
| `kyoto-gift-box` | 4 種茶 | $60 |
| `spring-dawn-gift-box` | 2 種茶 × 藍／粉盒蓋 = 4 | $230／$260 |
| `winter-blossom-gift-box` | 2 種茶 | $230／$260 |
| `orchid-gift-box` | 2 種茶 × 金／粉盒蓋 = 4 | $300／$340 |
| `purple-butterfly-gift-box` | —（預購） | $425 |
| `cloud-coaster` | — | 仍是 NT$ 1,880，待客戶給美金價 |
| `bird-chopstick-rest` | — | 沒有價格，按鈕顯示「Price coming soon」並停用 |
| `ginkgo-teaspoon-gift-box` | — | 仍是 NT$ 760，待客戶給美金價 |
| `wooden-chopsticks` | — | 仍是 NT$ 680，待客戶給美金價 |

`shopify-map.json` 裡排在這 12 個後面的是美國站隱藏的台灣禮盒，保留 slug 以免日後恢復時找不到；不用在美國商店建立。

## 選項：每個選項一個 variant
有選項的禮盒（京都版、春曉、暮雪、蝴蝶蘭）每個選項價格或庫存不同，所以在 Shopify 要建成同一個商品底下的多個 variant，並把每個 variant 的 GID 填進 `variants`：

```json
"spring-dawn-gift-box": {
  "handle": "spring-dawn-gift-box",
  "variantId": "",
  "variants": {
    "First-Prize Rose Oolong Tea / Blue": "gid://shopify/ProductVariant/…",
    "First-Prize Rose Oolong Tea / Pink": "gid://shopify/ProductVariant/…"
  }
}
```

- `variants` 的 key 是英文商品頁顯示的選項文字（`product.giftBox.choices[].label`，英文版）。改選項文字時要一起改這裡。
- 沒有選項的商品只填 `variantId`。
- 舊格式 `{ handle, variantId }` 或直接一個 GID 字串仍可讀；有選項的商品只有在完全沒有 `variants` 時才退回用 `variantId`。
- 程式：`src/lib/shopify/variants.ts`（`variantFor` 選項 → GID、`productForVariant` GID → 商品＋選項，供購物車顯示名稱）。

## Line attribute（結帳頁、訂單、通知信看得到）
- 一律英文：選項以 `Tea`（有盒蓋顏色時 `Tea / Lid color`，包裝選項時 `Packaging`）加英文選項文字送出。
- 預購商品（目前紫斑蝶 `purple-butterfly-gift-box`，`preOrder: true`）加 `Pre-order: Yes`，讓倉庫分得出預購訂單。

## Shopify 後台要做的設定
1. **商品**：建立上表 12 個商品與選項 variant，售價用 USD，與網站顯示價一致（`src/data/tea-gifts.ts`、`catalog.ts`）。目前網站沒有向 Storefront 查詢商品價格與庫存，改價必須兩邊一起改。
2. **Markets**：只開「United States」，幣別 USD。程式建立購物車與會員登入時都會帶 `buyerIdentity.countryCode = "US"`。
3. **預購**：紫斑蝶要在 Shopify 設定可以在沒有庫存時繼續販售（「缺貨時繼續銷售」），或改用預購 app／selling plan。預計出貨日、是否先收全額、能否取消、與一般商品同車如何出貨，**要客戶決定**，決定前不要寫進網站或政策。
4. **稅金**：從加州出貨，用 Shopify Tax 或其他方式在結帳時計算；購物車已寫「Taxes are calculated at checkout.」。茶葉是否屬免稅食品要客戶的會計確認，不可由 agent 推測。
5. **付款**：Shopify Payments（美國）或客戶指定的金流。
6. **客戶帳戶**：使用「傳統客戶帳戶」（Email＋密碼），本站的登入／註冊／忘記密碼／重設密碼／帳號啟用／個人資料／地址／訂單都走 Storefront API 的 customer 系列。若商店只能用「新版客戶帳戶」，需改為 Customer Account API（OAuth 導向 Shopify 託管頁）。
7. **通知信連結**：後台 → 設定 → 通知 → 「客戶帳戶密碼重設」與「客戶帳戶邀請」，把按鈕連結改到本站：
   - 重設密碼：`https://<網站網域>/account/reset?url={{ customer.reset_password_url | url_encode }}`
   - 帳號啟用：`https://<網站網域>/account/activate?url={{ customer.account_activation_url | url_encode }}`
   - 也接受保留 Shopify 路徑的寫法 `/account/reset/<id>/<token>`、`/account/activate/<id>/<token>`（本站會以自己的網域重組連結送給 Shopify）。上線前要用真的測試帳號走一次。
8. **結帳品牌**：Shopify 後台 → 結帳 → 品牌設定（字標、色彩、字型），讓從本站導向的結帳頁一致。

## 程式對應
- `src/lib/shopify/`：`client.ts`（Storefront GraphQL）、`queries.ts`、`cart.ts`（含 `setBuyerIdentity`、`attachCustomer`、`STORE_COUNTRY = "US"`）、`customer.ts`（含 `resetByUrl`、`activateByUrl`）、`session.ts`（customerAccessToken 存 httpOnly cookie）、`variants.ts`（選項 ↔ variant）。
- `src/app/api/cart`：GET／POST／PATCH／DELETE；新建購物車時帶 country US 與已登入的會員。
- `src/app/api/account/*`：register、login（兩者登入後把瀏覽器裡現有的購物車綁到會員）、logout、me、profile、recover、reset、activate、addresses。
- `src/components/cart/`：`CartProvider`（local／shopify 兩種模式）、`CartDrawer`（右側抽屜）、`AddToCart`、`CartButton`。
- `src/components/account/AccountClient.tsx` + `src/app/[lang]/(catalog)/account/page.tsx`：會員頁。
- `src/components/account/AccountLinkForm.tsx` + `src/app/[lang]/(catalog)/account/reset|activate/[[...token]]/page.tsx`：重設密碼與帳號啟用頁。
- 未設定時：購物車以網站上的售價在瀏覽器裡運作、結帳按鈕停用；會員頁、重設密碼頁、啟用頁的表單可看，送出時顯示「會員系統將於 Shopify 串接完成後啟用」。
