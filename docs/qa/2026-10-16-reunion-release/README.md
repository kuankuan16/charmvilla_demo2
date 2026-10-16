# 核准團圓圖庫、三色選單與聖誕混搭發布

使用者2026-10-16核准金色完整圖庫並授權直接發布Production及Push GitHub。

## 本批內容

- 團圓Gold：核准香檳米金3角度，原生1122×1402；第4張保留原15包開盒實拍。Yellow保留原黃款4張；Red使用已確認3角度及同一開盒實拍。封面同步為新Gold。
- 團圓Gold／Yellow／Red對應Shopify現行variants與既有共用預購SKU，各商品選項統一下拉選單。
- 聖誕心意禮每組三盒、各盒一個茶款選單，可混搭或重複；一組US$60、兩組US$120。server以穩定variant GID驗證三盒、價格及可購資格，重建Teas明細。
- 本輪沒有寫入Shopify原商品、價格、庫存，也沒有重設任何預購額度。原生selling plans為前輪已驗證設定。

## 驗證

- Node24 `npm run check`通過：0 errors、9項既有或本機暫存腳本warnings。
- 商品／batch單元20例、API41例、E2E24例全部通過；涵蓋雙語／桌機／手機三色四張切換、鍵盤、切色重設角度、混搭重複／不同茶、購物車還原、售罄／錯誤與價格。
- Ego60本機zh/en×1440/390共12組色款檢查，三色皆4縮圖、正確主圖、無水平溢出、可加入預購；手機reduced motion。local-browser.json及errors檔為證據，errors為0，桌機與手機截圖已實際檢視。
- 真實Shopify商品14款、Admin／CMS／Storefront讀取、cart建立／讀取／改量／移除、HTTPS結帳host及帳號redirect通過；測試cart已清空。沒有付款或建立訂單，未聲稱已測實單扣量。
- 完整本機log及截圖保留於本目錄；Git只收入必要README、來源manifest與精簡結果。舊Preview原始完整部署回應不收入本次提交。

## 發布

來源manifest見source.json，基準main/origin/main為5439c02。目標為tentenco/charmvilla_shopify_official及tentenco/charmvilla-demo2，正式網址www.charmvilla.com。待本批提交後記錄部署與正式站驗證結果。
