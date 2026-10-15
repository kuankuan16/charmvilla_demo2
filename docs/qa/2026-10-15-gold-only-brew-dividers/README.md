# 團圓僅金色與沖泡頭尾分隔線 — 2026-10-15

本輪使用者指定團圓只販售金色、暫時隱藏其餘顏色選單；並移除沖泡最上／最下橫線，維持中間分隔線、間距、底部對齊。

- 商品 adapter 用已驗證 Gold GID 過濾前台展示資料。沒有刪除 Shopify variants，沒有修改價格、庫存、配送、結帳；沒有從藍色3盒推算或移轉金色數量。
- 單款自動使用 Gold GID，沒有多餘選色步驟；價格、商品售罄標示、即時庫存API與schema都只依金色。金色仍為0，正確停用購買。若GID消失則不可購買，不能回退成藍色。
- 舊購物車的隱藏色款仍可辨識及移除，不刪使用者購物車；僅隱藏官網選單，不停用Shopify其他銷售管道。
- CSS只移除頭尾偽元素，步驟高度、padding、垂直進度線與pinning保持。
- Shopify adapter 13項測試通過：涵蓋雙語、反轉variant排序、金色0／有貨／GID消失、價格變動及其他商品不變。

Node24 npm run check通過（0 errors／7既有warnings）；相關購物車E2E7項通過（僅loopback mock）。Ego雙語1440/390×一般/reduced共8組通過，Gold唯一GID、0庫存禁購、鍵盤說明開關、中間4條橫線、頭尾無線、桌機底部0px、0 console/request/overflow。截圖已目視檢查。Production待推送回讀。
