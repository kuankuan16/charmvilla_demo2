# QA run — 2026-09-24 (Bags e-commerce layout, official logo, CV-0427 invitation)

Same harness as `../2026-09-23` (Playwright + local Chrome, production build). Full numbers in `report.json`.

- Bags section rebuilt: white ground, 3 product cards (white / blue / pink — one card per product), large 4:5 images, click → native `<dialog>` detail with switchable angles (front / three-quarter / editorial / still life), facts, patent, CTA.
- Dialog probes (1440 and 390): opens on card click, `ArrowRight` switches the view (CV-0398 → CV-0400), `Escape` closes, focus returns to the card; Lenis is stopped while open.
- Header / preloader / footer use the official gold wordmark PNG (`public/brand/charmvilla-logo.png`).
- SHOW MORE! section shows the final invitation CV-0427 (replaces CV-0425).
- 0 console errors, 0 failed requests, no horizontal overflow at 390, all `[data-animation]` nodes visible after a full pass; Tea stack still runs (holder −6 → −1532, active card 4).
