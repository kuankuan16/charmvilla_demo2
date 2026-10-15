# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

發布使用者核准的雪花商品圖、10/14 客戶定稿、政策連結、聖誕選單與沖泡步驟留白。保留最新主線 Shopify、購物車與 Logo 修正，不寫 Shopify 後台。最新補充要求步驟再拉開；桌機每步至少 240px、上下各 64px，手機上下各 40px，待實際頁面驗證。

## Steps and evidence

1. 已完成：955e603 基礎上的 curated patch、Node24 check、Shopify12、雙語1440/390、照片/政策/選單與 Logo QA，證據 docs/qa/2026-10-15-client-images-release/。這些是合併最新主線與再次增加間距之前的證據。
2. 進行中：最新 origin/main 已到 9beeb11，需保留其 SEO、購物車、三盒 US$60、配送與庫存成果；合併後重新驗證受影響範圍。
3. 待完成：發布 main，讀回 Vercel alias/來源 SHA，正式圖片/文案/雙語桌手機 QA，確認公開 Shopify API 未被本次發佈改寫。

## FIFO queue

1. 團圓只剩金色有貨，粉紅/藍停售；整合正確 Shopify variants 並隱藏不需選擇的色款選單。已詢問金色實際可售數量，尚待回答，不能捏造或把藍色庫存移轉。只限本商品的明確新授權，其餘 Shopify 不改。

## Attempts and decisions

- 最新沖泡截圖的「最後的文字與圖片有對齊到」語意已詢問；先增加步驟間距，不強制鎖定圖片底部。
- 上游 9beeb11 的 PLAN 記錄先前配送/庫存/Logo/checkout 全數已交付；不再把那些舊項目排成新工作。

## Resume

工作樹 /Users/kuan/Documents/Codex/charmvilla-release-20261015；原本 10-02-charmvilla-demo2 WIP 原樣保留，不從舊 root 發布。先合併最新 main，再完成本次 release，接續團圓。
