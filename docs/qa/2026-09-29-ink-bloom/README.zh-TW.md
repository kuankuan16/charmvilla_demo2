# 藝術即生活：文案、金色暈染與共用選單

## 成品／交付檔
- 預覽站：https://charmvilla-gallery-site.vercel.app/
- 全站敘事：`src/data/content.ts`、`src/data/catalog.ts`，首頁、分類與 20 件商品內頁及 metadata。
- 首頁與目錄共用 `Header`，內頁連結返回首頁對應段落。
- `public/media/hero/dancer-female-selected.webp`：使用者最新指定女舞者。
- `public/brand/goldfish-white.svg`：使用者金魚輪廓的反白向量描摹，置於開場右側金色面板。最後調整為原尺寸 50%（面板寬度 28%），中心左移至面板寬度 38%。

## 製作方式與設定
- 以「藝術即生活」為全站核心，採用 Kura Yang 內容技能的材質觀察、長短句節奏與克制語氣。網站資訊架構需要明確導覽，因此將文章寫作規則調整為短篇品牌敘事，並保留功能標籤與產品事實。
- 每種金飾與器物使用獨立敘事；同款色彩、風味共用相同工藝背景。保留名稱、材質、專利、獎項、活動及門市資料。
- 金色筆刷沿用既有 alpha 紋理；SVG 多層透明前緣及 turbulence 位移形成暈染展開，GSAP 控制 3–4 秒節奏。開場／輪播／段落進入時觸發，完成後移除濾鏡；減少動態模式直接顯示。
- 金魚為對供圖輪廓的 Potrace 向量描摹，非生成或重新設計。白色實心 path、原始 1184:988 比例；與二值化來源輪廓 IoU 約 99.80%。
- 女舞者僅轉 WebP，原生 1690×2294，未生成或放大；舊版保留。

## 參考與來源
- 使用者指定技能：https://github.com/tentenco/skills/blob/main/skills/content/kura-yang-content-pipeline/SKILL.md
- 暈染互動參考：https://www.aoyagiuirou.co.jp/
- 前期輪播與筆刷參考：https://recruit.positive.co.jp/
- 女舞者與金魚：使用者本輪附件，來源名稱與 SHA-256 見 `asset-verification.json`；原 PNG 同資料夾保留。

## 已檢視／驗證
- lint、TypeScript、Next 正式建置通過，30 個靜態頁面產生。金魚最終尺寸調整後再次建置通過。
- 26 個首頁、分類與商品路由皆 HTTP 200 且具共用選單；20 件商品名称、規格、變體、相片來源與原始版本比對完全相同。
- 1440×900 桌面商品列表及首頁、390×844 商品頁與手機導覽目視檢查。
- 首頁女舞者實際載入新檔 1690×2294；開場右側顯示反白金魚。
- 手機跨頁 Visit 連結抵達首頁門市段落，頂端約 50px，避開選單。
- 首頁及商品頁無文件橫向溢出；英文 Outfit；筆刷等待／展開／完成狀態正常。
- 修正目錄分類列及底部操作列蓋住展開選單的層級；隱藏選單設 inert，取消首次載入時強制聚焦漢堡按鈕。

## 限制與不宣稱
- 暈染為參考引導的程式動畫，非原站 WebGL shader 的逐像素重製。
- 未重新查證先前核准的營業時間、活動、專利及產品規格，均保留既有資料。
- 新聞事實與法定商品資訊保留，不為文學語氣增添未證實的工藝、產地、功效或售價。
- 未建立 Git commit 或 push。

## 重建指令
```sh
npx --yes --package=node@24 -c 'npm run check'
npx --yes --package=node@24 --package=vercel -c 'vercel deploy --prod --yes'
```

## 後續整合（同輪追加）
- 獎項與專利移入首頁 The Gallery 文案下方，iF 左、Red Dot 右；移除原茶包清單底部重複區塊，保留小金魚茶包獲獎歸屬。
- 首頁原分類清單改為單一「推薦商品精選」，六件跨品類作品，無分類篩選。完整商品留於分類頁；Header 與 Footer 分類連結改指向 `/collections/*`。
- 分類頁沿用原 moveUp、圖片 1.15→1 的 GSAP 動態；搜尋更新時清理並重建，離開首頁時將 ScrollTrigger scroller 恢復 window。已驗證五張茶包卡隨滾動出現、搜尋「玫瑰」剩一件且可見。
- 分店介紹改為參考 Cases 的左右各半卡片，下一張露出、圓點、左右鍵、觸控橫滑及滑鼠拖曳；僅兩間既有門市，地址與時間保留。京都圓點切換後卡片左緣約 4.86vw。
- 五款茶包清單圖改 4:5 背景延伸版，原細節相簿保持橫式。製作資料：`/Users/kuan/Documents/Codex/09-07-charmvilla/output/tea-portrait-backgrounds-2026-09-29/README.zh-TW.md`。

## 最終發布驗證
- READY：dpl_FbqTA6RT9R46PqL6NeF87H3c6CuP。
- 26 個頁面 HTTP 200，共用選單存在；五款新茶包資產線上／本地 SHA-256 一致。
- 線上分店卡片已目視檢查；390px 手機無水平溢出，可切換京都卡片。
- 桌面六件精選、兩間門市、獎項新位置與反白金魚最終尺寸已核對。
