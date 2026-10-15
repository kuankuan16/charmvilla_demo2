# 全站 SEO 與公司 entity JSON-LD

2026-10-15，本機 `main`，基準 `2232e74`。依使用者指定的 [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)，使用本機 v2.2.4 的 SEO、technical、schema 技能規則。這次交付為本機實作與驗證，沒有 commit、push、Preview、Production 部署或重送 Search Console。

## 完成內容

- **56 個雙語公開頁面**：首頁、品牌、4 個分類、14 個商品、消息清單與文章、FAQ、購物政策及法律／無障礙頁。各頁有獨立 title、description、完整 OG／Twitter、canonical、en／zh-Hant／x-default；社群分享不再沿用首頁標題。搜尋文字移除排版用的零寬控制字元。
- 首頁標題明確描述小金魚茶包與台灣茶禮盒；商品標題與摘要使用商品名稱、Shopify 規格及既有介紹。已修正保養文字重複造成的商品摘要重複，沒有改寫核准的頁面內文。
- **可信 entity graph**：`OnlineStore`（Organization 子型別）代表 Haoying LLC 經營的美國商店；`Brand` 代表 CHARM VILLA；`WebSite`、`WebPage`、`AboutPage`、`CollectionPage`、`ItemPage`、`BreadcrumbList`、`ItemList`、`Article`、`Product`、`Offer` 依頁型輸出。台北與京都的 `Store` 僅在有門市內容的首頁出現。
- 商品的每個 Shopify variant 有自己的 Offer、價格、SKU、庫存與 seller。展示品、未發布、非 ACTIVE 或未確認 USD 的商品不輸出 Offer。`scheduledPreOrder` 區分明確預購與可缺貨接單，避免一個 BackOrder 選項把現貨選項也標成 PreOrder。
- JSON-LD 在伺服器 HTML 輸出，使用穩定 `@id` 串接並轉義 `<`。官方 logo 原檔保留；schema 專用版本只補白底留白，1200×240、8,244 bytes，比例與字形不變。
- 保留原有 sitemap、robots、公開語系與非正式網域 noindex 保護；404／隱藏分類／會員／待辦頁不進索引。沒有新增不存在的站內搜尋、評分、評論、運費、價格期限或 FAQ rich-result 宣稱。

## 驗證

| 檢查 | 結果 | 證據 |
| --- | --- | --- |
| Node 24 `npm run check` | lint 0 errors／7 個原有 warnings；typecheck、production build 通過 | 本輪已讀取完整命令輸出，7 warnings 位於既有 QA、tmp、account、cart、preloader、header |
| SEO regression | 7/7，涵蓋雙語 metadata、entity 身分、逐 variant 庫存、未發布／展示／幣別、script 注入防護、文章日期、缺貨接單邊界 | [測試程式](../../../scripts/seo/seo.test.mjs) |
| `npm run shopify:test` | 8/8 | Shopify adapter 與核准中文／圖片／variant 配對均通過 |
| HTTP 全站 crawl | 56/56，43 個 SEO 圖片、12 組控制網址；0 errors、0 重複標題／摘要、0 缺 alt 圖片、0 破損內鏈 | [crawl.json](crawl.json) |
| schema 關聯 | 每頁 `@id` 唯一、所有引用可解析、絕對 HTTPS URL、頁型與語言正確 | 同上；最大原始 HTML 279,142 bytes，低於 2MB |
| Schema.org 官方驗證器 | 首頁及首頁／分類／商品／文章合併 graph：0 errors、0 warnings | [合併結果](validator-combined.txt)、[首頁明細](validator-home.txt) |
| 瀏覽器 | 中／英 × 1440／390：無 JS errors、HTTP 4xx/5xx、破圖或水平溢出；reduced-motion 正確；Tab 可到跳至內容 | [browser.json](browser.json) |
| Ego Lite 實際導覽 | 分類點入商品，再由語言選單切中文；title、OG、canonical 與 Product graph 同步更新 | [導覽紀錄](ego-navigation.json)、[實際 2316×1292 截圖](ego-product-2316.jpg) |
| logo | 1200×240、外觀已開圖檢查；43 個 SEO 資產 HTTP 200 | [schema logo](../../../public/brand/charmvilla-logo-schema.png) |

`agent-browser screenshot` 本輪兩種呼叫均逾時，已停止重試；1440／390 的結果為實際瀏覽器 DOM、網路、錯誤、鍵盤與 reduced-motion 量測。補充視覺檢查使用 Ego 的 `Page.captureScreenshot`，實際 viewport 為 2316×1292，沒有把它當成 1440 截圖。

## 公司與 schema 來源

詳見 [SCHEMA-REPORT.md](SCHEMA-REPORT.md)。可直接檢視 [generated-schema.json](generated-schema.json) 的四種頁型樣本；執行時仍讀同頁的 Shopify 資料，樣本不是庫存備援。

## 後續量測

本次完成程式與本機驗證。Google Rich Results 的實際呈現、Search Console 收錄／排名、CrUX 真實使用者 LCP／INP／CLS 尚未重測；本輪沒有提供推估 SEO 分數。展示品沒有 Offer，因此不以它們宣稱商品 rich-result 資格。文章既有日期是活動日期，未拿來填造發佈時間或更新時間。

### 重跑

先啟動本機 production server，再使用 Node 24：

```sh
npx -y -p node@24 -c 'node --import ./scripts/seo/register.mjs --test scripts/seo/seo.test.mjs'
npx -y -p node@24 -c 'npm run shopify:test'
npx -y -p node@24 -c 'npm run check'
npx -y -p node@24 -c 'node scripts/seo/verify.mjs'
```

`verify.mjs` 預設連 `http://localhost:3026`，結果寫入 `/tmp/charmvilla-seo-crawl-<timestamp>.json`，不覆寫歷史 QA。可用 `SEO_VERIFY_URL`／`SEO_VERIFY_OUTPUT` 指定本次目標與新的證據檔案。它只讀頁面，不操作購物車、訂單或 CMS。
