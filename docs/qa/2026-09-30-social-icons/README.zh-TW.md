# 頁尾社群 icon 與 preloader 去頂端字標（2026-09-30）

## 成品／交付檔
- Commit `ee9ed4a`；部署 `charmvilla-gallery-site-l17qj7wu9`。
- `src/components/ui/SocialLinks.tsx`：Facebook、Twitter（沿用官網的鳥形）、Instagram 三個 inline SVG，品牌金 `--color-gold`，22px，hover 淡出，`aria-label`／`title`、`target=_blank rel=noreferrer`。首頁與目錄頁尾共用，位置在版權文字同一列右側（取代原 INSTAGRAM 文字連結）。
- 連結來源：https://www.charmvilla.com.tw/product.php?lang=tw&tb=1 頁尾 → facebook.com/CHARMVILLA8、twitter.com/charmvilla8、instagram.com/charmvilla。
- Preloader 不再顯示頂端字標複製（先前置中的字標會被金色右半切到）。

## 已檢視／驗證
- `check.log`：0 錯誤、2 個既有 `<img>` 警告；本機 Playwright 無 pageerror；兩個頁尾的三個連結正確；`local/footer-{home,catalog}.png`、`local/preloader-first.png`（開場只有冷白／金雙面板）。
