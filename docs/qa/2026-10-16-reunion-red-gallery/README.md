# 紅色團圓第2–4張圖庫

以下保留當時的 Preview 驗證；已由[正式發布紀錄](../2026-10-16-reunion-release/README.md)接續。

- Preview: https://charmvilla-demo2-ptpqhv4gs-tentenco.vercel.app/zh/products/reunion-paper-gift-box ，選紅色。
- 內建imagegen生成正面及另一側斜角，各1稿，原生1122×1402。第4張共用既有無盒蓋15包實拍；金色4張保持。
- `image-analysis.json`：同角度主體寬／高占比差低於0.1百分點，四角背景RGB最大差2/255。整體與3倍Logo／金魚細節已view。
- `check.log`：Node24 lint/typecheck/build通過，0 errors／9既有及暫存腳本warnings。
- `browser.json`：中英文1440/390，各切換4張，共16例；載入、還原金色、overflow通過。`browser-errors.json`為空。手機reduced畫面已檢視；桌機截圖在cross-fade中，保留並明示不當作動畫結束截圖。
- `source.json`、`deployment.json`：5439c02加限定10檔，dpl_BABWHhjQTi3LGUv4ePqoxSoKxq36 READY／preview。正式www仍dpl_2yVuVGM8gTmuq7bha97yzQZKunAL。未commit/push、未正式部署，未寫Shopify。
- 原圖與提示詞：`output/imagegen/reunion-red-20261016`；新頁面資產為`public/media/site/studio-reunion-gift-box-red-{front,alternate}-v1.png`。
- Ego54已finish，保留紅色第2張供檢視。後續混搭任務的瀏覽器回歸補驗桌機cross-fade結束狀態。
- 後續已在[混搭Preview QA](../2026-10-16-snowflake-mix/README.md)補驗桌機正常motion，第2張opacity=1／其他0；截圖已實際檢視。最新Preview為fwasds9u4，包含全部紅色圖庫。
