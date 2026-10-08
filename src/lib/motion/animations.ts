"use client";
// Declarative animation system. Any element carrying data-animation is wired here (own implementation of
// the behaviour measured in docs/research/laxer/BEHAVIORS.md §3). Builders only add attributes.
//
//   data-animation   moveUp | split | parallax | clip | scale | fade | stack | ambient | brew-process
//   data-delay       seconds (default 0)          data-duration  seconds (default 1.25)
//   data-ease        gsap ease (default "power3")  data-start / data-end   ScrollTrigger positions
//   data-scrub       present = scrub                data-repeat   present = replay on re-enter
//   data-from / data-to   type-specific values     data-scroll-speed  parallax speed (default 1)
//   data-start-at / data-stop-at  parallax y overrides (px)
//   data-split       "lines" | "words" | "chars" | "words, chars"   data-stagger-interval (default .05)
//   data-split-animation-type  default | fade | type
//   data-scale-variant  scale | scaleLeft | scaleRight | scaleUp | scaleDown
//   data-ambient-direction "x" | "y" | "x,y"   data-ambient-movement px
//   stack: section[data-animation=stack] > sticky panel > [data-stack-cards] > [data-stack-card]*
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "./scroller";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Cleanup = () => void;

const num = (el: Element, name: string, fallback: number) => {
  const v = el.getAttribute(name);
  return v === null || v === "" ? fallback : Number(v);
};
const str = (el: Element, name: string, fallback: string) => el.getAttribute(name) ?? fallback;
const has = (el: Element, name: string) => el.hasAttribute(name);

function baseSettings(el: HTMLElement) {
  return {
    duration: num(el, "data-duration", 1.25),
    delay: num(el, "data-delay", 0),
    ease: str(el, "data-ease", "power3"),
    start: str(el, "data-start", "top bottom"),
    end: str(el, "data-end", "bottom top"),
    scrub: has(el, "data-scrub"),
    repeat: has(el, "data-repeat"),
  };
}

function trigger(el: HTMLElement, tl: gsap.core.Timeline, s: ReturnType<typeof baseSettings>) {
  return ScrollTrigger.create({
    trigger: el,
    start: s.start,
    end: s.end,
    scrub: s.scrub ? true : false,
    animation: s.scrub ? tl : undefined,
    once: !s.repeat && !s.scrub,
    toggleActions: s.repeat ? "play none none reverse" : "play complete none none",
    onEnter: () => {
      el.classList.add("is-shown");
      if (!s.scrub) tl.play();
    },
    // Reached from below without onEnter ever having fired (ScrollTrigger skips callbacks for triggers that are already
    // behind the scroll position when it refreshes): show it now instead of leaving it hidden.
    onEnterBack: () => {
      if (s.scrub) return;
      if (s.repeat || !el.classList.contains("is-shown")) { el.classList.add("is-shown"); tl.play(); }
    },
    onLeaveBack: () => {
      if (s.repeat && !s.scrub) tl.reverse();
    },
  });
}

function moveUp(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const from = num(el, "data-from", 40);
  gsap.set(el, { y: from, opacity: 0 });
  const tl = gsap.timeline({ paused: true }).to(el, { y: 0, opacity: 1, duration: s.duration, delay: s.delay, ease: s.ease, clearProps: "transform,opacity" });
  const st = trigger(el, tl, s);
  return () => { st.kill(); tl.kill(); };
}

function split(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const type = str(el, "data-split", "lines");
  const interval = num(el, "data-stagger-interval", 0.05);
  const variant = str(el, "data-split-animation-type", "default");
  const wantsLines = /lines/.test(type);
  const splitter = new SplitText(el, {
    type: type as never,
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    tag: "span",
  });
  let targets: Element[] = /chars/.test(type) ? splitter.chars : /words/.test(type) ? splitter.words : splitter.lines;
  if (wantsLines && !/chars|words/.test(type)) {
    // wrap each line in an overflow-hidden mask so lines rise into view
    splitter.lines.forEach((line) => {
      const w = document.createElement("span");
      w.className = "line-w";
      line.parentNode?.insertBefore(w, line);
      w.appendChild(line);
    });
    targets = splitter.lines;
  } else if (/chars/.test(type)) {
    splitter.words.forEach((w) => ((w as HTMLElement).style.overflow = "hidden"));
    splitter.words.forEach((w) => ((w as HTMLElement).style.display = "inline-block"));
  }
  const tl = gsap.timeline({ paused: true });
  if (variant === "fade") {
    gsap.set(targets, { opacity: num(el, "data-from", 0) });
    tl.to(targets, { opacity: num(el, "data-to", 1), duration: s.duration, delay: s.delay, ease: s.ease, stagger: { each: interval } });
  } else if (variant === "type") {
    gsap.set(targets, { visibility: "hidden" });
    tl.to(targets, { visibility: "visible", duration: s.duration, delay: s.delay, stagger: { each: interval } });
  } else {
    gsap.set(targets, { yPercent: num(el, "data-from", 105) });
    tl.call(() => targets.forEach((t) => ((t as HTMLElement).closest(".line-w") || t).classList.add("is-animated")), undefined, s.delay);
    tl.to(targets, { yPercent: 0, duration: s.duration, delay: s.delay, ease: s.ease, clearProps: "transform", stagger: { each: interval } }, 0);
  }
  const st = trigger(el, tl, s);
  return () => { st.kill(); tl.kill(); splitter.revert(); };
}

