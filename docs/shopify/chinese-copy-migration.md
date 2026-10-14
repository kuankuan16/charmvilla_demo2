# 繁體中文商品文案遷移 — 2026-10-14

使用者來源：<https://charmvilla-demo2.vercel.app/zh/products/kyoto-gift-box>。範圍為現有14個已對應商品；以原中文文案為來源，價格、variants、庫存與販售單位仍以Shopify為準。

## Shopify 中的存放位置

| 內容 | Shopify位置 | 前台讀取 |
| --- | --- | --- |
| 中文商品名稱、介紹 | 原生zh-TW `title`、`body_html` translations，共28筆 | `translatableResourcesByIds`，供頁面及metadata使用 |
| 茶款／盒色欄位及值 | 原生ProductOption／ProductOptionValue及共用顏色metaobject翻譯，33個資源涵蓋37個標籤 | Shopify保留原生翻譯；前台按目前variant身分顯示相同中文 |
| 中文規格、故事、茶款介紹、沖泡步驟、圖片說明 | 每商品 `custom.headless_copy_zh_tw`，共14欄 | 即時Admin metafields，轉為既有元件的props |
| 照片與版面 | 原專案核准資產 | 不匯入或修改Shopify圖片 |
| 售價、庫存、購買狀態 | Shopify既有產品／Storefront | 即時取值，中文CMS不能改價或放行缺貨 |

在Shopify商品頁底部的Metafields可找到已釘選的「繁體中文商品頁文案」，型別JSON。`version`、`locale`、欄位鍵與結構需保留；編輯故事、規格值或沖泡文字後，下次載入前台即可讀到。名稱與介紹應在原生翻譯中維護；CMS欄位中的title／description僅作未取得原生翻譯時的中文備援。

重要規格附有 `source.key/value`：若既有Shopify數值改變，前台會使用新值，不持續顯示舊中文數字。商品可選茶款與盒色永遠由即時variants產生。圖片說明以純文字呈現，不接受任意HTML執行。

一般選項／選項值的翻譯鍵為 `name`。7個顏色選項使用 Shopify taxonomy 關聯，必須沿 `linkedMetafieldValue` 翻譯顏色metaobject的 `label`；相同顏色會共用資源，因此37個標籤去重後為33個翻譯資源。

## 語系與權限

App版本 `headless-zh-tw-2026-10`（ID `1166892466177`）已啟用，既有安裝已更新權限。新增 `write_products,read_translations,write_translations,read_locales,write_locales`，供CMS欄位及中文翻譯使用。

`zh-TW` 已在商店啟用，仍為未發佈語系；沒有改變Online Store的公開語系、網域或預設英文。未發佈時 `Product.translations` 回空陣列，必須透過 `translatableResourcesByIds` 讀取已儲存翻譯。本機SSR與同步工具均使用後者，已實際讀回驗證，沒有為了讀取而發布整個商店語系。

## 來源與必要調整

- [完整原頁擷取](zh-TW-source.json)：14頁由EGO直接擷取，保留原文與來源URL。
- [實際遷移清單](zh-TW-migration.json)：每商品的copy及adjustments。不是前台資料來源，僅供重現與審查；前台從Shopify讀取。
- 保留原介紹、故事、保存期限、茶葉介紹、沖泡步驟及已核准圖片說明。
- 移除舊「預購剩餘100盒」、預購出貨日期／付款條件及聖誕到貨截止日；不把舊政策套用現行庫存。
- 聖誕小盒依Shopify為單盒2入；移除三盒組／混搭說法。Christmas盒色依Blue／Orange命名，照片仍按既有對照。
- 團圓依Shopify說明區分Gold／Pink／Blue的紙盒／桐木盒；不再把三款一律稱為桐木盒。
- 暮雪、春曉、蝴蝶蘭的東方美人名稱依Shopify補「參等獎」。
- 團圓與聖誕小盒缺乏Shopify依據的舊估計尺寸／重量保留於原始來源檔，沒有當作確定規格遷入。
- 其餘原中文段落在實際14個本機頁面完整比對，零遺漏。

## 工具與重新執行

需要Node24與既有.env.local。預設dry-run，只有明確 `--apply` 才會寫入；重跑會跳過已相同值，遇到權限、ID、分頁、型別或compareDigest衝突會中止。

```sh
npm run shopify:prepare-zh
npm run shopify:migrate-zh
npm run shopify:migrate-zh -- --apply
node scripts/shopify/migrate-zh-options.mjs
node scripts/shopify/migrate-zh-options.mjs --apply
npm run shopify:sync
npm run shopify:test
```

`prepare-zh` 由擷取檔和Shopify快照生成清單，使用前應先審查原文及差異。遷移前的商品／選項內容與原生翻譯備份寫入忽略的 `temp/shopify/zh-copy-before-*`、`zh-options-before-*`，不含憑證。重跑不是自動排程，不會用舊manifest覆寫商店日後的人工修改。

驗證腳本讀回原生翻譯與CMS JSON，並比較原英文、handle、status、variants、SKU、價格和庫存；沒有修改上述商務欄位。此次未處理About、News、全站政策或Shopify Checkout的介面翻譯。

官方API參考：[翻譯管理](https://shopify.dev/docs/apps/build/markets/manage-translated-content)、[translatable metafields](https://shopify.dev/docs/apps/build/markets/migrate-translatable-metafields)。所有本輪新增GraphQL查詢／mutation已經官方Dev MCP schema驗證。
