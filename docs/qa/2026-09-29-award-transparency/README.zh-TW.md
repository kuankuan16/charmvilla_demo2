# 獎項透明背景與說明排列

## 交付
- Red Dot：`public/brand/awards/reddot-winner-2014-transparent.svg`。
- 首頁品牌文案區的兩個獎項，說明改排在各 logo 下方，靠左對齊。
- 原 SVG 保留，iF 左、Red Dot 右的順序維持。

## 修改方式
原生向量編輯，只移除 Red Dot 原 SVG 的整片白色矩形 path；紅色圓標、字樣及所有其他 path 完全保留。全站同素材引用使用透明版。

## 驗證
- SVG 已渲染於網站冷白背景目視檢視；透明角落 alpha=0，驗證及 SHA-256 見 asset-verification.json。
- 正式建置通過，git diff --check 通過。
- 版面與線上發布結果見 deployment-verification.json。
