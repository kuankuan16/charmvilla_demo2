# CHARM VILLA 三張情境圖 Hero（2026-09-29）

> 本文記錄 v1。現行筆刷、黑體與極簡介面修正版見 [v2-brushes/README.zh-TW.md](v2-brushes/README.zh-TW.md)。

## 成品／交付檔

- 新官網預覽：https://charmvilla-gallery-site.vercel.app/
- Vercel Production：`dpl_FJhmLqx9gK7C65PfPXgknPQHs1TD`，READY。此為既有新官網預覽站的部署目標。
- 網站原始碼：`/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site`。
- 元件：`src/components/sections/Hero.tsx`；樣式：`src/app/globals.css`；三張選圖：`src/data/content.ts`。
- 男舞者與女舞者使用本次使用者提供的原圖，保存於 `references/`；網頁版位於 `public/media/hero/`。
- 本次開始前已有 Hero、全站 CSS、PageShell、Preloader 與 content 的未提交修改。本次保留前置修改；接手時的 Hero／CSS／content 另存 `before/`。未新增 Git commit，未宣稱遠端同步。

## 製作方式與設定

沿用品牌字標，首屏採冷白底 `#F6F8FA` 與暖金色原創 SVG 筆觸。英文主標使用真實載入的 Cormorant Garamond Regular（既有品牌核准方向）；中文沿用網站的 Noto Sans TC。

三張照片循環走橢圓路徑，中央放大清晰、兩側縮小模糊。照片與筆觸分層，以不同幅度跟隨滑鼠；中央照片微幅透視傾斜。每 6 秒切換，轉場 1.4 秒。提供上一張、下一張、暫停／播放、觸控橫向滑動；照片與右下說明可開啟對應商品頁。失去視窗可見性或離開首屏時不持續繪製；焦點在輪播內時暫停自動換圖。

男舞者照片用 `aspect-ratio: 1.11` 的容器由上方裁到腰部以上。完整白色包身、提把、頭部及手臂保留；原始影像沒有裁切覆寫。女舞者採本次提供的黑底圖。第三張採 CV-0380「珍珠長鏈小金魚耳環，米白衣領、電影光影」。

## 參考與來源（URL + SHA-256）

- 互動參考：https://recruit.positive.co.jp/ 。已以 Chrome 實際檢視首屏，並確認三組環形輪替、模糊遠景、不同深度筆觸與滑鼠視差。以自有 CSS／GSAP 實作，未複製其人像、字標或筆觸圖檔。
- 兩張舞者來源：本次使用者附件；無公開來源 URL。原始 PNG 與網站 WebP 的 SHA-256 見 `assets.json`。
- 金飾：https://charmvilla-gallery.vercel.app/#asset=CV-0380 ，本機及線上檔案 SHA-256 見 `assets.json`、`production-http.json`。
- 字型：Next.js `next/font/google` 載入 Cormorant Garamond（https://fonts.google.com/specimen/Cormorant+Garamond），網站字型載入狀態已於 Chrome FontFaceSet 確認。
- 品牌字標沿用既有核准官方 PNG，來源與 SHA-256 見 `assets.json`。

## 已檢視／驗證

- `npm run check`：ESLint、TypeScript、正式建置通過。3 則原生 img 提醒，0 errors。
- Chrome 1440×900、390×844，以及原始寬螢幕視窗：目視檢查照片、裁切、文字及商品位置。
- 已確認中央男舞者不顯示腿部，白色包款完整；女舞者的包與手臂完整；金飾耳環未被文字壓住。
- 自動輪播、上一張／下一張與暫停通過實際操作；商品目的地隨當前照片更新。
- 減少動態模式不自動輪播，手動換圖仍可使用；測試後已還原瀏覽器模擬設定。
- 主文件無水平溢出；背景側邊照片刻意由首屏容器裁切。
- 首頁、兩個商品頁、三張圖片均 HTTP 200；三張公開圖片 SHA-256 與本機一致。
- 瀏覽器未見 error／warning 日誌。完整記錄見 `verification.json`、`production-http.json`、`check.log`、`deploy.log`。

## 限制與不宣稱

- 這是依參考網站的視覺與互動重新實作，非像素級複製。使用 CSS transform／GSAP，而非參考網站的 Three.js shader。
- 配色先採冷白／暖金，沒有把未回覆的偏好題視為使用者核准。
- 手機以 Chrome viewport 驗證，未宣稱完成實體 iOS／Android 或實體觸控滑動測試。
- 沒有生成新商品圖；沒有新增 Figma 圖層或 Gallery 資產。

## 重建指令

```sh
npx --yes --package=node@24 -c 'npm run check'
npx --yes --package=node@24 -c 'npm run dev -- --port 3131'
```
