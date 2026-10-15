# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

使用者要求確認 root checkout 連到 tentenco/charmvilla_shopify_official，安全合併本機與同事最新版本、發布 www.charmvilla.com，並在 Ego Lite 開本機與 Shopify Admin，接通商店 MCP。先前圖片、定稿與底部對齊已正式發布並驗證。新的 root 同步須保留舊 WIP 的可回復備份，不能用舊檔覆蓋同事 Shopify 修改。

## Steps and evidence

1. 已完成：955e603 基礎上的 curated patch、Node24 check、Shopify12、雙語1440/390、照片/政策/選單與 Logo QA，證據 docs/qa/2026-10-15-client-images-release/。這些是合併最新主線與再次增加間距之前的證據。
2. 已完成：整合最新 9beeb11，保留 SEO、購物車、三盒 US$60、配送與庫存；Node24 check、Shopify12、API37、E2E16、雙語桌手機 QA 通過。
3. 已完成：67a9091 圖片/文案、afc5199 底部對齊正式發布。Vercel alias/來源 SHA 已核對；本機及正式各12組對齊 QA，8組桌機底緣差0px，手機/reduced-motion/Logo與錯誤檢查通過。14商品35variants與10款預購資料不變。
4. 進行中：root main 落後18個提交；先保存舊 WIP 與核准資產，再 fast-forward 最新主線，確認核准功能均已包含；未核准圖片/歷史輸出保留本機。
5. 待完成：以既有 Vercel 專案憑證接通本機 Shopify，實際 MCP handshake/唯讀查詢驗證，說明寫入能力限制；秘密僅存 ignored .env.local。Ego task44 p1 本機、p2 Shopify 密碼登入已交給使用者。
6. 待完成：以同步後 root 執行必要驗證，重新確認正式 alias 與實際頁面，回報版本差異及未解的登入/數量條件。

## FIFO queue

1. 團圓只剩金色有貨，粉紅/藍停售；整合正確 Shopify variants 並隱藏不需選擇的色款選單。已詢問金色實際可售數量，尚待回答，不能捏造或把藍色庫存移轉。只限本商品的明確新授權，其餘 Shopify 不改。

## Attempts and decisions

- 使用者已明確更正：最後一步與圖片底部需要對齊。先完成此補充發布，再接團圓。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。

## Resume

先在 /Users/kuan/Documents/Codex/charmvilla-release-20261015 提交正式 QA 證據，再同步 10-02-charmvilla-demo2。root remote 已確認正確，舊 WIP 不能直接整批套到新主線。團圓金色數量仍待回答；不寫入庫存。
