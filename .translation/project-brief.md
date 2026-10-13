# Translation project brief — CHARM VILLA website

Status: approved for working use by the site owner's request of 2026-10-01 (「我要做雙語」). Terminology marked `draft` in
`draft-terminology.csv` is pending owner review.

- **Product**: CHARM VILLA brand website and shop (`charmvilla-gallery-site`), a headless storefront.
- **Source locale**: `zh-Hant-TW` (Traditional Chinese, Taiwan). The Chinese copy is the approved source of truth.
- **Target locale**: `en` (US English with American spelling: *color*, *flavor*, *catalog*, *inquiries*, *authorized*;
  the US store, prices in USD. Updated 2026-10-13; British spelling was the rule before the US store).
- **Audience**: gift buyers and design-minded visitors in the United States (the US online store, shipped from California);
  press and stockists. The Taiwan and Japan stores are listed for reference only.
- **Purpose**: let an English reader browse, understand and buy the same pieces. No new claims, prices or offers.
- **Surfaces**: page copy, navigation, product names and specifications, calls to action, form labels, error and status
  text, image alt text, accessible names, page titles and descriptions, JSON-LD strings.
- **Routing** (user 2026-10-13): English, the default, at the unprefixed URL (`/collections/tea`); Chinese under `/zh`
  (`/zh/collections/tea`). Slugs are shared and never translated. Every page is rendered from `src/app/[lang]`;
  `src/proxy.ts` rewrites the unprefixed URL to the internal `/en` segment and 308-redirects the old public `/en/...` URLs
  to the unprefixed URL.
- **Where the strings live**: next to the Chinese source as `t("中文", "English")` — data in `src/data/*.ts`
  (`getContent(lang)`, `getCatalog(lang)`, `getCraftMoments(lang)`), interface text inline in each component
  (`translator(lang)` on the server, `useT()` in client components). Checks: `docs/qa/2026-10-01-bilingual/`.
- **Skills applied** (pinned copies in the assets project `.claude/skills/`): translating-core, translating-web,
  translating-marketing, translating-chinese, reviewing-translations.

## Invariants (must survive translation unchanged)
- Facts: prices, piece counts, dimensions, shelf life, dates, addresses, opening hours, patent number, award names and
  years, the number of countries with design patents, product availability notes.
- Nothing may be added that the Chinese does not say: no urgency, scarcity, guarantees, purity or grade claims.
- Protected terms in `protected-terms.txt` stay byte-for-byte.
- URLs, slugs, asset ids (CV-xxxx), structured keys.

## Adaptable devices
- Sentence rhythm, the Chinese four-character and paired-clause patterns, punctuation (「」、；、——).
- Wordplay in product names (玫好相遇、魚你分享): the existing English product names are the approved adaptations.
