# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-16

## Active task

- 使用者已核准金色完整圖庫並明確要求直接正式上線、Push GitHub。
- 將金色三張接入團圓Gold圖庫與預設封面，Yellow保留原黃款、Red保留先前已預覽三張，第4張共用15包實拍。發布先前已核對的三色選單與聖誕三盒混搭來源，保留原Shopify商品／價格／庫存，不執行初始化或遠端資料修改。
- 目標GitHub tentenco/charmvilla_shopify_official main；Vercel tentenco/charmvilla-demo2，正式 www.charmvilla.com。fetch成功，main/origin/main5439c02無新增提交；其他歷史QA及未核准圖片不納入。
- 使用Vercel deployments-cicd技能核對team/project/commit/environment，正常push不強推；本機check/Shopify/購物車測試與雙語桌手機驗證後發布，正式alias及頁面必須核對。
- 完成條件：三色四張皆正確、三盒混搭資料與價格正確、Git remote SHA與production來源一致、正式路由圖片及購物車驗證通過。無必要問題。

## Steps and evidence

| 狀態 | 動作 | 如何證明完成 | 實際結果／證據 |
| --- | --- | --- | --- |
| completed | 同步及來源確認 | fetch、status、worktrees、remote與部署歸屬 | main5439c02；project prj_QWvvqmrK6UCFkDhY9DyPAQe2Cx23 |
| completed | 接入核准金色圖庫 | Gold/Yellow/Red各四張、來源hash一致 | 僅新增三張圖片及視覺映射 |
| completed | 完整驗證 | check、商品/API/E2E、本機雙語桌手機 | check通過、20 unit／41 API／24 E2E，Ego60雙語1440/390三色通過，真實cart已清空 |
| in_progress | Push與正式發布 | origin/main SHA、Vercel READY/alias與正式頁面 | 未開始 |

## FIFO queue

無。

## Attempts and decisions

- 保留其他WIP，不執行git add全部；來源依前輪snowflake-mix/source.json核對，再加入核准金色三張與相關測試/文件。
- 不把CLI Ready或Git push視為已上線，必須驗證 www 正式路由和資產。

## Resume

本機驗證已完成，提交限定來源、push main，再核對Git觸發的正式部署與www。Ego60持續用於正式驗證；其他歷史QA與未核准資產WIP保留。
