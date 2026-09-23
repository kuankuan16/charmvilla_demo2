# Manifesto.spec — `src/components/sections/Manifesto.tsx` (id="manifesto")

Data: `manifesto` (index "1:", kicker, heading, body[2], image, tail).

Reference (section "1: First impressions", white, 1394px at 1440): `relative bg-white mb-100 laptop:mb-180`. Top row: `SectionIndex n="1:"` at `container-x pt-30`, and to its right (cols 7–12) the kicker as `Label` + a short bold line. Body: 12-col grid `container-x`. Left cols 1–6: image with `data-animation="clip"` (left→right reveal), `Picture` of `manifesto.image` (portrait 896×1120) inside `aspect-[4/5]` box with `fill`; a 10px dot sits at the image's bottom-right corner (`dot` absolute). Right cols 7–12: a `laptop:sticky laptop:top-50` block: heading = `Heading` (tc) `text-3xl lg:text-4xl leading-tight` (`manifesto.heading`), then a `Rule`, then each `manifesto.body` line as `<p class="tc text-xl lg:text-2xl font-bold leading-tight" data-animation="split" data-split="lines" data-delay="0.1">`, separated by `Rule`s, then `manifesto.tail` in `text-base tc text-stone-deep` with `data-animation="moveUp" data-delay="0.2"`. Rows use `py-25`. Mobile: index, image full width, then text.

# Interlude.spec — `src/components/sections/Interlude.tsx` (id="interlude")

Data: `interlude.image`.

Reference: a full-bleed media block `relative grid laptop:h-screen min-h-500 overflow-hidden` (the reference plays a video here; we show a still). Inner wrapper `absolute inset-0` → `<div data-animation="parallax" data-scroll-speed="0.85" class="absolute -top-[10%] left-0 h-[120%] w-full">` containing `Picture` with `fill` and `animate={false}` (`sizes="100vw"`). Add `aria-hidden` (decorative). No text.
