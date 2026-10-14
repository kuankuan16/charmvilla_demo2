# CHARM VILLA 美國官網待辦清單

使用者 2026-10-14 要求建立，完成就打勾。網站上的預覽頁：https://charmvilla-demo2.vercel.app/zh/tasks （由本檔產生，改完推上 main 就會更新）。
只發佈到 demo2，不動 www.charmvilla.com。

## 等 Tenten（預計 10/17 串好金流）

- [ ] 在 Vercel 填入 `SHOPIFY_STORE_DOMAIN`、`SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- [ ] 在 Vercel 填入 `SHOPIFY_ADMIN_ACCESS_TOKEN`（權限 read_customers、write_customers、read_orders）
- [ ] 把 `NEXT_PUBLIC_COMMERCE_MODE` 改成 `shopify` 並重新部署
- [ ] 會員功能確認可用後，把 `NEXT_PUBLIC_ACCOUNTS_OPEN` 改成 `true` 並重新部署
- [ ] 確認上線日，設定 `PREORDER_COUNT_SINCE`
- [ ] 在 `src/data/shopify-map.json` 填入每個商品與選項的 handle、variant GID
- [ ] Shopify 後台價格與網站完全一致：170、220、220、60、230/260、230/260、300/340、425、125、60
- [ ] 預購商品設成「缺貨時繼續銷售」
- [ ] 聖誕禮盒建 6 個 variant（綜合／玫瑰烏龍／東方美人 × Candy Cane／Stocking），名稱照 `src/data/shopify-map.json`
- [ ] 運費：阿拉斯加、夏威夷開放寄送但另計運費、不適用 US$199 免運；APO／FPO／DPO 地址先不收（客戶 10-14 §8）
- [ ] 結帳網址用 myshopify 網域或 checkout 子網域（不可設成官網網域）
- [ ] 商店開啟「傳統客戶帳戶」
- [ ] Markets 只開美國／USD、免運 US$199 本土 48 州、稅金、金流、通知信連結、結帳頁品牌樣式

## 串好後要測試

- [ ] 用測試訂單買 1 盒紫斑蝶，確認「剩餘 10 盒」變成 9 盒；取消後回到 10
- [ ] 加入購物車：無選項、有茶款／盒蓋選項、聖誕心意禮混搭三盒、預購商品
- [ ] 預購額滿時加入購物車會被擋下並顯示原因
- [ ] 登入後購物車綁到會員；登出後購物車清空
- [ ] 電子報訂閱者出現在 Shopify 顧客名單（已訂閱、`newsletter` 標籤）
- [ ] 忘記密碼、帳號啟用的信件連結回到本站

## 等客戶回覆

- [x] 聖誕禮盒（限量版）：價格、茶款、盒子、尺寸、預購數量（客戶 10-14 回覆，見下方）
- [x] 聖誕心意禮（限量版）：盒子尺寸、重量、預購數量（客戶 10-14 回覆，見下方）
- [ ] 聖誕禮盒盒蓋：拐杖糖＝橘色、聖誕襪＝藍綠色的對應是否正確
- [x] 團圓：盒子尺寸、重量（客戶 10-14 回覆，見下方）
- [x] 得獎茶：比賽名稱與年份（客戶 10-14 回覆，見下方）
- [x] 紫斑蝶「端紫斑蝶」說法的來源（客戶 10-14 回覆，見下方）
- [x] 預購規則：何時扣款、能否取消（客戶 10-14 回覆，見下方）
- [x] 聖誕節前的下單截止日（客戶 10-14 回覆，見下方）
- [x] 能否寄到阿拉斯加、夏威夷、軍郵地址（客戶 10-14 回覆，見下方）
- [ ] 陶瓷「通過 FDA 認證」：客戶 D6 指示保留，建議再確認一次（法律風險）

## 客戶回覆：產品規格與預購寄送確認（2026-10-14 Google 文件）

來源：「CHARM VILLA｜回覆 Tenten：產品規格與預購寄送確認｜2026-10-14」。使用者 2026-10-14：「用 Eagle Lite Browser 去連結這個……並直接修正」。

- [x] 1. 聖誕禮盒：US$125、綜合（玫瑰烏龍／金萱／紅玉／東方美人各 3）或玫瑰烏龍 12、東方美人 12；木盒＋刺繡布面盒蓋；尺寸重量同暮雪；Stocking／Candy Cane；預購 200 盒共用
- [ ] 1a. 待回答：客戶要英文選單標題「Choose your lid」。現在茶款和盒蓋在同一個選單（6 個選項，標題「Choose your tea and lid」）；要分成兩個選單得改購物車按鈕（另一位 agent 的範圍）
- [ ] 1b. 待回答：現在的聖誕禮盒商品圖是 10-13 生成的橘色／藍綠色盒身，客戶說是「木盒」，圖要不要重做？「手工刺繡」那條產品須知要不要留？
- [x] 2. 聖誕心意禮：US$60／3 盒一組；高密度紙盒（同京都版）；每盒 10.25 × 18.5 × 6.9 cm、約 33 公克；預購 200 組共用
- [ ] 2a. 待回答：京都版長度減半後是 10.25 × 18.5 × 6.9 cm（扁長形），和現在商品圖的小方盒看起來不一樣，請客戶確認長寬高的方向
- [x] 3. 團圓：27.4 × 14.9 × 9 cm；重量約 375 公克（估計值，(400 + 350) ÷ 2）
- [x] 4. 得獎茶：不寫比賽名稱與年份，改成「台灣每年舉辦茶葉評鑑比賽」，保留頭等獎、貳等獎、參等獎
- [x] 5. 端紫斑蝶：網站現有說法（藍紫色前翅、後翅白點與白色細紋）和客戶的產品介紹一致，不用改
- [x] 6. 預購：下單收全額、最晚 11 月底前出貨、出貨前可取消全額退款、出貨後依茶品政策（商品頁產品須知、購物車、運送與退換貨政策新增「預購付款與取消」）
- [x] 7. 聖誕下單截止日 12/15（本土 48 州），阿拉斯加、夏威夷不適用（政策、常見問題、兩款聖誕商品頁）
- [x] 8. 寄送範圍：阿拉斯加、夏威夷可寄但運費另計、不適用免運；APO／FPO／DPO 先不收（政策、常見問題）
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「預購商品於下單時收取全額款項。」→ "Pre-orders are charged in full when you place your order."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「預購商品預計最晚於 2026 年 11 月底前出貨。」→ "Pre-orders are expected to ship by the end of November 2026."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「出貨前可申請取消並獲得全額退款，請來信 us@charmvilla.com 並附上您的訂單編號。」→ "You may cancel a pre-order for a full refund before it ships. Please email us at us@charmvilla.com with your order number."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「出貨後依上方「茶品與消耗性商品」的退換貨政策處理。」→ "Once shipped, pre-orders follow our Teas & Consumable Items return policy above."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「（商品頁產品須知）預購於下單時收取全額款項；出貨前可申請取消並獲得全額退款，出貨後依茶品退換貨政策處理。」→ "Pre-orders are charged in full when you order. You may cancel for a full refund before your order ships; once shipped, our tea return policy applies."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「（聖誕商品頁）聖誕節前送達：寄送美國本土 48 州的訂單，請於 2026 年 12 月 15 日前下單；阿拉斯加與夏威夷不適用此截止日。」→ "For delivery before Christmas, please order by December 15, 2026 (contiguous 48 states). This date does not apply to Alaska or Hawaii."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「（政策頁）聖誕節下單截止日：寄送美國本土 48 州的訂單，請於 2026 年 12 月 15 日前下單，以便在聖誕節前送達。阿拉斯加與夏威夷的運送時效須另行確認，不適用此截止日。」→ "Christmas order deadline: for delivery before Christmas to the contiguous 48 states, please order by December 15, 2026. Delivery times to Alaska and Hawaii must be confirmed separately, and this deadline does not apply to them."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「阿拉斯加與夏威夷：可以寄送，運費於結帳時另計，不適用 US$ 199 免運。」→ "Alaska & Hawaii: We ship to Alaska and Hawaii. Shipping is charged at checkout, and the US$199 complimentary shipping offer does not apply."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「APO／FPO／DPO 軍郵及外交郵件地址：上線初期暫不寄送。」→ "APO/FPO/DPO addresses: At launch, we are not able to ship to military or diplomatic addresses."
- [ ] 英文待客戶確認（第 6–8 項，我們依中文翻譯）：「（運費段落新增）寄往阿拉斯加與夏威夷的運費另計，不適用免運；上線初期暫不寄送 APO／FPO／DPO 地址。」→ "Shipping to Alaska and Hawaii is charged separately and is not eligible for complimentary shipping; at launch, we do not ship to APO/FPO/DPO addresses."

## 等使用者決定

- [x] 團圓斜角圖（第 3 張）拉環：先不用重做（使用者 10/14）
- [x] 紫斑蝶手機版大圖：不用移（使用者 10/14）
- [x] 更新客戶更新報告 PDF：桌面「CHARM VILLA 美國官網 10-14 更新報告.pdf」
- [x] 電子報跳窗：先關掉，接上 Shopify（NEXT_PUBLIC_COMMERCE_MODE=shopify）後自動恢復
- [x] 分類頁卡片不顯示剩餘盒數，內頁看數量就好（使用者 10/14）
- [x] 活動頁開放時間：星期和時段分兩行、拿掉中間的小圓點
- [x] 沖泡說明圖：維持現狀，不用改（使用者 10/14）

## 上線前

- [ ] 政策頁「最後更新」日期改成正式上線日
- [ ] 上線前用真的測試訂單走一次完整流程

## 已完成（2026-10-14）

- [x] 商品卡片價格寫「起」、聖誕心意禮卡片寫「/ 3 盒一組」
- [x] 購物車預購商品顯示出貨時間
- [x] 茶禮盒產品須知加「茶品售出後恕不退換」
- [x] 補上 /favicon.ico
- [x] 拿掉「線上結帳即將開放」按鈕下方說明（10/17 串好金流再上線）
- [x] 紫斑蝶「關於臺灣的紫斑蝶」標題樣式同「故事」
- [x] 電子報接上 Shopify 顧客名單（等 Admin token）
- [x] 預購數量串好後會隨 Shopify 訂單減少，加入購物車超過剩餘數量會擋下
- [x] 預購剩餘數量全部顯示（100、20、10 盒）
- [x] 購物車前台檢查後的 8 項修正（空購物車錯誤訊息、隱私權說明、登出清購物車、會員開關等）
- [x] 商品規格：寬的時候左右兩欄，窄欄位才上下排；選茶列表齊左
- [x] 聖誕心意禮拿掉借用心有愛的尺寸與重量
- [x] 最新消息頁引言放得下就一行
- [x] 洛杉磯快閃展活動頁新版型：細線資訊表、icon、粗體小標、改寫開頭
- [x] 沖泡說明圖重畫（線條 icon、logo 金魚、茶包袋、碼錶），拿掉 01–05 數字，插畫置中、整體左移
- [x] 手機版商品卡片「預購」標籤獨立一行、對齊左邊
- [x] 沖泡步驟：文字左移貼近圓點，文字與插畫間距加寬（桌機 56px、手機 40px）
- [x] 建立 TASKS.md 與網站預覽頁 /zh/tasks
