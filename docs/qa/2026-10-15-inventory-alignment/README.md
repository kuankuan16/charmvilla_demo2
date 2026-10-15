# 庫存表對齊（2026-10-15）

來源為使用者提供的10款表格，並補充「全部都用我剛剛貼給你的資料表為準」及「三盒一組，共200組」。表格的預購上限與串接後可售總量是不同欄位。

| 商品 | 預購上限 | 線上可售合計 |
| --- | ---: | ---: |
| 團圓 | 100盒 | 3盒 |
| 年年有魚 | 20盒 | 0盒 |
| 花開富貴 | 20盒 | 1盒 |
| 京都版 | 100盒 | 58盒 |
| 春曉 | 10盒 | 4盒 |
| 暮雪 | 10盒 | 2盒 |
| 蝴蝶蘭 | 10盒 | 2盒 |
| 紫斑蝶 | 10盒 | 0盒 |
| 聖誕禮盒 | 200盒 | 未發布，null |
| 聖誕心意禮 | 200組，每組3盒 | 未發布，null |

- Admin逐variant及location、Storefront US實際讀回，前八款Hayward／線上數量已完全符合表格；保留茶款與盒色數量分配，沒有重複把整款合計寫入每一variant。聖誕商品未發布的null不轉成可售200。
- 已將10款上限與計量單位加入既有 merchant-owned `custom.preorder_details.allocation`，使用compareDigest保護其他設定。欄位是整款campaign額度記錄；目前真正放行購買仍由Shopify各variant庫存與DENY政策控制，沒有新增200份現貨或跨variant共用庫存引擎。
- `allocation-before.json`／`allocation-after.json`／`allocation-result.json`：10筆寫入讀回成功，價格／庫存／status／發布狀態均未變。`idempotency.json`再次dry-run為0筆差異。
- 重跑工具：`node scripts/shopify/align-inventory-table.mjs`唯讀；`--apply`只更新上述allocation，任何表列可售數量／發布狀態不符會停止，避免覆蓋新訂單。
- 使用者其後明確確認每組US$60；已執行 `convert-christmas-set.mjs --apply --price=60`：英文title/description、繁中native translation/CMS、product_contents、teabag_count=6、五個variant售價60已寫入並讀回。原variant GID/SKU/選項/實體庫存/發布狀態不變（christmas-set-before.json、christmas-set-after.json）。
- 轉換保留五個茶款、既有沖泡內容與核准影像；沒有新增茶款混搭variant或庫存分配。200組是campaign額度，商品仍未開Headless。
- 正式zh/en商品頁已顯示US$60與三盒共六包，且購買維持停用（converted-ui.json）。本機只讀sync已更新快照，針對組價、茶包數、販售單位與未發布的Shopify測試11/11通過。Node24 npm run check通過，0 errors／7既有warnings（converted-check.log）。再次表格核對allocationWrites=0（final-table-readback.json）。

沒有付款、訂單或寄信。Shopify商品更新已即時生效；本機快照與QA將併入使用者已授權的完整commit/push。
