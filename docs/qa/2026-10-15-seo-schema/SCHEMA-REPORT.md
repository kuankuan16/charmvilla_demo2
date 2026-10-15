# CHARM VILLA：公司、品牌與門市身分

查證日期：2026-10-15。資料以本專案現行核准資訊、原 Shopify 與官方公開網站交叉核對。

## Entity 決策

| 實體 | Schema.org 類型與 @id | 可證實內容 | 來源與取捨 |
| --- | --- | --- | --- |
| 美國商店 | `OnlineStore`，`https://www.charmvilla.com/#organization` | 店名 CHARM VILLA US Store、法律名稱 **Haoying LLC**；25509 Industrial Blvd, Ste G5, Hayward, CA 94545, US；us@charmvilla.com；美國授權獨立經銷、加州出貨、僅線上銷售 | [commerce.ts](../../../src/data/commerce.ts) 的客戶 2026-10-12 A1 答覆、公開 FAQ／頁尾。OnlineStore 是 Organization 子型別；沒有美國到訪門市、營業時間、電話或虛構地圖座標 |
| 品牌 | `Brand`，`https://www.charmvilla.com/#brand` | CHARM VILLA／CHARMVILLA／子村莊園、官方 logo、台灣官方網址、日本官網與官方社群 | [台灣官網](https://www.charmvilla.com.tw/)、[日本官網](https://charmvilla.jp/)、既有 [content.ts](../../../src/data/content.ts)。品牌社群放在 Brand.sameAs，不把它們等同於 Haoying LLC 的公司帳號 |
| 台北晶華門市 | `Store`，`https://www.charmvilla.com/#store-taipei` | 地址、+886225420303、每天 10:00–21:00、核准照片與地圖 | 台灣官網門市資訊、日本官網 `#indexStore`、本機 content.ts 的現有可見資訊 |
| 京都門市 | `Store`，`https://www.charmvilla.com/#store-kyoto` | 京都山本町 442、+81756065507、週六／日 11:00–18:00、核准照片與地圖 | 日本官網 `#indexStore`；[特定商取引法頁](https://charmvilla.jp/view/contract) 另確認電話及地址。該頁記載日本銷售業者 `Charm Villa Co., Ltd.`，沒有把它當成美國商店的法律主體 |
| 本站 | `WebSite`，`https://www.charmvilla.com/#website` | publisher 指向美國 OnlineStore，about 指向 Brand，語言 en／zh-Hant | 正式網域與現行語系設定。未建立不存在的 SearchAction |

美國經銷商與台日門市的企業持股／母子公司關係未獲證實，因此沒有 `parentOrganization` 或 `branchOf`。首頁以 `mentions` 連到台日門市，商品以 `brand` 連到品牌、Offer 以 `seller` 連到美國商店。

## 不確定資料的處理

- 日本官網 About 寫品牌 2011 年成立；本機核准 About 寫 2013 年，來源包含小金魚茶包設計／上市歷史。保留既有核准可見內容，schema 不填 `foundingDate`、創辦人或 LLC 成立日，等待品牌正式釐清。
- 美國客服只提供已核准 email；沒有把台灣／日本電話用作美國客服電話。
- 門市沒有可查證且與現有內容一致的精確座標、評分或評論，這些欄位省略。沒有塞入 placeholder。
- News 的 `date` 是活動日期，包含未來活動。`Article` 提供 headline、description、image、publisher、language、mainEntityOfPage；不偽造 datePublished、dateModified 或作者。

## 商品資料契約

商品 `Product`、`Offer` 與 metadata 都由同一頁 SSR 的 `getCommerceProducts(lang)` 資料建立；價格、可售資格、SKU 與 variant GID 由 Shopify 來源決定。照片仍用已核准 Visual。

每個 variant 一個 Offer，包含自己的價格、SKU（有值才輸出）、seller 與 `availability`：不可售為 `OutOfStock`；明確預購標記為 `PreOrder`；可缺貨接單的 variant 為 `BackOrder`；其餘為 `InStock`。沒有用整個商品的混合庫存狀態蓋過各選項。

僅展示、未發佈 Headless、非 ACTIVE 或 USD 尚未確認的商品省略 Offer；不建立假評分、價格期限、shippingDetails 或退貨條件。Schema.org 語法有效不等於 Google 保證顯示 rich result。

## 實作與驗證入口

- [schema.ts](../../../src/lib/seo/schema.ts)：entity graph、頁型與商品／文章／門市 schema。
- [metadata.ts](../../../src/lib/seo/metadata.ts)：完整雙語 metadata、URL 與摘要。
- [JsonLd.tsx](../../../src/components/seo/JsonLd.tsx)：server-rendered script 與安全序列化。
- [generated-schema.json](generated-schema.json)：首頁、春曉商品、茶分類、活動文章的可檢視樣本。
- [crawl.json](crawl.json)：56 個 URL 的 HTTP、索引、語系、schema 與資產檢查。
- [validator-combined.txt](validator-combined.txt)：已在 [Schema.org 官方驗證器](https://validator.schema.org/) 實際貼入合併 graph 驗證，4 個頂層項目，0 errors／0 warnings。Product、Offer、OnlineStore、Brand、Store、Article 等被關聯到頁面圖譜中。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
