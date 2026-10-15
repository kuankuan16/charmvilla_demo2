# 2026-10-15 核准圖片、定稿與沖泡留白發布

## 範圍與基準

- 使用者授權正式發布已驗收的雪花圖片與早上客戶定稿，並要求保留同事 Shopify 串接；最新補充要求沖泡每步更寬鬆。
- 在隔離 worktree 整理，最後整合 origin/main `9beeb11`。原本 root 的未提交工作保留，未批次提交。
- 五張新圖：三盒、斜角、正面均為 smooth-bg-v5；開盒 2 入使用已驗收 unboxed-2-hd-v5；情境圖為 gold-seal-v3。前四張 1856×2320、情境圖 2784×3456。圖片尺寸/原生輸出限制見 image-validation.json；不宣稱原生 4K。
- 定稿：預購付款/出貨/取消說明、退貨政策連結、軍郵文字、聖誕茶款與盒蓋兩個選單。依上游較新授權保留「不寄 Alaska/Hawaii」及三盒一組 US$60，不恢復舊文案。
- 沖泡：桌機每步至少 240px、上下各 64px，手機上下各 40px。使用者其後更正要求底部對齊；移除 guide 尾端空白，桌機動畫終點改依照片高度及末節點位置計算，保留手機終點與 BrewProcess lifecycle。

## 已驗證

- Node24 `npm run check`：0 errors、7 個既有 warnings，typecheck/build 通過；merged-check.log。
- Shopify 12/12；新增六組 tea/lid 對應保留 variant ID、價格、可售與照片測試；merged-shopify-tests.log。
- 同事隔離 mock 回歸：API37/37、E2E16/16，沒有向真實 Shopify 建車/寫入；merged-checkout-tests.log。原聖誕 radio assertion 更新為兩個選單六組仍不可購買。
- Ego task44：zh/en × 1440/390，四圖 decode、六組選項/缺選禁用/未發布禁用、鍵盤、政策 hash 展開及 reload、無溢出/console/network error；動畫 stage4 後 Logo 回首頁；reduced-motion。見 merged-local-ui.json、merged-local-visual.json 與 merged-local-*.png。
- 桌機五列實測都是240px，見 merged-brew-rows.json；已看中段與結尾截圖。
- merged-protected-files.json：34 個 Shopify/API/stock snapshot/CartProvider/BrewProcess/merchant policy 檔案與 9beeb11 相同。catalog-data.ts 只增加 Christmas 顯示選項對應，沒有更動讀取/價格/庫存規則。
- 發布前公開資料：14商品35variants，merged-shopify-public-before.json；10款原預購 notice，merged-preorder-before.json。部署後需比對。

## 發布狀態

67a9091 已 push main；Vercel dpl_DT8Mcq2yjr98w8EGaLPxPttVt5NS READY，www/apex/demo2 alias 來源相同。正式 zh/en1440/390 四張圖、六組選項與政策連結/Logo/動畫通過；5資產 SHA256 相符，14商品35variants及10款預購 notice 完全相同，見 production-*.json/png。Preview 未另建。

底部對齊補充 afc5199 已推送；Vercel dpl_79UtGMhWkVkjfG1jHKHA4zipXjmP READY，正式 www/apex/demo2 來源一致。Node24 check 通過；alignment-local-alignment.json 與 alignment-production-alignment.json/截圖涵蓋 zh/en × 1440/1800/1024/390 與 reduced-motion。8組桌機底緣差0px，手機最後一步在照片下方可讀；本機及正式各12組動畫/Logo與console/network均正常。

## 後續獨立任務

團圓僅金色有貨，粉紅/藍無貨，需隱藏選色單並對齊 Shopify。已詢問金色可售數量，尚待回覆；本次發布沒有改任何商品庫存。
