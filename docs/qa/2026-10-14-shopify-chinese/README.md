# 繁體中文遷移驗證

日期：2026-10-14。EGO Lite TaskSpace40，本機localhost:3026，來源demo2。

- Shopify讀回：14商品的28個原生名稱／介紹翻譯、14個CMS JSON欄位皆與遷移清單相同；英文原文、handle、status、35個variants、SKU、價格及庫存無變化。見 [migration-result.json](migration-result.json)。
- 原生選項翻譯33個資源涵蓋37個標籤（含共用顏色metaobjects），全部讀回核對，英文原始選項無變化。見 [option-translations.json](option-translations.json)。
- 實際瀏覽器逐頁比對14個商品的中文介紹、規格值、故事、茶款介紹與沖泡步驟，全部0個缺漏段落；0破圖、0水平溢出、0runtime／failed-request錯誤。見 [browser-copy-report.json](browser-copy-report.json)。
- 京都桌機CSS viewport1440×1000，原中文介紹、保存期限、故事與US$60正常。[截圖](kyoto-zh-desktop.png)。
- 京都手機CSS viewport390×844，reduced-motion、方向鍵切換茶款、US$60和加入購物車按鈕正常，無水平溢出。[截圖](kyoto-zh-mobile.png)。
- 京都英文頁確認仍為Shopify原英文介紹，價格US$60；本輪沒有用中文覆寫英文。
- `npm run check`通過：0 lint errors／7既有warnings、TypeScript及production build成功。`shopify:test` 8項通過。
- 官方Dev MCP驗證本輪GraphQL操作成功；第一次讀回時發現未發佈語系的Product.translations為空，改以translatableResourcesByIds讀取後全部驗證通過。沒有將locale發佈作為繞過方式。
- 本輪沒有下單、付款、寄信，保留使用者先前建立的測試購物車；未推送或部署網站。Shopify寫入範圍限中文內容、其CMS定義與必要語系／app權限設定。
