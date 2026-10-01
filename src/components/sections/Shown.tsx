// Section 6 — Shown at. A gold band grows in behind the first line of the giant heading; on the right a
// big-type stockist/press list with hairlines, then the award marks (reference: "6: Who we've done it for").
// Server component; content from @/data/content only. The SVG logos use next/image directly.
import { Fragment } from "react";
import Image from "next/image";
import { shown } from "@/data/content";

export default function Shown() {
  // "SHOWN AT:" → one word per line, as the reference stacks its heading.
  const headingLines = shown.heading.split(" ");

  return (
    <section id="shown" className="relative bg-page pt-30 mb-100 lg:mb-180">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-20 h-100 bg-gold"
          data-animation="scale"
          data-scale-variant="scaleLeft"
          data-from="0"
          data-to="1"
        />
        <div className="container-x relative">
          <h2 className="text-[24vw] font-bold leading-xxs tracking-tightest laptop:text-19xl" data-animation="split" data-split="words, chars">
            {headingLines.map((word, i) => (
              <Fragment key={word}>
                {i > 0 && <br />}
                {word}
              </Fragment>
            ))}
          </h2>
        </div>
      </div>

      <div className="container-x mt-40 grid grid-cols-12 gap-x-16 lg:gap-x-20">
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="grid grid-cols-2 py-10 text-xs font-bold">
            <span>{shown.label}</span>
            <span>{shown.years}</span>
          </div>
          <ul>
            {shown.places.map((p, i) => (
              <li
                key={p.name}
                data-animation="moveUp"
                data-delay={i * 0.05}
                className="group flex items-baseline justify-between gap-20 py-10"
              >
                <span className="tc text-2xl font-bold leading-none lg:text-4xl">
                  <span className="link-underline">{p.name}</span>
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-stone-deep">{p.sub}</span>
              </li>
            ))}
          </ul>
          <div className="mt-40 flex flex-wrap items-center gap-30" data-animation="moveUp" data-delay="0.3">
            {shown.awards.map((a) => (
              <Image key={a.src} src={a.src} alt={a.alt} width={a.w} height={a.h} className="h-60 w-auto" />
            ))}
            {/* 2026-10-01 (user): transparent Regent wordmark, no black tile */}
            <Image src={shown.regent.src} alt={shown.regent.alt} width={shown.regent.w} height={shown.regent.h} className="h-32 w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
