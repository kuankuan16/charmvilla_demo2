# Shopify Headless QA — 2026-10-14

環境：Node 24.18.0、Next.js 16.3.8，本機 `http://localhost:3026`，EGO Lite TaskSpace 38。原始 Shopify 商品／庫存未修改；只有必要 app 設定和測試購物車變更。

## 自動與 API 檢查

| 檢查 | 結果 |
| --- | --- |
| npm run check | lint 0 errors／7 既有 warnings；TypeScript、production build 通過 |
| npm run shopify:test | 6 pass：Shopify 取代價格／庫存、保留影像物件、聖誕2入單位、重排規格配圖、35唯一GID、中英盒色配圖及茶款獎項名稱 |
| npm run shopify:verify | Admin 店家身分／權限、CMS pages／metaobject definitions、14商品 API 通過 |
| Storefront cart | 新增1件→2件→讀取→移除；USD金額正確；測試車清空 |
| Invalid cart | 空 lines 回 400 |
| Hosted accounts | /account 回307，導向 Shopify 現有帳戶網址 |
| Official Dev MCP | SDK握手／learn_shopify_api／實際Storefront GraphQL驗證成功 |
| Project MCP | SDK握手／商店及CMS查詢成功；mutation遭拒 |
| Credential hygiene | .env.local 0600且忽略；候選Git檔與前端chunks未出現任何本機token／secret／client ID值 |
| Git / media | git diff --check 通過；public/零修改；未提交、推送或部署 |

Node 的純 TS adapter 測試會顯示 MODULE_TYPELESS_PACKAGE_JSON 提醒，但6項測試全數通過。沒有為消除提示而修改整個專案的模組模式。

## 實際瀏覽器

- 桌機英文 Kyoto：實際CSS viewport1440×1000；Rose US$60可加入1件、增加至2件後小計US$120。選 Oriental Beauty 顯示 Sold out且購買停用。
- 從購物車開啟真正Shopify hosted checkout，配送地址和付款區可見，Kyoto Rose2件與US$120正確；沒有提交付款或訂單。API測試車及瀏覽器測試車皆已清空。
- 手機中文 Royal Orchid：實際CSS viewport390×843；四款茶／盒色選項；粉紅款售罄且切換為既有粉紅盒照片。方向鍵切到參等東方美人／金色，價格US$340且可加入。
- 鍵盤：radio方向鍵能變更選項，圖庫按鈕Enter能切到下一張。
- Reduced motion：媒體偏好已實際模擬，圖庫切換後active slide opacity1、頁面內容可讀。
- API失敗：僅對本機/api/products以CDP阻擋請求，顯示「暫時無法確認庫存」並disabled；解除阻擋後reload恢復。
- 正常頁面：無水平溢出、已載入圖片無破圖、沒有Runtime.exceptionThrown或Network.loadingFailed。失敗測試只記錄預期的inspector阻擋。
- 商品詳細內容由Shopify英文原文提供；未宣稱完整中文翻譯。

## 畫面證據

- [Kyoto英文桌機](kyoto-en-desktop.png)
- [Orchid中文手機首屏](orchid-zh-mobile.png)
- [Orchid中文手機選項／售罄](orchid-zh-options-mobile.png)

EGO頁面zoom為80%；使用CDP設定後讀取innerWidth驗證實際CSS viewport。部分原生截圖帶有畫布留白，已裁至驗證的viewport尺寸；沒有修改網頁內容或商品影像。

## 未執行

沒有實際付款、下單、發送登入OTP、建立會員、訂閱email或更改商品／庫存。沒有部署至Vercel、設定DNS或遷移全部品牌／News／政策內容。照片缺口與商品發布限制見[整合文件](../../shopify-integration.md)。
