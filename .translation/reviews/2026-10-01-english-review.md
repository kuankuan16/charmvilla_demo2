# English review — 2026-10-01

Scope: every English string on the site (515 Chinese/English pairs in `src/`: the four data files, `craft-moments.ts`,
and the interface text in components and pages). Method: the six passes of the `reviewing-translations` skill
(semantic, terminology, linguistic, locale, structural, surface), run in the same agent context as the translation,
plus three mechanical checks. This is a machine review; no human or native-speaker review has taken place
(`human_review.status: not_requested`).

## Mechanical checks (all in `docs/qa/2026-10-01-bilingual/`)
- `pair-check.mjs` → `pair-report.json`: 515 pairs; protected terms and `${placeholders}` unchanged, digits equal,
  no CJK, no avoid-list word, no exclamation mark outside a protected term, no em dash on the English side;
  「子村莊園」 absent. 0 findings; 5 reviewed exceptions (a translated fallback inside a placeholder, 二 written as 2
  twice, a singular/plural noun, a per-language placeholder) and 3 intentionally empty English sub-labels are listed
  in the report.
- `http-check.mjs` → `http-report.json`: 39 routes × 2 languages; English pages contain no CJK in text, alt,
  aria-label, title, placeholder, meta content or JSON-LD except the language switch (中文 / 切換為中文).
- `browser-check.mjs` → `browser-report.json`: the same check on the rendered DOM of 12 sample pages after scrolling.

## Findings and corrections (first occurrence → corrected, re-reviewed, no issue detected)
| Pass | Segment | Issue | Correction |
|---|---|---|---|
| Semantic | manifesto ¶2 "gold catches at the ear as you turn" | the source has the light passing over the gold; the draft made the gold the actor | "Light settles in the grain of leather and, as you turn, passes over the gold at the ear." |
| Linguistic / style | manifesto ¶3 "Our artisans" | the style guide keeps "we/our" for stores and service text | "The artisans" |
| Semantic | tea category intro "…and send a gesture" | "send" is not in the source (選 = choose) | "Choose by box, count and tea for a gesture that finds its way into daily life." |
| Semantic | With Love Gift Box "…after a meeting" | the source leaves the invitation for an encounter, not after one | "…: an invitation to a cup of tea, left for one encounter." |
| Semantic | gift-box story title "an hour of tea" | adds a duration the source does not state | "A box of scenery, a time for tea" |
| Terminology | 年節禮 "New Year Gift", "New Year wishes" | reads as 1 January | "Lunar New Year Gift", "Lunar New Year wishes" |
| Terminology | hero slide alt "Pearl Chain Goldfish Earring" | product name is plural everywhere else | "Pearl Chain Goldfish Earrings" |
| Linguistic | pearl-chain summary "Along a pearl and a long chain" | calque of 沿著珍珠長鏈 | "Along a long chain below a pearl, one goldfish falls beside the neck." |
| Linguistic | Full Moon note "Ribbon colour is shipped at random" | awkward | "The ribbon colour is chosen at random." |
| Locale | SHOW MORE! dates `10/3`, `10/17`, `10/31` | ambiguous day/month order for readers outside Taiwan | `Oct 3`, `Oct 17`, `Oct 31` |
| Surface | box-variant chips "Paper box · 12 pieces" | "pieces" is the site's word for a work, not a count of tea bags | "Paper box · 12 tea bags" |
| Surface | image-zoom control | full-width "＋" on an English page | ASCII "+" |
| Surface | document titles "CHARM VILLA — Art as Life" | em dash; other English titles use ` | ` | "CHARM VILLA | Art as Life" |
| Surface | Partners statement | the English sentence is about twice as long as the Chinese at the same display size | one type size down on English pages only |

## Invariants checked by reading
Prices, piece counts, dimensions, shelf life, patent number (TW I728606), "34 countries", award names and years, the
three launch dates, store addresses and opening hours are identical in both languages. No urgency, scarcity,
guarantee, purity or grade claim was added. Award wording keeps "Red Dot Winner" and "iF DESIGN AWARD" as in the source.

## Open — needs the brand's confirmation (all recorded as `draft` in `draft-terminology.csv`)
- Founder's name in Latin letters: "Su Jingmei".
- Series names: "Raw Gold Series" (璞金系列), "Twin Series" (雙魚系列), "Prosperity Series" (豐盛系列).
- Award-winning teas: "First-Prize / Second-Prize / Third-Prize …" (the competition and year are not in the source).
- Kyoto store address in English ("442 Yamamoto-cho, Teramachi-dori Nijo, Nakagyo-ku, Kyoto") and the store names
  "CHARM VILLA Regent Taipei" / "CHARM VILLA Kyoto".
- Craft roles on the homepage carousel: "Paper-folding artisan", "Leather artisan", "Goldsmith", "Woodworker".
- Product names that carry wordplay keep the existing English labels ("A Rose Encounter", "Tea to Share").
- Source-side note, not a translation defect: the image shows the iF Gold Award 2015 mark while the caption says
  "iF DESIGN AWARD"; both languages follow the source.
