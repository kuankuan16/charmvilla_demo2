"use client";
// Scroll engine — Lenis running inside a scrollable wrapper (the reference's interaction model:
// window never scrolls; [data-page-scroller] is the real scroll container). Parameters from
// docs/research/laxer/BEHAVIORS.md §1. GSAP ScrollTrigger is bound to the same wrapper.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const SCROLLER_SELECTOR = "[data-page-scroller]";
export const CONTAINER_SELECTOR = "[data-page-container]";
export const HEADER_HEIGHT = 50;

export type Scroller = {
  lenis: Lenis | null;
  wrapper: HTMLElement;
  content: HTMLElement;
  reduced: boolean;
  scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
};

let current: Scroller | null = null;
export const getScroller = () => current;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createScroller(): Scroller | null {
  const wrapper = document.querySelector<HTMLElement>(SCROLLER_SELECTOR);
  const content = document.querySelector<HTMLElement>(CONTAINER_SELECTOR);
  if (!wrapper || !content) return null;
  if (current) current.destroy();

  const reduced = prefersReducedMotion();
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  ScrollTrigger.defaults({ scroller: wrapper });

  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: content,
      lerp: 0.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.75,
      touchMultiplier: 1,
      smoothWheel: !isSafari,
      syncTouch: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      infinite: false,
      autoRaf: false,
      anchors: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
  }

  // Header state attributes (reference: data-not-top > 50px, data-reveal-header > viewport height).
  const updateState = () => {
    const y = wrapper.scrollTop;
    wrapper.setAttribute("data-not-top", String(y > 50));
    wrapper.setAttribute("data-reveal-header", String(y > window.innerHeight));
  };
  wrapper.addEventListener("scroll", updateState, { passive: true });
  updateState();

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", onResize);

  const scrollTo: Scroller["scrollTo"] = (target, opts = {}) => {
    const offset = opts.offset ?? -HEADER_HEIGHT;
    if (lenis && !opts.immediate) {
      lenis.scrollTo(target, { offset, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      return;
    }
    let top = typeof target === "number" ? target : 0;
    if (typeof target !== "number") {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      top = el.getBoundingClientRect().top - content.getBoundingClientRect().top;
    }
    wrapper.scrollTo({ top: top + offset, behavior: opts.immediate ? "auto" : "smooth" });
  };

  // In-page anchors go through the scroller (single-page navigation).
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const id = a.getAttribute("href")!.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    scrollTo(el);
    history.replaceState(history.state, "", `#${id}`);
  };
  document.addEventListener("click", onClick);

  current = {
    lenis,
    wrapper,
    content,
    reduced,
    scrollTo,
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
    destroy: () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      wrapper.removeEventListener("scroll", updateState);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      current = null;
    },
  };
  if (coarse) wrapper.setAttribute("data-touch", "true");
  return current;
}
