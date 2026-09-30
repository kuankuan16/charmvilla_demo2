# 第四輪（2026-09-30 下午）：生成圖接入、耳環合併、大標動態、洽詢移除、footer 白、頁首加高、會員頁版型

## 成品／交付檔
- Commit `38c73c2`（＋會員頁寬度修正一筆）；正式站部署 `charmvilla-gallery-site-k7bezyovt` 及其後一筆。
- 生成圖（Higgsfield gpt_image_2_5／sunburst／high／1k／4:5，每張 1.5 credits）：
  - 首頁精選 5 張：`output/featured-editorial-2026-09-30/01…05b`（吐鑽款第一版 `05` 畫成垂墜鑽石，改以 CV-0370＋素描為參考重生 `05b`，第一版保留未用）→ `public/media/site/featured-*.webp`，`Product.featuredImage`。
  - 茶包清單 9 張：`output/tea-gift-listing-scenes-2026-09-30/01…09` → `public/media/site/scene-*.webp`，`TeaGift.sceneFile`；茶包清單已無去背卡。
- 金飾合併：`goldfish-diamond-stud` → `bezel-diamond-goldfish-earrings`、`goldfish-diamond-drop` → `single-diamond-goldfish-earrings`（308 轉址）；素描圖併為第 4 個視角；金飾清單 6 → 4 件。
- EVERYDAY／LUXURIES：逐字 yPercent 150 → 0、power4.out、1.5 s、stagger .05，與 loading 字標同一組參數（終點回到原位）。
- 商品頁：移除「03 / MEET IN PERSON」洽詢區與 FAQ；無售價商品的底部 dock 只留返回與品名。
- 頁尾：字標與社群 icon 改白（`brightness-0 invert`、`.social-links a { color:#fff }`）。
- 頁首：`--header-h: 72px`，Menu／字標／圖示垂直置中；目錄頁 padding-top、分類列 sticky top、scroll-padding 一併改用 token。
- 會員頁（未登入）：左欄登入（Email、密碼、記住我、忘記密碼、黑色藥丸「登入」）／右欄「第一次來 CHARM VILLA？」三項權益＋框線藥丸「建立帳號」；註冊、重設密碼在左欄切換。Shopify 傳統客戶帳戶沒有 Apple／Google 等第三方登入，故未放。

## 已檢視／驗證
- `check.log` 0 錯誤；`verify-tea-gifts.log` PASS（腳本補複製 official-prices.json、shopify-map.json）。
- 本機 Playwright：頁首 72px、字標與 Menu 中心 36px；商品頁無 `.product-visit`／`.product-faq`／「商品洽詢」；吐鑽耳環 4 個視角；金飾 4 卡；茶包清單 cutout 0；大標 filmstrip 無錯。截圖 `local/`（featured、footer、product-merged、account、account-mobile、filmstrip）。
- 正式站：`/products/goldfish-diamond-stud` 轉址、會員頁雙欄（`live-account.png`）。

## 帳務備註
Higgsfield 帳號 service@tenten.co 在 15:46 有一筆 −72 credits、14:39 有五筆 −1.5，都不是本專案送出的工作（本輪 13 張＝19.5 credits，每筆 −1.5 可在 `account transactions` 對上）。同一帳號另有使用者。
