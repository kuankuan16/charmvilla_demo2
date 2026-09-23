# QA run — 2026-09-23 (commit ec3d7c4, production build on localhost:3123)

Harness: `scratchpad/qa/qa.mjs` (Playwright + local Chrome, headless, `--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`). Full numbers in `report.json`.

## Desktop 1440×900
- Preloader → `is-loaded` in 2.8 s; 28 screens captured (wrapper scrollHeight 21,076); 0 console errors, 0 failed requests.
- Virtual scroll: 10 wheel ticks → wrapper `scrollTop` 900, `window.scrollY` 0 (window never scrolls).
- Header: `data-not-top` false/true at 0/120 px; `data-reveal-header` true below one viewport.
- Stack (Bags): holder −4.9 px at start → −1915 px mid (active card 4) → −3390 px end (active 6); sticky panel `top` = 50 while pinned. Tea stack −6 → −1532 (active 4).
- Sticky manifesto column: top 116 → 50 as the section scrolls.
- Parallax (interlude): y −59.7 entering → +67.8 leaving.
- Menu: opens, `aria-hidden=false`, focus moves inside, Escape closes; desktop nav hides while open; stepped panels match the reference geometry.
- Tabs: click ONLINE → `aria-selected`, SHOPS panel `hidden`, opacity 1 after fade; ArrowLeft returns focus+selection to SHOPS.
- Anchor `#tea` via Lenis → section top lands at 50 px (header height).
- Cursor dot `--cursor-x/y` update on mouse move.
- Fonts: Jost 500/700 + Noto Sans TC 500/700 loaded (`document.fonts.check('700 16px Jost')` true).
- No element outside the viewport (excluding the clipped menu panels); all `[data-animation]` nodes visible after a full pass.

## Mobile 390×844 (touch)
- 27 screens (scrollHeight 19,205); 0 errors; document/wrapper scrollWidth 390 (no horizontal overflow).
- Menu (mobile list) opens/closes; tabs and keyboard work; anchor lands at 50 px; stacks fall back to vertical grids.

## prefers-reduced-motion
- Native scrolling restored (`html` overflow auto, wrapper overflow visible), Lenis not started, 0 animated nodes hidden, `is-loaded` at 22 ms.

## Fixed during QA
- Closed menu backdrop covered the page (`.menu-root` clip-path + visibility).
- `:lang(zh-Hant)` matched the whole document (html lang) so Jost never loaded → `.tc` opt-in only.
- Stack x-transforms clobbered by card `moveUp` tweens → `gsap.set`.
- `Picture fill` wrapper collapsed to 0 px; Tea card clipped its footer; Jewelry rows cramped at 390; Bags counter wrapped; Hero portrait overlapped at 768–1279; favicon 404; `metadataBase`.

## Known differences vs. davidlaxer.com (intentional)
- Typeface: Jost / Noto Sans TC instead of the licensed Neue Haas Grotesk.
- Hero: still photograph instead of video; no Typeform / newsletter / analytics.
- Accent: brand gold `#ad8b46` instead of pink `#f387c8`.
- One page with anchors (no Swup page transitions); content and sections mapped to CHARM VILLA (see `docs/research/laxer/PAGE_TOPOLOGY.md`).
- Reference assets (fonts, media, logos) were downloaded for measurement only and are not shipped.
