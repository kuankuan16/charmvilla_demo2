# 團圓三色預購與選單統一（2026-10-16）

網站本機完成；尚未 commit、push 或部署。Shopify 後台兩個新 plans 已建立。客戶原商品不寫入。

- 團圓從客戶原商品讀取 Gold／Yellow／Red，各 US$170。預購原 Gold plan 保留，增加 Yellow `694183330156`、Red `694183362924`。
- 三色共用原 SKU `67720264417644`；Available 100、Committed 0 回讀未變，未重新初始化。原商品內容、variant、價格、現貨與 CMS 深度比對完全相同。
- 各商品選項統一下拉式；春曉、蝴蝶蘭的茶／盒色拆為兩欄，聖誕維持茶／盒蓋兩欄。未選完整不得購買，選項帶入對應價格、核准照片與 selling plan。
- 原團圓中文材質仍描述舊粉紅／藍色，客戶要求原商品不動，因此列為內容待同步。新色沒有使用舊粉紅／藍色圖冒充。

## 驗證

- Node24 `npm run check` 通過（0 errors、8項既有 warnings）：[log](check.log)。
- 商品／批次19測試通過：[log](unit-tests.log)。API39通過：[log](integration-recheck.log)。E2E16通過：[log](e2e-final-isolated.log)。
- 首輪舊API測試仍禁止第三色，已更新為三色共用剩餘額度。E2E等待狀態更新後才判斷可購買，零network local案例移到Shopify案例前，避免已啟動的伺服器prefetch污染下一個案例；保留0次API斷言。
- 真實 Shopify cart 三色各1盒、各170、共510，每條保留正確 plan 與 Option；測試購物車清空，未付款下單：[回讀證據](shopify-verification.json)。
- Ego 51：zh/en × 1440/390 × 團圓/春曉/聖誕12組DOM檢查，含選項完整／缺選項、44px觸控高度、無水平溢出、手機reduced-motion；鍵盤選茶後Tab移到盒色。[矩陣](browser-matrix.json)、[摘要](browser-summary.json)。無console error／未取消的failed request；5次快速換頁的ERR_ABORTED不算載入失敗。
- [桌機截圖](reunion-zh-1440.png)已人工檢視。手機截圖：Ego wrapper與raw CDP各一次逾時，停止重試，保留實際DOM及E2E證據；不宣稱手機截圖驗收完成。

本機服務：`http://localhost:3147/zh/products/reunion-paper-gift-box`。原有3026／3027／3146服務及使用者購物車保留。


## 紅色圖片與獨立線上 Preview（2026-10-16）

使用者要求直接提供網址，已將選單來源與紅色斜角圖整合至 [Preview](https://charmvilla-demo2-om1gzlfpw-tentenco.vercel.app/zh/products/reunion-paper-gift-box)。選「紅色」顯示1張新圖；選「金色」保留原4張。原生1122×1402，僅Preview核對，未正式核准HD資產。

- `preview-check.log`：Node24 lint/typecheck/build通過，0 errors、9個既有／暫存腳本warnings。
- `preview-catalog-tests.log`：13個商品測試通過。上一階段API39、E2E16結果不當成本輪重跑。
- `preview-source.json`：5439c02加8個指定檔案的隔離來源與hash；其餘WIP、output、舊未核准圖片未部署。
- `preview-release.json`：Preview target、READY；正式www部署前後相同，未commit/push。
- `preview-browser.json`、`preview-smoke.json`：雙語1440/390、紅/金切換、空選項disabled、手機reduced及鍵盤選紅成功；Spring/Christmas仍為雙下拉。桌機鍵盤選取值未改變，因此只記焦點可達，不另宣稱桌機鍵盤操作通過。
- `preview-red-zh-1440-clear.png`、兩張`preview-red-*-390.png`已view；第一張桌機有電子報遮罩，關閉後重截，舊圖保留不作成果證據。
- `preview-browser-events.json`：0 console/failed-request errors（換頁ERR_ABORTED排除）。
- `preview-asset.json`：Ego同源下載與本機SHA256一致；直接Node fetch拿到HTML保護頁，不能當作圖片成功。

Production沒有變更；Shopify本輪沒有寫入。Ego53完成後保留紅色商品頁供使用者檢視。
