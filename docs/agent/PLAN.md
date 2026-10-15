# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

使用者明確授權將已完成的 Pre-order UI push 至正式站。隔離 release branch 只發佈預購 UI／資料串接／購物車提示；不夾帶主工作樹的 SEO、Search 移除或 Logo 修正。

## Steps and evidence

- complete: Shopify 預購欄位 10 商品寫入並讀回；庫存、價格、status 不變。
- complete: Node24 check、Shopify11、analytics8；雙語1440／390、庫存失敗與購物車加／增／刪驗證。QA 位於 docs/qa/2026-10-15-preorder-ui/。
- in_progress: Git commit／push 正確 origin/main、Vercel READY／正式 alias 與來源 SHA 回讀、正式頁面與購物車驗證。

## FIFO queue

1. Shopify 配送：SGV 僅現場銷售、不出貨，所有網購使用 Hayward 庫存；不配送 Alaska／Hawaii。最新指示優先於舊截圖。限定調整 online fulfillment／shipping zone，保留現有 UPS／Express 費率與 USD199含免運，不改商品庫存或價格；同步衝突政策。
2. 使用者重開 Logo 問題：跨瀏覽器內頁頂部 Logo 回首頁仍間歇 Page Not Found。既有本機 cleanup 修正未部署，需核對正式錯誤與該修正，不宣稱線上已解決。

## Workspace

隔離 release worktree：10-14-charmvilla-preorder-release，branch release/preorder-ui-20261015。主工作樹所有 WIP 保留，其他分支與 port3027 不動。正式發布授權僅為本次預購 UI。