function parallax(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const speed = num(el, "data-scroll-speed", 1);
  const amp = window.innerHeight * speed * 0.1;
  const from = el.hasAttribute("data-start-at") ? num(el, "data-start-at", 0) : -amp;
  const to = el.hasAttribute("data-stop-at") ? num(el, "data-stop-at", 0) : amp;
  const tl = gsap.timeline({ paused: true }).fromTo(el, { y: from }, { y: to, ease: "none" });
  const st = ScrollTrigger.create({ trigger: el, start: s.start, end: s.end, scrub: true, animation: tl });
  return () => { st.kill(); tl.kill(); };
}

function clip(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const from = str(el, "data-from", "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)");
  const to = str(el, "data-to", "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)");
  gsap.set(el, { clipPath: from });
  const tl = gsap.timeline({ paused: true }).to(el, { clipPath: to, duration: s.duration, delay: s.delay, ease: s.ease, clearProps: "clipPath" });
  const st = trigger(el, tl, s);
  return () => { st.kill(); tl.kill(); };
}

function scale(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const variant = str(el, "data-scale-variant", "scale");
  const from = num(el, "data-from", 0);
  const to = num(el, "data-to", 1);
  const map: Record<string, { axis: "scale" | "scaleX" | "scaleY"; origin: string }> = {
    scale: { axis: "scale", origin: "50% 50%" },
    scaleLeft: { axis: "scaleX", origin: "left" },
    scaleRight: { axis: "scaleX", origin: "right" },
    scaleUp: { axis: "scaleY", origin: "50% 100%" },
    scaleDown: { axis: "scaleY", origin: "50% 0%" },
  };
  const v = map[variant] ?? map.scale;
  gsap.set(el, { [v.axis]: from, transformOrigin: v.origin });
  const tl = gsap.timeline({ paused: true }).to(el, { [v.axis]: to, duration: s.duration, delay: s.delay, ease: s.ease, clearProps: "transform" });
  const st = trigger(el, tl, s);
  return () => { st.kill(); tl.kill(); };
}

function fade(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const from = num(el, "data-from", 0);
  const to = num(el, "data-to", 1);
  gsap.set(el, { opacity: from });
  const tl = gsap.timeline({ paused: true }).to(el, { opacity: to, duration: s.duration, delay: s.delay, ease: s.scrub ? "none" : s.ease });
  const st = trigger(el, tl, s);
  return () => { st.kill(); tl.kill(); };
}

// Horizontal stack: the holder slides left across the section's scroll distance; a card that reaches the
// left edge (offset i × gap) is held there so passed cards pile up as narrow strips (measured 125px at 1440).
function stack(el: HTMLElement): Cleanup {
  const s = baseSettings(el);
  const holder = el.querySelector<HTMLElement>("[data-stack-cards]");
  const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-stack-card]"));
  if (!holder || cards.length < 2 || window.innerWidth < 1280) return () => {};
  let cardW = cards[0].getBoundingClientRect().width;
  let total = cardW * cards.length;
  let gap = (window.innerWidth - cardW) / (cards.length - 1);
  cards.forEach((c, i) => { c.style.zIndex = String(i + 1); c.style.position = "relative"; });
  const apply = (p: number) => {
    const holderX = -p * Math.max(0, total - window.innerWidth);
    // Through gsap so a card's own moveUp tween (y/opacity) cannot overwrite the stack's x.
    gsap.set(holder, { x: holderX });
    let active = 0;
    cards.forEach((c, i) => {
      const x = Math.max(0, -holderX - i * (cardW - gap));
      gsap.set(c, { x });
      if (x > 0 || i === 0) active = i;
    });
    cards.forEach((c, i) => c.classList.toggle("is-active", i === active));
    el.setAttribute("data-active-card", String(active + 1));
  };
  const st = ScrollTrigger.create({
    trigger: el,
    start: str(el, "data-start", "top top"),
    end: str(el, "data-end", "bottom bottom"),
    scrub: true,
    onUpdate: (self) => apply(self.progress),
    onRefresh: () => { cardW = cards[0].getBoundingClientRect().width; total = cardW * cards.length; gap = (window.innerWidth - cardW) / (cards.length - 1); },
  });
  apply(0);
  void s;
  return () => { st.kill(); gsap.set(holder, { clearProps: "transform" }); cards.forEach((c) => { gsap.set(c, { clearProps: "transform" }); c.style.zIndex = ""; c.classList.remove("is-active"); }); };
}

