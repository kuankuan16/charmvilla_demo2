# SHARED CONVENTIONS (paste verbatim into every builder prompt)

Repo: Next 16 (app router) + React 19 + TypeScript + Tailwind v4. Node 20. Scroll engine and animation system already exist — you only add markup with attributes.

## Hard rules
- Create/overwrite ONLY the file(s) named in your spec under `src/components/sections/`. Do not edit any other file (no global CSS, no data, no engine, no page.tsx).
- If `node_modules` is missing in your worktree: `ln -s /Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site/node_modules node_modules`.
- Finish with: `npx tsc --noEmit` clean, `npx eslint <your files>` with 0 errors, then `git add -A && git commit -m "feat(section): <Name>\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"`. Report the branch name and the files.
- Content comes ONLY from `@/data/content` (never invent copy). Images ONLY via the `Picture` primitive (next/image) — never `<img>`.
- Server components by default; add `"use client"` only if you use state/effects.

## Imports
```ts
import { hero, manifesto, bags, jewelry, interlude, tea, teaware, shown, showMore, visit, brand, sections } from "@/data/content";
import { SectionIndex, Heading, Label, Arrow, Btn, Picture, Rule } from "@/components/ui";
```
`Picture({ img, className, sizes, priority, animate=true, fill=false })` renders next/image with the 1.15→1 scale-in; pass `fill` + a sized parent for cover crops. `SectionIndex({ n })` = big "N:" numeral. `Heading({ as, children, className, delay })` = split-lines heading. `Label` = small bold label with dot. `Btn({ href, children, outline })` = pill button with arrow. `Rule` = 1px ink/20 line.

## Tokens (Tailwind v4, measured from the reference)
- Spacing unit is **1px**: `p-25` = 25px, `mb-100` = 100px, `top-50` = 50px, `gap-16` = 16px, `w-690` = 690px.
- Breakpoints: `md:` 768, `lg:` 1024, `laptop:` 1280, `wide:` 1440.
- Colours: `bg-paper` #ebeae4, `bg-white`, `bg-stone` #919598, `bg-stone-deep` #6f7275, `bg-ink` #1f1f1f, `text-ink`, `text-paper`, `text-gold` #ad8b46, `bg-gold`, `border-ink/20`.
- Type sizes: `text-xs`14 `text-sm`15 `text-base`16 `text-xl`22 `text-2xl`28 `text-3xl`34 `text-4xl`40 `text-5xl`50 `text-7xl`70 `text-8xl`82 `text-10xl`100 `text-15xl`154 `text-19xl`195 `text-21xl`210 `text-hero`12.96vw `text-hero-tablet`12.67vw `text-hero-mobile`18.5vw.
- Leading: `leading-xxs`.75 `leading-xs`.9 `leading-none`1 `leading-tight`1.1 `leading-small`1.2 `leading-base`1.3 `leading-body`1.5. Tracking: `tracking-tightest` −.05em, `tracking-wide` .08em.
- Body font is uppercase Jost 500 by default (`font-bold` = 700). **Any Chinese text must carry class `tc`** (Noto Sans TC, no uppercase).
- Side padding helper: `container-x` (25px, 30px ≥lg). Link hover underline: `link-underline` (wrap in a `group` parent to trigger from the row). Text-swap hover: `link-swap` (two spans). Dot bullet: `dot`.

## Declarative animations (add attributes; the engine does the rest)
- `data-animation="moveUp"` (+ `data-delay="0.15"`): rises 40px + fades in on enter (1.25s power3). Use for rows/cards, stagger via delays 0 / .1 / .15 / .2 / .4.
- `data-animation="split" data-split="lines"` (or `"words, chars"`, `"chars"`): text lines rise from below masks, stagger .05. `Heading` already does this.
- `data-animation="clip"`: reveals from left to right (clip-path). Put it on an image wrapper.
- `data-animation="parallax" data-scroll-speed="0.85"`: scrub-linked y movement ±(vh×speed×0.1). Give the inner image extra height (`h-[120%] -top-[10%]`) to avoid gaps.
- `data-animation="fade" data-from="0" data-to="1" data-scrub data-end="bottom top"`: scrub-linked opacity.
- `data-animation="ambient-move" data-ambient-direction="x"` on a wrapper with children `[data-ambient-box]`: mouse-driven drift (desktop only).
- `data-animation="stack" data-start="top top" data-end="bottom bottom"` on a TALL section; inside it a sticky panel (`laptop:sticky laptop:top-50`) containing `[data-stack-cards]` (a `flex laptop:w-max` row) of `[data-stack-card]` items (`laptop:w-690`). Desktop: the row scrolls horizontally as the page scrolls, passed cards pile at the left as 125px strips; the current card gets class `is-active` (style it with `[&.is-active]:bg-[#b3b6b8]`). Below 1280px the engine does nothing — make the row a vertical grid there (`grid gap-y-40 laptop:flex`).
- Sticky works (the page scrolls inside a wrapper). Use `laptop:sticky` only at ≥1280; never sticky on mobile.

## Layout language (from the reference, see screens/)
- Sections open with the big numeral (`SectionIndex`) top-left, `pt-30`, then the uppercase heading. Alternate backgrounds: paper / white / stone.
- 12-column grid (`grid grid-cols-12 gap-x-16 lg:gap-x-20`), hairline rules (`Rule` or `border-t border-ink/20`) between rows, small dots as markers, arrows `↳` (use `<Arrow />` or the character) before descriptions.
- Everything uppercase except Chinese (`tc`). Big type is bold with `tracking-tightest`.
- Mobile (390): single column, `container-x`, headings at `text-4xl`/`text-5xl`, no sticky, cards full-width stacked with `gap-y-40`.
- Provide `id="<section-id>"` on the `<section>` and keep the anchor target at the section's top.
