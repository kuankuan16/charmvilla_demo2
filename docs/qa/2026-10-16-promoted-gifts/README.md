# 三款主打商品展示（本機完成）

使用者轉貼客戶要求：聖誕兩款置頂，連同15入團圓更凸顯。

- 共用展示清單src/data/merchandising.ts；首頁推薦首列依序為聖誕12入、聖誕心意禮、團圓15入。保留6格及第二排茶匙、筷架、杯墊；春曉與年年有魚仍在分類清單。
- 茶與全部商品置頂相同三款，其他相對順序保留；metadata封面及ItemList順序同步。未寫Shopify原商品、圖片、價格或預購額度。
- Node24 npm run check通過（0 errors／9既有warnings）；shopify:test 13/13通過。
- Ego64：中英文×1440/390×首頁／tea／all共12例順序、圖片解碼、數量6/10/14與無溢出通過。手機reduced-motion、桌機normal。ItemList前三位同步；Tab由聖誕12入到心意禮，鍵盤可用。
- 桌機補拍動畫結束畫面；首頁採自訂data-page-scroller，body overflow:hidden為既有架構，先前等待body解鎖為QA判斷錯誤，非此次程式bug。正常關閉newsletter後未清storage。首頁手機、茶清單桌手機截圖已檢視。
- browser-errors.json只有導頁取消請求（ERR_ABORTED/canceled=true），無Runtime.exceptionThrown／非取消failed requests。批次導頁server有destination stream closed early，屬主動取消；不當作獨立網站錯誤。
- 本機http://127.0.0.1:3246/zh/collections/tea。未commit／push／Preview／Production；Git基準db67cc7。Ego64完成保留本機茶清單。

前一任務兩款500額度已在Shopify及正式站生效，與這項本機展示排序分開。

## 正式發布（進行中）

使用者已明確要求直接發布及更新GitHub。2026-10-16重新fetch後main/origin/main均db67cc7；Vercel www目前指向同SHA的dpl_EEZJDoT2vMfFeYMEAPqLcMwRNVoY。三個來源檔修改時間均早於本次check.log，之後無程式變動，沿用已通過結果。未重跑或變更Shopify額度。
