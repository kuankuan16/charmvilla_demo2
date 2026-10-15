# 預購 UI 恢復與 Shopify 設定核對（2026-10-15）

## 完成部分

- 依使用者[條件截圖](source-terms.png)與 Git `a5eb155`，恢復 10 款茶禮盒的預購資訊。歷史標籤元件未刪除；原因是 Shopify adapter 改讀遠端，而原商品缺少預購設定，中文遷移也移除了預購說明。
- 在 Shopify 建立 merchant-owned JSON definition `custom.preorder_details`，對 10 個已核對 GID 商品加入雙語付款／取消文字及 `2026-11-30` 出貨期限。只寫這個欄位；[之前](shopify-before.json)與[讀回](shopify-after.json)確認價格、庫存、inventoryPolicy、商品 status 均未變。未發布原本不可售的 Christmas 商品，未恢復三盒組或舊固定額度。
- 前台讀此 Shopify 欄位，恢復預購價格標籤、分類卡標籤與「加入預購」。購買按鈕前顯示出貨時間，native details 可展開付款／取消條件及同語系政策連結；售罄選項與未開放商品仍禁止下單。
- 實測時另發現購物車用舊型錄快照判斷預購，導致已加入預購的行項目沒有提示；改讀該 Shopify line 的 `Pre-order=Yes` attributes。實際加入、增量、移除及重新讀取均正常，未建立訂單，測試購物車已清空。

## 驗證

- Node 24 `npm run check` 通過，0 errors、7 原有 lint warnings：[原始檢查](check.log)、[購物車修正後檢查](cart-check.log)。
- Shopify 11/11、SEO 7/7、analytics 8/8；[preflight](preflight.log)、[SEO](seo.log)、[analytics](cart-check.log)。新增測試涵蓋雙語、所有商品價格／庫存／發佈資格不變、明確停用、缺少中文條件時拒絕不完整資料。
- [20 個雙語商品 URL](all-products.json)；[中英文 1440×900／390×844](ui-regression.json)：鍵盤展開、售罄切換、價錢與 CTA、政策連結、無破圖／溢出。已檢視中文桌機與英文手機截圖。
- [庫存 API 失敗](outage-regression.json)：保留說明、停用購買，沒有以預購標記繞過庫存檢查。[實際購物車 UI](cart-ui.json)、[Shopify API CRUD](commerce.log)、[browser errors](browser-errors.json)皆正常。
- 新 GraphQL query／definition／metafieldsSet 均經 Shopify Dev MCP 2026-10 schema 驗證；沒有新增套件。

## 配送設定尚待使用者回答

[Shopify Admin 核對](settings-audit.json)：下單時自動 capture 已設定；取消規則是 Cancel until fulfilled。但 hosted Return/refund 與 Shipping policies 尚未設定，SGV Pop-up 有不分金額的免費 Standard rate；Hayward 有 UPS 即時計算與滿 US$199 免運。尚未核對各 zone 的州／軍郵排除，不宣稱所有配送條件已對齊。

已詢問：SGV Pop-up 是否繼續宅配；未達 US$199 與 AK／HI 是否沿用 UPS 即時計算。沒有回答前不自行新增運費金額或調整出貨地點。使用者後續要求移除 Search UI，依 queue 於預購 UI 交付後執行；配送問題仍待回覆。

## 正式發布（使用者後續明確授權）

隔離 release worktree 通過 Node24 check／Shopify11／analytics8，[輸出](release-check.log)。實作 commit `47eb598`、QA log whitespace commit `bbf555a` 已 push 正確 repo main；Vercel `dpl_8x1DtyatQMPdvycNY1jzkMLd9YDy` READY，www／apex alias 均指向同一版本。[部署來源與 alias](production-deployment.json)。

[正式中英文 1440／390](production-ui.json)實際展開付款與取消文字正常；[正式購物車](production-cart.json)加入 1 件、顯示預購出貨時間、價格 US$60、checkout host 正確，之後移除清空，未付款／建單。已檢視正式手機截圖。此次沒有包含本機 SEO、Search 移除與 Logo 修正。

Shopify 預購欄位已實際寫入並讀回。腳本 `scripts/shopify/restore-preorder.mjs` 預設 dry-run、`--apply` 才寫入，使用 compareDigest，保留第一份 backup，不覆蓋不同的既有條件。
