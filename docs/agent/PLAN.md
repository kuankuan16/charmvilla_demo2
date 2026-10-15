# Active Agent Plan

Status: `in_progress`
Updated: 2026-10-15

## Active task

- 使用者最新明確要求全部改完後commit/push everything，並merge同事GitHub branch。
- 範圍：本輪SEO/schema、Search移除、配送前台、庫存快照/工具/QA、已部署Logo證據，以及最新同事checkout-tests-wip。
- 遠端已fetch，origin/main955e603；primary main基準bbf555a有本輪WIP；保留brew-cup與release工作樹。
- 完成條件：分支差異審查、不回退現行Shopify來源規則、整合測試/實際瀏覽器、commit/push main、Vercel READY與正式線上驗證。
- 無待確認問題；如果發現互斥且無已確認依據再詢問。

## Steps and evidence

| 狀態 | 動作 | 驗證 | 證據 |
| --- | --- | --- | --- |
| completed | 保存全部本輪WIP並整合origin/main | explicit staging、秘密掃描、diff | d18197e、7809393 |
| completed | 合併checkout-tests-wip並解衝突 | 現行來源、mock隔離 | 衝突已解，待merge commit |
| completed | check、Shopify/SEO/analytics/同事測試與瀏覽器 | 讀完輸出、正常/錯誤路徑 | API37、E2E16、Shopify11、SEO7、GA8、56頁crawl、live cart通過 |
| pending | commit/push main與正式驗證 | READY/alias、實際正式頁面 | 待執行 |

## FIFO queue

無。

## Completed this round

- 庫存表及聖誕心意禮三盒US$60已完成：Admin讀回、正式zh/en、Shopify11/11、check通過；實體數量/發布狀態保留。

- Logo正式修正已交付：955e603，Vercel dpl_Hg2LGAPx2mMwpbAPqbw8Gbf5UVqD READY/www/apex；正式8組viewport/motion與Ego6次上方Logo通過。詳見logo-navigation QA。

- Shopify 配送已完成並在線上生效：Hayward default/online true，Fremont/SGV online false，SGV in-person true；配送限本土48州+DC，排除13州／領地／軍郵；shipping/refund hosted policies 已發布並公開讀回。US$240免運、US$60 UPS即時價、AK/HI/AE不可寄，測試車全部清空。前台政策文字尚未部署。

- 全站 SEO／schema 本機完成、結帳 Logo 現行 redirect 已驗證。
- 預購 UI 已交付；Shopify 10 商品 custom.preorder_details 已寫入並讀回，價格／庫存／status 不變。付款 automatic at checkout 已確認；hosted shipping／refund policies 未設定。QA：docs/qa/2026-10-15-preorder-ui/README.md。
- Search UI 已完成：Node24 check 通過，中英文×1440／390×4分類共16組、舊 q、鍵盤、reduced-motion 通過。QA：docs/qa/2026-10-15-remove-search/README.md。

## Attempts and decisions

- E2E第二次英文路由修正後正常，剩下首個購物車案例中英文assertion失敗；等待輸出釐清，不能盲重跑。另發現production build會清除同在.next內的test builds，本輪已誤同時啟動check；後續所有build必須循序，這批後段瀏覽器結果作廢並重建測試後再跑。


- 同事API測試已適配現行Shopify：37/37通過。第一次隔離build缺mock CMS連線而失敗，調整為先啟動mock後build，保持正式憑證全空。
- E2E第一次英文頁在127.0.0.1實際重現ERR_TOO_MANY_REDIRECTS（zh路由另查結果）；採用同事rewrite marker修正，並限制只有非Vercel接受marker，保留正式/en canonical redirect。這是自架環境另一路由問題，與正式Logo動畫例外區分。


- 預購 UI 已正式發布：47eb598／bbf555a，Vercel dpl_8x1DtyatQMPdvycNY1jzkMLd9YDy READY，www 與 apex alias，正式 UI／購物車通過並清空。主 main／origin/main 快進 bbf555a，既有 WIP bytes 核對保留。
- SGV online fulfillment 已關閉且 reload 讀回 false、sellsInPerson=true；原專屬免費 Shipping rate 依 Shopify confirmation 移除。
- Fremont online checkbox disabled，不盲試：UI 明示它是 default location，必須先另選 default 才能關閉。為符合使用者「所有網購只用 Hayward」，下一步將 default 設為 Hayward，再關 Fremont online；不轉移／更改庫存。
- 第一次選 Hayward 後 default 區塊顯示已變，但 reload 仍回 Fremont，不能算儲存成功；原 DOM main wait 也不適用 shadow UI。下一步完整找出 Save／Unsaved bar，保存後再以實際 snapshot／checkbox disabled 狀態驗證，不重複假設 autosave。
- App 無 read_locations／legal policy scopes，維持原 scopes；透過已登入 Admin 正常 UI 操作。read_inventory 查各 location id／available 可成功，36 variants／Hayward available 合計79；QA 已保存矩陣。
- 最新 profile 讀回（132599513452）僅顯示 Hayward；費率已變為 Free UPS Ground（>=199、5–8 business days）與 UPS 3 種 calculated services，與早先 Express30／7服務不同。本輪未編輯這些 Hayward rates；以新讀回現況為準，保留現有費率、不還原舊快照。下一步先核對州選取，已對齊就不再更改。
- 使用者回答沒有其他人同步調整，繼續在已授權範圍處理；Edit shipping zone 目前顯示 US 62/62 全選，尚未修改州選取。
- Fremont toggle 後 readback 一度仍 true；不要從 optimistic UI 或 main.innerText 推論保存。下一步用新頁面、可見 checkbox 狀態與 saved toast 核對。SGV 已有 reload false 證據。

## Earlier tasks / user steering

- 全站 SEO／schema 與結帳 Logo QA 已本機完成，尚未提交／部署。
- Logo 間歇載入錯誤已於正式與本機重現，BrewProcess layout cleanup 修正後 check、12 次往返及 8 組 viewport／locale／motion 測試通過。使用者最新指定「可以先忽略」「先處理下一個預購 UI」，因此停止延伸調查與發布，保留本機成果。詳見 docs/qa/2026-10-15-logo-navigation/README.md。

## Resume

- 保存本輪WIP後merge origin/main及checkout-tests-wip；審查測試隔離、舊預購計數/會員流程與現行契約衝突，再驗證部署。
- 保留primary所有已授權WIP、brew-cup工作樹與3027、使用者localhost購物車；Ego86/p1及agent-browser logo-navigation-aae96406a56d重用。
