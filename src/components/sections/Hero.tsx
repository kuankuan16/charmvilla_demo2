// Hero — split-screen opener (paper left / stone right), oversized two-line title spanning both halves,
// Chinese subtitle, exhibits nav bottom-left, bottom-aligned portrait with caption bottom-right.
// Server component: markup + data-animation attributes only; the engine in src/lib/motion drives motion.
import { Fragment } from "react";
import { hero } from "@/data/content";
import { Label, Picture } from "@/components/ui";

export default function Hero() {
  const words = hero.title.split(" ");
  const last = hero.exhibits.length - 1;

  return (
    <section
      id="hero"
      className="relative overflow-hidden md:-mt-50 md:h-screen"
      data-animation="parallax"
      data-scroll-speed="5"
      data-start="top top"
      data-end="+=110%"
      data-start-at="0"
    >
      {/* Right half — stone ground (desktop only). */}

      {/* Title: two words, two lines, spanning both halves. */}
      <h1
        className="relative md:absolute md:left-25 lg:left-30 md:top-65 z-20 px-25 pt-30 md:p-0 text-hero-mobile md:text-[13vw] laptop:text-hero font-medium leading-xs tracking-tightest uppercase"
        data-animation="split"
        data-split="words, chars"
        data-ease="expo.out"
        data-duration="1.35"
      >
        {words.map((word, i) => (
          <Fragment key={word}>
            {i > 0 && <br />}
            {word}
          </Fragment>
        ))}
      </h1>

      {/* Subtitle (Chinese) — in flow on mobile, absolute in the left half on desktop. */}
      <p
        className="tc md:absolute md:left-25 lg:left-30 laptop:top-[30vw] md:top-[38vw] md:max-w-[40%] px-25 mt-20 md:mt-0 md:p-0 text-2xl lg:text-3xl font-bold leading-tight"
        data-animation="split"
        data-split="lines"
        data-delay="0.2"
      >
        {hero.subtitle}
      </p>

      {/* Mobile portrait — sits in a stone block under the subtitle (<768 only). */}
      <div className="md:hidden mt-25 px-25 pt-30">
        <Picture img={hero.image} sizes="100vw" className="w-full" />
      </div>

      {/* Exhibits nav — bottom of the left half on desktop. */}
      <nav
        aria-label="展區"
        className="md:absolute md:left-25 lg:left-30 md:bottom-30 md:w-[calc(50%-55px)] px-25 py-30 md:p-0"
        data-animation="moveUp"
        data-delay="0.4"
      >
        <Label className="mb-10">{hero.exhibitsLabel}</Label>
        <ul>
          {hero.exhibits.map((ex, i) => (
            <li key={ex.href}>
              <a href={ex.href} className={`group flex items-center justify-between border-t border-ink/20 py-8 ${i === last ? "border-b" : ""}`}>
                <span className="text-base font-bold">
                  <span className="link-underline">{ex.label}</span>
                  <span className="tc ml-8 text-xs font-medium text-stone-deep">{ex.zh}</span>
                </span>
                <span className="dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop portrait — bottom-aligned in the right half, mouse drift + scroll parallax. */}
      <div data-animation="ambient-move" data-ambient-direction="x" className="hidden md:block absolute bottom-0 right-[6%] laptop:right-100">
        <div data-ambient-box="" className="relative h-[42vw] w-[28vw] laptop:h-[640px] laptop:w-[430px]">
          <div data-animation="parallax" data-scroll-speed="0.85" className="absolute -top-[10%] left-0 h-[120%] w-full">
            <Picture img={hero.image} fill sizes="430px" priority className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Caption — bottom-left of the right half (desktop only). */}
      <div className="hidden md:block absolute left-[calc(50%+30px)] bottom-30 z-20 text-xs font-bold leading-none" data-animation="moveUp" data-delay="0.15">
        <div>{hero.caption.name}</div>
        <div className="mt-4">{hero.caption.role}</div>
      </div>

      {/* Scrub-to-ink overlay as the hero leaves (laptop and up).
          data-start="top top": the engine default ("top bottom") is already half-elapsed for a full-height
          element at the top of the page, which would tint the hero 50% at rest. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 hidden laptop:block bg-ink"
        data-animation="fade"
        data-from="0"
        data-to="1"
        data-scrub=""
        data-start="top top"
        data-end="bottom top"
        data-repeat=""
      />
    </section>
  );
}
