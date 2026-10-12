# 2026-10-12 沖泡區方案 01＋02

使用者指定方案 01 的點到點動畫與方案 02 的左圖右文合併，照片沿用網站攝影風格並有倒熱水動作；本輪追加「杯子裡要有小金魚茶包」及 Preview 網址。

## 本機實作

- 左側 sticky 直式沖泡照，右側既有標題與五個步驟；手機順序為標題、照片、步驟。
- 橫線從文字欄開始；四段軸線各自連接相鄰節點，最後一點下方不再畫線。
- 節點固定，只有列內容上移淡入；以實際節點距離填色，避免中英文段落高度不同時提前變金。
- 原步驟文字、數值、品牌 icon 與 17px 內文保留。
- 圖片資料仍由 `src/data/tea-gifts.ts` 提供，元件讀取既有 `brew.image`。

## 圖片

- Built-in imagegen：一張新攝影圖，再依使用者補充以實拍參考做局部修改。
- 使用檔案：`public/media/site/scene-brewing-hot-water-goldfish-tag-walnut.webp`，1024×1536，170,474 bytes。
- 原始 PNG 保留在 Codex generated_images；清水版本保留在忽略的 `temp/brew-photo-progress/pour-only-v1.webp`，不被網站引用。
- 既有 10/08 圖片 `scene-brewing-glass-cup-cloud-coaster-walnut.webp` 保留。
- 實拍參考：桌面金魚商品圖／茶包的 `截圖 2026-09-10 下午4.27.34.png` 與 `截圖 2026-09-10 下午4.19.58.png`。
- 小金魚局部編輯提示詞見 [image-edit-prompt.txt](image-edit-prompt.txt)；最新茶標提示詞見 [image-tag-prompt.txt](image-tag-prompt.txt)。棉線黏在折疊紙層內，由邊緣進入，無孔洞／金屬孔眼。

## 本機驗證

- Node 24.19.0 執行 `npm run check`：lint 0 errors／8 個既有 warnings，TypeScript 通過，Next 16.3.8 build 通過並產生 65 個靜態頁面。
- ego-browser，同一個 TaskSpace：中文 `/products/reunion-paper-gift-box` 與英文 `/en/products/reunion-paper-gift-box`，1440×1200 及 390×844，實際截圖已查看。
- [report.json](report.json)：零水平溢位、新圖載入正常，內文全部 17px，橫線起點與文字欄誤差 0px，軸線終點與下一節點誤差小於 0.001px，最後一列不產生軸線。
- 中段節點逐一變金；PageDown 到結尾為完整金線及五個金色節點，反向捲動回到起點恢復灰色。
- Reduced motion：內容直接可讀，完整金線／金色節點，無上移淡入。
- Console exception／failed request event 檢查未發現錯誤。
- 額外模擬：停用 JavaScript 時五個步驟仍可讀；圖片 404 時保留圖片區尺寸、alt 與完整步驟，無水平溢位。模擬後已 reload 復原。
- 截圖工具最初因 TaskSpace 在背景容器中而逾時；以原生 UI 將同一空間開成可見視窗後恢復，使用 `raw:true` 並驗證實際 viewport，未建立替代瀏覽器。

## 交付邊界

- 使用者已授權 Preview、直接 Production 發布與 Git 同步；最終線上證據記於 release.json。
- 尚未 commit／push／Production；關於頁 02 職人圖及 Shopify 正式串接不在本輪沖泡區的實作範圍。

## 2026-10-12 晚：茶標 v2（Claude）

- 第一版（`scene-brewing-hot-water-goldfish-tag-walnut.webp`）茶標字樣少了空格（CHARMVILLA）、是立起來的三角形、棉線太粗且接在短邊，使用者決定先不上線。
- 使用者再給四張實拍：長條平放、霧面金、兩端壓紋、CHARM VILLA 有空格、細棉線壓在長邊下面。
- 以第一版為底、`docs/reference/tea-tag-reference-3-string-under-foil.png` 與桌面「茶標籤位置-玻璃杯-1.png」為參考，Higgsfield Nano Banana 2.1 只改茶標與棉線（2 點）；提示詞見 [image-tag-prompt-v2.txt](image-tag-prompt-v2.txt)。
- 輸出 `scene-brewing-hot-water-goldfish-tag-walnut-v2.webp`，1696×2528。放大檢查：字樣有空格、霧面金、無孔、兩端壓紋、棉線變細並接在長邊。未完全符合：棉線接在長邊約 2/3 處而非正中間；茶標約為杯口 1.5 倍（規格 0.85 倍）。已告知使用者，使用者同意上線（「可以」）。

## 2026-10-12 深夜：全新 v5（已上線）

- 使用者給熱水壺參考（黑色霧面細嘴壺）與光影參考（暗室、一道暖金斜光），要求「重生！不一樣的、令人讚歎的」。茶標規格補充：扁平薄片、兩端直邊無鋸齒、縮到 2/3。
- 不附上一版成品，只附光影、熱水壺、圈形把手玻璃杯、泡開小金魚、扁平茶標五張參考；Nano Banana 2.1 4K（3 點）。提示詞見 [image-prompt-v5-sunbeam.txt](image-prompt-v5-sunbeam.txt)。
- 光影參考是手機截圖，AI 把「造訪網站」按鈕畫進畫面底部；裁掉底部與左側暗處移除，維持 2:3，輸出 `scene-brewing-gooseneck-dark-oak-sunbeam.webp` 2048×3072。
- 檢查：茶標扁平、直邊、長度約杯身寬、CHARM VILLA；棉線接長邊偏左（非正中）已告知；使用者「好 發布」。
