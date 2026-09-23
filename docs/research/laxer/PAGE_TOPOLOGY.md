# PAGE_TOPOLOGY.md — davidlaxer.com → CHARM VILLA Gallery 對照（實測 1440×900 / 390×844）

證據：`evidence/probe3.json`（桌面 28 屏）、`evidence/probe3-390.json`（手機 21 屏）、`screens/*.png`。所有高度為實測 px。

## A. 原站區塊（桌面內容高 23,106；手機 16,695）

| # | 區塊 | 桌面 top / h | 手機 top / h | 底色 | 互動模型 | 版面要點 |
|---|---|---|---|---|---|---|
| 0 | Hero | 0 / 900 | 50 / 1097 | paper 左 ／ gray-200 右 2/3 | scroll-driven（parallax speed 5、overlay fade scrub）＋ time-driven（preloader 後 split 進場）＋ mouse（人像 ambient x） | 左：logo、12.96vw 兩行大標（跨到右欄）、副標、底部 SERVICES 三行清單（底線＋右側圓點）；右：人像＋姓名職稱；header 50px |
| 1 | 1: First impressions | 900 / 1394 | 1147 / 1579 | white | scroll（clip 由左揭開圖片；split lines；左欄 sticky top-50） | 左圖（3D 靜物）右文；分隔線格線；大標 3.4rem 粗體 |
| 2 | 2: How we think | 2474 / 7853 | 2826 / 3397 | gray-200 | scroll-pinned **stack**（橫向 7 卡，sticky top-50；三層背景 parallax −2/−1.5/−1） | 大「2:」＋標題；卡片 690px 寬、上緣 A: B: C: 索引、標題底線 hover、CLIENT ↳、右下計數 2-7；下方黑色膠囊按鈕 |
| 3 | 3: How we get there | 10327 / 2085 | 6223 / 2069 | paper | scroll（split、moveUp；左標題 sticky top-80） | 左：大標三行；右：01.–04. 列（編號｜直線｜標題＋↳ 描述），底線分隔；下方 DELIVERABLES（粉紅標）＋ COST/TIME 大數字 |
| — | Video | 12412 / 900 | 8292 / 500 | — | lazyload 自動播放 muted loop | 滿版 h-screen |
| 4 | 4: Other things we offer | 13312 / 4234 | 8792 / 1939 | white | scroll（左 sticky top-150「SCROLL TO EXPLORE」＋右側橫向卡 A: B: C: 隨滾動位移） | 卡片：標題、↳ 描述、INCLUDES、COST/TIME 雙欄大字 |
| 5 | 5: Do's & Don'ts | 17546 / 1178 | 10731 / 1353 | gray-200 | scroll（moveUp 交錯） | 左大標；右兩欄清單 DO'S / DON'TS |
| 6 | 6: Who we've done it for | 18725 / 1363 | 12084 / 1446 | gray-200→white | scroll（split 大標；清單 moveUp 交錯） | 粉紅色帶大標 15.4rem；右側 CLIENTS: 2013-2023 ＋ 21 個名稱大字清單（底線） |
| 7 | 7: Enough about us | 20267 / 598 | 13630 / 616 | paper | scroll | 大標＋「7 QUESTIONS」＋ TAKE SURVEY 按鈕 |
| 8 | 8: Get in touch | 21045 / 1454 | 14346 / 1505 | gray-200 / paper | click（tabs CONTACT／CAREER）；表單 | 大標 15.4rem；tabs 圓點指示；底線輸入框；SEND 膠囊 |
| F | Footer / Newsletter | 22499 / 606 | — | gray-200 | static | LAXER NEWSLETTER + 大標 |

Header：fixed 50px；Menu：階梯面板（見 BEHAVIORS §4）。

## B. CHARM VILLA Gallery 對照（本專案 `/`，單頁＋錨點）

主打：真皮包、金飾；輔：金魚茶包、茶器。整體語氣＝藝廊（展區、展品編號、典藏）。文案僅用已驗證事實。

