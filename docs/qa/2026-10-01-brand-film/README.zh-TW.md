# 首頁品牌影片接入｜2026-10-01

## 結果
已實作於首頁輪播下方、品牌故事之前；中文與英文頁皆有。使用既有 15.23 秒摸耳環→右轉茶桌→搖茶包修正版，未生成新影片。

## 行為
完整 16:9、不裁切商品；WebM 優先、MP4 備援、原片海報。影片進入畫面才嘗試播放，離開画面／分頁隱藏暫停；使用者手動暫停不會立即重播。減少動態／省流量設定不自動播放。保留原生播放、暫停、進度與全螢幕控制。播畢停留末格，不將非無縫剪接強制循環。標籤與描述支援中英文。

## 驗證
- ESLint 0 errors、5 個既有警告；typecheck 通過。
- 標準 build 受 DNS／Google Fonts 下載失敗阻擋。
- 使用同版本官網已快取的 Outfit、Noto Sans TC 真實字型檔，透過 Next 官方測試回應環境變數、Webpack 離線 build 通過。沒有改動正式字型程式碼；這是離線建置證據，不冒充正式雲端 build。
- /、/en、兩種影片與海報本機 HTTP 200；MP4 Range 請求 206、1024 bytes；FFmpeg 完整解碼 457 格無錯誤。
- 瀏覽器 QA 未完成：Playwright 啟動本機 Chrome SIGABRT／EPERM，Computer Use 開啟分頁亦回 Detached。沒有宣稱桌面／手機實播通過。驗證腳本 browser-check.mjs 已備。

## 發布狀態
**未部署，未上線。** 官網 DNS 查詢失敗；一次 Vercel 正式部署嘗試在載入帳號時回 `fetch failed`，沒有產生部署 URL。未重送。GitHub 推送亦未執行。

## 來源與尺寸
來源 `/Users/kuan/Documents/Codex/09-07-charmvilla/hero/hero_earring_pan_right_v2_1080p*`；1920×1080、30 fps、15.23 秒、無聲。各檔 SHA-256 見 assets.json。

## 本機預覽與後續
獨立工作樹 `/Users/kuan/Documents/Codex/09-23-charmvilla-film-release`，預覽 http://localhost:3134/#brand-film。正式維護 repo `/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site` 同步相同實作。网络／瀏覽器恢復後，執行 browser-check.mjs、正常 npm run check、Vercel deploy、線上媒體與播放驗證，再推 demo2/main。

## 回復
移除頁面中的 BrandFilm import／節點即恢复原順序；舊 Hero 與影片來源均保留。
