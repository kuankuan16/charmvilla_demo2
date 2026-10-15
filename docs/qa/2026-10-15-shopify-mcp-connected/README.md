# Shopify MCP 連線與管理工具 — 2026-10-15

- 真實店名 Charmvilla，網域 zcs0bg-10.myshopify.com，USD；既有 CMS app 與 Headless02 憑證，無輪替。
- App version 1167843360769 已啟用並完成原安裝權限更新；僅增加 read_locations/write_inventory。配置 diff 見 app-version-plan.json，實際授權／工具握手見 connection-final.log。
- Query 維持唯讀；新增限定已映射商品 custom metafield CAS 和指定倉庫可用庫存 CAS/idempotency 工具。4份 GraphQL 全部通過真實2026-10 schema驗證（schema-validation.json）；5項隔離測試含錯商店、無scope、無效商品、無效庫位、並行衝突、重送、逾時及digest，見 tests.log。
- inventory-before.json 是實際唯讀查詢：金色在 Hayward 可用0，沒有把藍色庫存當金色。未執行任何商品／庫存mutation；工具實際寫入功能為schema＋隔離測試證據，不能說已做真實寫入測試。
- .env.local 只在本機、0600、不提交；新agent session才會重新載入兩個MCP設定。舊session的SDK可完成握手與工具查詢。
- 官方參考：[庫存CAS](https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventorySetQuantities)、[metafield CAS](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)。
