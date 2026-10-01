# 2026-10-01 About 頁、首頁男版圖、門市卡米色、精簡裝飾文字與按鈕

使用者 2026-10-01 的五則指示：
1. 「另外新增一個 about 頁面，把影片移過去，首頁就不需要出現影片」
2. 「剛剛做的這張藍版圖，我想要放在首頁」「男版」
3. 「金色改成淺米黃，像剛剛那個商品圖的參考背景色」
4. 「網站儘量精簡，多餘的裝飾文字跟按鈕可以刪除。」
5. 「為什麼這一段老是會壞掉？」→ 見 `../2026-10-01-reveal-fix/`

## 做了什麼
- **About 頁** `/about`、`/en/about`：沿用商品頁的 12 欄格線，左 1–7 欄是影片（16:9、靜音循環、半數以上在畫面內才播、右下角暫停鈕、捲動時固定），右 9–12 欄是標題、品牌故事三段與兩枚獎項。選單（About／關於）、兩個頁尾與 sitemap 都加了連結。首頁不再有影片；`NEXT_PUBLIC_SHOW_FILM` 開關與由下往上滑出的卡片樣式一併移除。影片仍是 `earring-to-tea-v2`。
- **首頁 hero 男版圖**：`public/media/hero/male-embracing-white-bag.webp`（1536×1024，來源 素材專案 `output/male-white-bag-embracing-pose-2026-10-01/assets/…-v1-master.png`，Codex 內建 image_gen 生成一次，sha256 9266d3d4…；webp sha256 46fdeb92…），取代原本的男舞者圖（該圖右手指尖被裁掉）。卡片改成 3:2 完整顯示。該批 README 已註明：肩帶偏單條辮帶、包偏大，使用者看過後指定使用。
- **門市卡**：資訊區底色改 `--color-sand: #d9cdb9`（參考商品照牆面量到 #bbac9b–#cbc4b8，取其色相調淺），字維持墨色。
- **精簡**（刪除項目）：
  - 首頁 hero 的「1 / 3」與「Scroll ↓」；品牌故事的「The Gallery」標籤（保留給螢幕閱讀器）；以手成形的「← 拖曳 →」提示；推薦商品的「SELECTED OBJECTS」與右側說明文字；Shown 的「STOCKISTS & PRESS: 2014–2026」；合作夥伴的「PARTNERS:」與英文地名列；最新消息下方的「INSTAGRAM」文字連結（頁尾已有圖示）。
  - 商品清單頁的「ART IN EVERYDAY LIFE」、每張卡片上的英文分類小字與「查看禮盒／欣賞作品」字樣（整張卡本來就是連結）、搜尋列左邊的「禮盒一覽 18」（搜尋時才顯示結果數）、頁底整塊「MEET THE OBJECTS／走近，細看。／尋找門市」；空結果的「KEEP EXPLORING」。
  - 商品頁「繼續觀看」旁的「回到…清單」連結（底部固定列已有返回）；內頁頁尾的「EXPLORE THE GALLERY」。
  - 保留未刪：合作夥伴的「WORK WITH US 合作洽詢」按鈕、Shown 的獎項與晶華字標、門市卡的「查看地圖」、SHOW MORE! 的「查看邀請」。

## 檢查（本機 `next start`，再對線上重跑）
`shots.mjs` → `report.json`＋截圖；雙語 `http-check.mjs` 40 路由 × 2＝80 頁 0 失敗、英文頁無殘留中文；`pair-check.mjs` 506 組 0 findings；`pdp.mjs` 64 頁 0 失敗；`verify-tea-gifts.mjs` PASS；`npm run check` 0 errors。
About 三個尺寸影片皆在播放（`paused: false`）、無水平溢出。
