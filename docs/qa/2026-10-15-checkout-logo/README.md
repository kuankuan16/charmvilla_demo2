# 結帳 Logo 返回正式網站驗證

2026-10-15。使用者提供 Shop Pay 截圖，要求點擊結帳頁 Logo 後回到正式網站 `https://www.charmvilla.com/`。

## 實際結果

**現在可正常回到正式網站。** 本輪檢查時發現現行 Shopify 主題已存在首頁 redirect，因此沒有重複修改商店設定或覆寫主題。已從全新、獨立的測試購物車實際測試兩個路徑：

| 結帳模式 | Logo 原生連結 | 點擊後最後網址 |
| --- | --- | --- |
| Shop Pay accelerated checkout（shop.app，對應使用者截圖） | `https://account.charmvilla.us/` | `https://www.charmvilla.com/` |
| Guest checkout（account.charmvilla.us） | `https://account.charmvilla.us/` | `https://www.charmvilla.com/` |

[去除 checkout key／token 的驗證紀錄](verification.json)。沒有填寫付款、送出訂單或退款；獨立測試購物車已用 Storefront API 清空、totalQuantity 0，暫存 checkout URL／cart key 檔已移除。沒有動使用者原有購物車。

## 來源與控制位置

- Shopify 商店 `charmvilla` 的 `shop.primaryDomain.url` 為 `https://account.charmvilla.us`。Shopify checkout 原生 Logo 不提供獨立 URL 欄位，CheckoutBrandingLogo API 也僅有 image／maxWidth／visibility；故原生 href 仍顯示 Shopify 網域。
- Active theme：`Updated copy of Balance`，theme ID `187176714604`。
- 在 Shopify Admin 的 Online Store → Themes → Edit code 開啟 `layout/theme.liquid`，本輪修改前即有以下導向：`request.page_type == 'index'` 時執行 `window.location.replace("https://www.charmvilla.com")`。
- 公開 `https://account.charmvilla.us/` 的 HTML 同樣回傳上述程式。實際瀏覽器確認 redirect 執行後到 www 正式首頁；只看 HTTP 200 或 Logo href 無法驗證最後目的地。
- [Shopify 官方 Headless redirect theme](https://github.com/Shopify/hydrogen-redirect-theme) 使用相同的 storefront redirect 原理。這次沒有更換為該主題、沒有發布新主題，也沒有更改 DNS 或 primary domain。

舊截圖本身無法證明目前仍發生錯誤；本輪沒有重現「停在舊網站」。若特定既有付款連結仍有問題，需另外取得該次實際最終網域與路徑，不能為修 Logo 任意改動結帳域名。

## 交付狀態

- Shopify 正式結帳：Shop Pay 與 Guest 的實際 Logo 點擊均通過。
- 遠端設定／主題修改：未執行（現況已正確）。
- Repository：本輪僅新增驗證與更新交接文件，前輪未部署 SEO 程式完整保留。
- Git commit／push／Preview／Production 程式部署：未執行；無需重建 Next.js。
