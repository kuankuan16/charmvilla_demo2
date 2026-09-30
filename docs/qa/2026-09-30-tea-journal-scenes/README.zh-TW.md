# 茶包禮盒：接入 tea-journal 無人物情境照（2026-09-30）

## 成品／交付檔
- Commit `361b473`；隨聖誕特別版一起部署（`charmvilla-gallery-site-qx6go7w7y` → https://charmvilla-gallery-site.vercel.app）。
- 16 張 `/media/site/journal-NNN.webp`（1080×1350，quality 84，60–156 KB）；來源 URL、原始 PNG SHA-256 與尺寸見 `journal-scenes.json`。

## 製作方式與設定（使用者：「也可以用這裡的情境照 tea-journal.html（減少人的出現）」）
- 來源頁 https://charmvilla-gallery.vercel.app/tea-journal.html 共 30 張攝影稿（301–330，全部無文字覆蓋）。逐張目視分類：**無人物 16 張**採用（301/303/305/307/308/309/311/313/315/319/320/323/325/326/329/330）；**有人物或手部 14 張**不採用（302/304/306/310/312/314/316/317/318/321/322/324/327/328）。
- 30 張裡只有京都版禮盒入鏡（309、320），其他都是茶杯／茶包／室內場景，無法代表特定禮盒。因此：京都版清單圖改用 320（`journalScene`，盒子完整、無人物）；16 款禮盒商品頁「02 / IN EVERYDAY LIFE」各配一張無人物照（`journalStory`），團圓紙盒與大盈月共用 301。
- 資料層：`TeaGift.journalScene` / `journalStory` → `site("journal-NNN.webp")`；清單影像仍走 cutout／scene 規則（journal 照為 scene、滿版）。

## 已檢視／驗證
- `npm run typecheck`、`node scripts/verify-tea-gifts.mjs` PASS；正式站 `/media/site/journal-320.webp`、`journal-301.webp` 200；`/collections/tea` 京都版卡片為 scene／cover（Playwright 稽核，見 `../2026-09-30-christmas-edition/live/report.json`）。
- 已目視 `../2026-09-30-christmas-edition/local/desktop-collections-tea.png`（京都版改為桌上禮盒照）。

## 限制與不宣稱
- 人物判定為目視，未做人臉偵測；318「A paper tail」上緣有手部，列為不採用。
- journal 照為參考引導生成的攝影稿，不宣稱與實際商品像素級一致；未上傳素材圖庫。
