# QA run — 2026-09-24 (Bags e-commerce layout, official logo, CV-0427 invitation)

Same harness as `../2026-09-23` (Playwright + local Chrome, production build). Full numbers in `report.json`.

- Bags section rebuilt: white ground, 3 product cards (white / blue / pink — one card per product), large 4:5 images, click → native `<dialog>` detail with switchable angles (front / three-quarter / editorial / still life), facts, patent, CTA.
- Dialog probes (1440 and 390): opens on card click, `ArrowRight` switches the view (CV-0398 → CV-0400), `Escape` closes, focus returns to the card; Lenis is stopped while open.
- Header / preloader / footer use the official gold wordmark PNG (`public/brand/charmvilla-logo.png`).
- SHOW MORE! section shows the final invitation CV-0427 (replaces CV-0425).
- 0 console errors, 0 failed requests, no horizontal overflow at 390, all `[data-animation]` nodes visible after a full pass; Tea stack still runs (holder −6 → −1532, active card 4).
- Visit → SHOPS: store photos replaced with the official ones from https://charmvilla.jp/#indexStore (`img_store_regent.jpg` 640×384 sha256 8a8b0553…, `img_store_kyoto.jpg` 1000×600 sha256 baab8140…; served as `public/media/site/store-regent.jpg` / `store-kyoto.jpg`); Regent hours 10:00–21:00・全年無休 and the Kyoto map link also taken from that page. Screens: `desktop-visit-stores.png`.
- New one-screen `#partners` section (between SHOWN AT and SHOW MORE!) in the LAXER "PARTNERS:" layout: image left (CV-0423, clip reveal), label top-right, statement centred (whole-block rise — split-lines reflowed because CJK subsets load after the preloader), outline pill "WORK WITH US 合作洽詢" → Instagram. Height = 100vh − 50px header so the CTA is on-screen when anchored; Latin names nowrap from md up. Screens: `desktop-partners.png`, `mobile-partners.png`.
- Grey blocks removed site-wide (user, 2026-09-24): body/html ground white; hero grey half + mobile grey block gone; Teaware, Visit heading band, news band, tab strips, Jewelry/Show More paper sections, product cards/dialog, menu panels → white with hairlines (tabs: ink underline for the active tab; Tea active card: ink border). Preloader right panel → brand gold (`bg-gold`). Full QA re-run (`report.json`): 0 errors, dialog/tabs/menu/anchor probes pass, no overflow at 390. Screens: `desktop-preloader-gold.png`, `desktop-hero-white.png`, `desktop-menu-white.png`.
