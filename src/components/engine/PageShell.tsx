"use client";
// Page shell: renders the scroll wrapper/container, boots the scroller + declarative animations,
// runs the preloader (scroll locked until it finishes), and mounts the cursor dot.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createScroller, prefersReducedMotion } from "@/lib/motion/scroller";
import { initAnimations } from "@/lib/motion/animations";
import Preloader from "./Preloader";
import Cursor from "./Cursor";

export default function PageShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const scrollerRef = useRef<ReturnType<typeof createScroller>>(null);
  const animationCleanup = useRef<ReturnType<typeof initAnimations> | null>(null);

  const scrollerReady = useRef(false);
  const revealed = useRef(false);
  const startAnimations = () => { if (!animationCleanup.current) animationCleanup.current = initAnimations(document); };
  // When the preloader is skipped (language switch, wordmark back to home) it calls this from its own layout effect,
  // which runs before this component's: the scroller does not exist yet. ScrollTriggers created at that moment watch
  // the window, which never scrolls here, so every reveal below the first screen stayed hidden (the blank sections
  // reported on 2026-10-01). The animations are therefore created only once the scroller exists.
  const reveal = useCallback(() => {
    revealed.current = true;
    document.documentElement.classList.add("is-revealing");
    if (scrollerReady.current) startAnimations();
  }, []);
  const complete = useCallback(() => setReady(true), []);

  useLayoutEffect(() => {
    const s = createScroller();
    scrollerRef.current = s;
    scrollerReady.current = true;
    if (revealed.current) startAnimations();
    document.documentElement.classList.add("is-loading");
    if (s && !prefersReducedMotion()) s.stop();
    return () => {
      animationCleanup.current?.();
      animationCleanup.current = null;
      scrollerReady.current = false; revealed.current = false;
      s?.destroy();
      document.documentElement.classList.remove("is-loading", "is-revealing", "is-loaded");
    };
  }, []);

  // Entrance animations start during the curtain reveal; scrolling unlocks after it finishes.
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.add("is-loaded");
    document.documentElement.classList.remove("is-loading");
    scrollerRef.current?.start();
    // Cross-page links (for example /#visit) must land in the custom scroll container.
    const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    if (hashTarget) scrollerRef.current?.scrollTo(hashTarget, { immediate: true });
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onReveal={reveal} onComplete={complete} />}
      <div className="wrapper">
        <div className="page-holder" data-transitions-container="">
          <div data-page-scroller="" data-not-top="false" data-reveal-header="false">
            <div data-page-container="">{children}</div>
          </div>
        </div>
      </div>
      <Cursor />
    </>
  );
}