| # | 區塊（id） | 沿用原站模型 | 內容（真實素材） |
|---|---|---|---|
| 0 | `hero` | Hero：split 大標、右側圖 parallax 0.85 + ambient x、overlay fade | 大標「EVERYDAY LUXURIES」（品牌既有語句）；副標「把日常物件當作展品。」；EXHIBITS 清單：真皮包／金飾／茶包／茶器；右圖 CV-0422（白色包・沙發人物） |
| 1 | `manifesto` | 1: clip 揭開圖 + split 文字 + 左 sticky | 文案：「由藝術家與設計師主導，我們也策展——首飾、手袋、香氛與器物。每一次發表，都是一場小小的展覽。」圖 CV-0426（紙捲靜物） |
| 2 | `bags` | 2: 橫向 stack 7 卡 + 三層 parallax 背景 | 展品 01–07：CV-0398 白正面、CV-0419 藍正面、CV-0399 粉正面、CV-0420 藍斜側、CV-0400 白斜側、CV-0397 粉斜側、CV-0424 粉手提；名稱「編織提把皮革包」；標籤：荔枝紋真皮、扁平三股編織肩帶、扁銅棒；發明專利 TW I728606；按鈕→ Show more! |
| 3 | `jewelry` | 3: 左 sticky 大標 + 01.–04. 列 + DELIVERABLES 區 | 01 珍珠長鏈小金魚耳環（CV-0377）、02 吐鑽小金魚耳環・包鑲（CV-0370）、03 單鑽小金魚耳環（CV-0373）、04 雙星小金魚耳環（CV-0378）；描述：實心拋光平面金、不對稱輪廓、頭接鍊、尾自由垂墜 |
| — | `interlude` | Video 滿版 → 改為滿版圖 parallax（已知差異：無品牌影片） | CV-0380（珍珠長鏈・電影光影） |
| 4 | `tea` | 4: 左 sticky「SCROLL TO EXPLORE」+ 橫向卡 A:–E: | 五款：玫瑰與金萱、荔枝與紅玉、蜜香與東方美人、桂花與包種、洛神與焙香烏龍（kv-*.webp）；COST/TIME 欄改為 茶 / 花；註：全球 34 國設計專利、2014 Red Dot、2015 iF 金質獎 |
| 5 | `teaware` | 5: 兩欄清單 | 左：豐盛系列點心架（CV-0068）；右：木質餐具（CV-0232）、鳥形筷架（CV-0239）、銀杏茶匙禮盒（CV-0229）、木質杯墊 |
| 6 | `shown` | 6: 色帶大標 + 大字清單 | 「SHOWN AT:」清單：台北晶華酒店 麗晶精品、CHARM VILLA 京都、The Scholart Selection・洛杉磯、誠品生活南西（期間限定）、Monocle（媒體）；獎項向量：Red Dot 2014 Winner、iF Gold 2015；Regent 官方 logo |
| 7 | `show-more` | 7: CTA | 「SHOW MORE! 真皮包新品發表」10/3 台北・10/17 洛杉磯・10/31 京都；按鈕「查看邀請 →」→ CV-0425 |
| 8 | `visit` | 8: tabs（門市 VISIT／線上 ONLINE）+ 消息 | 晶華門市地址、京都門市地址與時間（週六・週日 11:00–18:00）；線上選購；NEWS 三則（8/11 禮盒預購、7/28 Monocle、7/2 誠品快閃） |
| F | `footer` | Footer | 白色 logo、錨點、Instagram、© CHARM VILLA |

## C. 已知差異（刻意）
- 字型：原站 Neue Haas Grotesk（授權）→ Jost 500/700 ＋ Noto Sans TC 500/700（開源）。
- 影片區 → 滿版圖（無品牌影片素材）。
- Typeform 問卷、Newsletter 表單、GA → 移除。
- 粉紅 `#f387c8` 強調色 → 品牌金 `#ad8b46`。
- 多頁 Swup 轉場 → 單頁錨點（Lenis scrollTo）。
