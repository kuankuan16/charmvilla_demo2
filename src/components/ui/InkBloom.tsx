"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/** Organic reveal inside the existing brush texture: a dilute wash leads the pigment. */
export default function InkBloom({ active = true, observe = false, seed = 1 }: {
  active?: boolean; observe?: boolean; seed?: number;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const shapes = svg.querySelectorAll<SVGEllipseElement>("[data-ink-front]");
    const pigment = svg.querySelector<SVGRectElement>("[data-ink-pigment]")!;
    const field = svg.querySelector<SVGGElement>("[data-ink-field]")!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline | undefined;
    let observer: IntersectionObserver | undefined;
    let readiness: MutationObserver | undefined;
    let started = false;
    const show = () => {
      timeline?.kill();
      gsap.set(shapes, { attr: { rx: 1050, ry: 1200 } });
      gsap.set(pigment, { opacity: 1 });
      field.removeAttribute("filter");
      svg.dataset.inkState = "complete";
    };
    const play = () => {
      if (started) return;
      started = true;
      readiness?.disconnect();
      if (motion.matches || !active) { show(); return; }
      svg.dataset.inkState = "spreading";
      field.setAttribute("filter", `url(#ink-edge-${id})`);
      timeline = gsap.timeline({ delay: (seed % 3) * .13, onComplete: () => {
        field.removeAttribute("filter");
        svg.dataset.inkState = "complete";
      } });
      // Wet outer fronts overlap before the denser colour follows; no straight wipe edge.
      timeline.to(svg.querySelectorAll('[data-ink-front="wash"]'), {
        attr: { rx: 1050, ry: 1200 }, duration: 3.7, stagger: .17, ease: "power1.inOut",
      }, 0);
      timeline.to(svg.querySelectorAll('[data-ink-front="colour"]'), {
        attr: { rx: 1050, ry: 1200 }, duration: 3.1, stagger: .19, ease: "power1.inOut",
      }, .3);
      timeline.to(pigment, { opacity: 1, duration: 2.7, ease: "sine.inOut" }, .25);
    };
    const ready = () => {
      if (document.documentElement.classList.contains("is-revealing") || document.documentElement.classList.contains("is-loaded")) play();
      else {
        readiness = new MutationObserver(() => {
          if (document.documentElement.classList.contains("is-revealing") || document.documentElement.classList.contains("is-loaded")) play();
        });
        readiness.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      }
    };
    if (motion.matches || !active) show();
    else {
      gsap.set(shapes, { attr: { rx: 0, ry: 0 } });
      gsap.set(pigment, { opacity: .24 });
      svg.dataset.inkState = "waiting";
      if (observe) {
        // Observe the visible section, not the oversized brush which extends off screen.
        const target = svg.closest('.story-gallery, .story-message') ?? svg;
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { observer?.disconnect(); ready(); }
        }, { threshold: .12 });
        observer.observe(target);
      } else ready();
    }
    const onMotion = () => { if (motion.matches) { observer?.disconnect(); readiness?.disconnect(); show(); } };
    motion.addEventListener("change", onMotion);
    return () => {
      timeline?.kill(); observer?.disconnect(); readiness?.disconnect();
      motion.removeEventListener("change", onMotion);
    };
  }, [active, observe, seed, id]);

  return <svg ref={ref} className="ink-bloom" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <filter id={`ink-edge-${id}`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".018 .026" numOctaves="2" seed={seed + 9} result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="65" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <mask id={`ink-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="800" style={{ maskType: "alpha" }}>
        <g data-ink-field="">
          {[[160, 590], [340, 370], [440, 180]].map(([x, y], i) => <g key={i}>
            <ellipse data-ink-front="wash" cx={x} cy={y} rx="1050" ry="1200" fill="white" opacity=".28" />
            <ellipse data-ink-front="colour" cx={x + 18} cy={y - 15} rx="1050" ry="1200" fill="white" />
          </g>)}
        </g>
      </mask>
    </defs>
    <rect data-ink-pigment="" width="600" height="800" fill="var(--color-gold)" mask={`url(#ink-mask-${id})`} />
  </svg>;
}
