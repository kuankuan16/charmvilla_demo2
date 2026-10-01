# Translation decisions

- 2026-10-01 — Chinese stays at the unprefixed URL, English lives under `/en`; slugs are shared.
- 2026-10-01 — English product names are the title-cased forms of the English labels already on the site
  (`REUNION / PAPER BOX` → `Reunion | Paper Box`). The Chinese name is not shown on English pages.
- 2026-10-01 — The cart is called "bag" in English; 作品 is "piece".
- 2026-10-01 — Award names use the official English award names; years and the "Winner" / "Gold" wording follow the
  Chinese source exactly and are not strengthened.
- 2026-10-01 — Server-side error messages from the API routes stay Chinese; English pages show their own message keyed
  on the error code. Messages returned by Shopify itself are shown as Shopify sends them.
- 2026-10-01 — No automatic language redirect from the browser's Accept-Language; the switch is explicit.
- 2026-10-01 — Spelling: British (colour, flavour, catalogue, enquiries, authorised) with the one exception "jewelry",
  which follows the existing site label GOLDFISH JEWELRY.
- 2026-10-01 — The language switch is a text link in the header tools: "EN" on Chinese pages, "中文" on English pages
  (each language named in itself). Below 768 px the bar has no room, so the switch is the last row of the full-screen
  menu ("English" / "中文"). It opens the same page in the other language with a full page load.
- 2026-10-01 — On English pages the uppercase English label that accompanies a Chinese name is not repeated: the product
  page drops the `REUNION / PAPER BOX` line above the name, the collection page drops the second heading, and the menu
  and footer drop the Chinese sub-labels. Three Chinese-only sub-labels have no English counterpart by design
  (合作洽詢, 分店介紹, 最新消息).
- 2026-10-01 — Dates in English: `Oct 3`, `Aug 11` (the Chinese pages keep `10/3`, `8月11日`).
- 2026-10-01 — 年節禮 is "Lunar New Year Gift" (not "New Year Gift", which reads as 1 January).
- 2026-10-01 — Box-variant chips say "Paper box · 12 tea bags"; "goldfish" as a count noun is kept for running copy.
- 2026-10-01 — Document titles use ` | ` as the separator in English (`Reunion | Paper Box | CHARM VILLA`,
  `CHARM VILLA | Art as Life`); the Chinese titles keep `｜` and `—`.
- 2026-10-01 — The 404 page is answered in the page language from `src/app/[lang]/not-found.tsx`. Next renders this
  boundary on the client (the server sends the 404 status and an empty shell), because the root layout sits under the
  `[lang]` segment. A server-rendered alternative would need one static page for both languages.
