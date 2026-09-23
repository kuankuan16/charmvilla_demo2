"use client";
// Page shell: renders the scroll wrapper/container, boots the scroller + declarative animations,
// runs the preloader (scroll locked until it finishes), and mounts the cursor dot.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createScroller, prefersReducedMotion } from "@/lib/motion/scroller";
import { initAnimations } from "@/lib/motion/animations";
import Preloader from "./Preloader";
import Cursor from "./Cursor";

export default function PageShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const scrollerRef = useRef<ReturnType<typeof createScroller>>(null);

  useLayoutEffect(() => {
    const s = createScroller();
    scrollerRef.current = s;
    if (s && !prefersReducedMotion()) s.stop();
    const cleanup = initAnimations(document);
    return () => { cleanup(); s?.destroy(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.add("is-loaded");
    document.documentElement.classList.remove("is-loading");
    scrollerRef.current?.start();
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
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