// 美好的沖泡方式 after rooferplus.webflow.io's process timeline (its IX3 data, read 2026-10-08; back on 2026-10-08 evening after one evening as
// bramwel's card stack): the hairline between each step's dot and the next fills top-down, linear, scrubbed with a 1.3 s catch-up, one segment
// after another, and stays filled; a step lights (bronze dot, filled badge and bronze icon, through CSS transitions on .is-active) when the
// fill reaches its dot, the first one from the start. Reversible. The reference's range, "30% bottom" → "50% top", finishes after the last
// step has left the middle of the window, so it ends here as the list's foot passes 55%. Without this (reduced motion) the CSS shows every
// step lit and the rail full.
//   [data-animation=brew-process] > [data-brew-steps] > [data-brew-step]* (each but the last with a .brew-line-fill)
function brewProcess(el: HTMLElement): Cleanup {
  const list = el.querySelector<HTMLElement>("[data-brew-steps]");
  const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-brew-step]"));
  const fills = steps.slice(0, -1).map((s) => s.querySelector<HTMLElement>(".brew-line-fill"));
  if (!list || steps.length < 2 || fills.some((f) => !f)) return () => {};
  const segments = fills as HTMLElement[];
  el.classList.add("is-brew-animated");
  gsap.set(segments, { scaleY: 0, transformOrigin: "50% 0%" });
  let lit = -1;
  const light = (n: number) => { if (n === lit) return; lit = n; steps.forEach((s, i) => s.classList.toggle("is-active", i <= n)); };
  light(0);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none", duration: 1 }, onUpdate: () => light(Math.min(steps.length - 1, Math.floor(tl.time() + 0.02))) });
  segments.forEach((f, i) => tl.to(f, { scaleY: 1 }, i));
  const st = ScrollTrigger.create({ trigger: list, start: str(el, "data-start", "top 80%"), end: str(el, "data-end", "bottom 55%"), scrub: 1.3, animation: tl });
  return () => { st.kill(); tl.kill(); gsap.set(segments, { clearProps: "transform" }); el.classList.remove("is-brew-animated"); steps.forEach((s) => s.classList.remove("is-active")); };
}

// Mouse-driven ambient drift (lerp .05, amplitude .005 × viewport width by default).
function ambient(el: HTMLElement): Cleanup {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return () => {};
  const boxes = Array.from(el.querySelectorAll<HTMLElement>("[data-ambient-box]"));
  if (!boxes.length) return () => {};
  const dir = str(el, "data-ambient-direction", "x,y");
  const move = num(el, "data-ambient-movement", 0.005 * window.innerWidth);
  const target = { x: 0.5, y: 0.5 }; const cur = { x: 0.5, y: 0.5 }; let active = false;
  const onMove = (e: MouseEvent) => { target.x = e.clientX / window.innerWidth; target.y = e.clientY / window.innerHeight; };
  const onEnter = () => { active = true; }; const onLeave = () => { active = false; };
  const tick = () => {
    if (!active) return;
    cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05;
    const dx = dir.includes("x") ? gsap.utils.mapRange(0, 1, move, -move, cur.x) : 0;
    const dy = dir.includes("y") ? gsap.utils.mapRange(0, 1, move, -move, cur.y) : 0;
    boxes.forEach((b, i) => { const k = 1 + i * 0.25; b.style.transform = `translate3d(${(dx * k).toFixed(2)}px,${(dy * k).toFixed(2)}px,0)`; });
  };
  el.addEventListener("mousemove", onMove); el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave);
  gsap.ticker.add(tick);
  return () => { gsap.ticker.remove(tick); el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); boxes.forEach((b) => (b.style.transform = "")); };
}

const registry: Record<string, (el: HTMLElement) => Cleanup> = { moveUp, split, parallax, clip, scale, fade, stack, ambient, "ambient-move": ambient, "brew-process": brewProcess };

export function initAnimations(root: ParentNode = document): Cleanup {
  if (prefersReducedMotion()) return () => {};
  const cleanups: Cleanup[] = [];
  // the root itself too when it carries one (BrewProcess passes its own element)
  const own = root instanceof HTMLElement && root.hasAttribute("data-animation") ? [root] : [];
  [...own, ...root.querySelectorAll<HTMLElement>("[data-animation]")].forEach((el) => {
    const type = el.getAttribute("data-animation") || "";
    const fn = registry[type];
    if (fn) cleanups.push(fn(el));
  });
  ScrollTrigger.refresh();
  return () => cleanups.forEach((c) => c());
}
