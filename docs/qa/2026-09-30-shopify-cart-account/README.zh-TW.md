# Shopify 商務框架：購物車、會員頁（2026-09-30）

## 成品／交付檔
- 購物車：頁首購物袋按鈕（含數量）→ 右側抽屜；商品頁「加入購物車」（數量步進）與底部 dock 快捷鈕；抽屜內數量 ±、移除、小計、運費說明（台灣宅配 120、滿 2,000 免運，海外依結帳頁）、「前往結帳」。
- 會員頁 `/account`：登入、註冊（姓名、Email、手機、密碼、行銷同意）、忘記密碼；登入後：個人資料、地址簿（新增／預設／刪除）、訂單（狀態、品項、Shopify 訂單狀態頁連結）、登出。選單與頁首人像圖示都連到這裡。
- 串接層：`src/lib/shopify/*`、`/api/cart`、`/api/account/*`；金鑰未填時 API 回 503 `not_configured`，前端顯示「將於 Shopify 串接完成後啟用」。
- 價格：16 款茶包禮盒帶官網售價（`src/data/official-prices.json`）；商品頁與卡片顯示 NT$。
- 待填：`.env`（`SHOPIFY_STORE_DOMAIN`、`SHOPIFY_STOREFRONT_ACCESS_TOKEN`、`NEXT_PUBLIC_COMMERCE_MODE=shopify`）與 `src/data/shopify-map.json`（各商品 handle／variant GID）。說明在 `docs/shopify-integration.md`。

## 已檢視／驗證（local 模式）
- `check.log`：0 錯誤（4 個既有 `<img>` 警告）；build 產出 `/account` 與 9 條 API 路由。
- API：`GET /api/cart` → `{configured:false}`；`POST /api/account/login` → 503 not_configured 訊息。
- Playwright：商品頁加入 2 件團圓桐木木盒 → 抽屜開啟、1 行、數量 2、小計 NT$ 3,360、頁首數字 2、localStorage 有紀錄；會員頁註冊表單送出顯示待啟用；手機抽屜；無 pageerror。截圖 `local/`。

## 限制與不宣稱
- 結帳與會員的真實流程要等 Shopify 商店建立、金鑰填入後才會運作；本次未連任何 Shopify 商店。
- 其他商品（真皮包、金飾、茶器、聖誕款）沒有售價，維持「欣賞與選購」與洽詢。
- 使用 Shopify「傳統客戶帳戶」API；若商店啟用新版客戶帳戶，登入需改為 Customer Account API 導向。
