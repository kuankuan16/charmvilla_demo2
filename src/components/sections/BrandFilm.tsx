"use client";

import { useEffect, useRef } from "react";
import styles from "./BrandFilm.module.css";

/** The approved 15-second edit plays once; its end is not a seamless loop. */
export default function BrandFilm({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const video = useRef<HTMLVideoElement>(null);
  const english = lang === "en";

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let inView = false;
    let wantsPlay = !motion.matches && !connection?.saveData;
    let systemPause = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      if (inView && !document.hidden && wantsPlay && !el.ended) {
        void el.play().catch(() => { /* Native controls remain available if autoplay is denied. */ });
      } else if (!el.paused) {
        systemPause = true;
        el.pause();
      }
    };
    const onPause = () => {
      if (!systemPause) wantsPlay = false;
      systemPause = false;
    };
    const onPlay = () => {
      wantsPlay = true;
      if (!inView || document.hidden) sync();
    };
    const onEnded = () => { wantsPlay = false; };
    const onMotion = () => {
      wantsPlay = !motion.matches && !connection?.saveData;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .25;
      sync();
    }, { threshold: [0, .25] });
    observer.observe(el);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    el.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", onMotion);
    return () => {
      disposed = true;
      observer.disconnect();
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", onMotion);
      el.pause();
    };
  }, []);

  return <section id="brand-film" className={styles.section} aria-label={english ? "CHARM VILLA brand film" : "CHARM VILLA 品牌影片"}>
    <video ref={video} className={styles.video} controls muted playsInline preload="none"
      width={1920} height={1080} poster="/media/hero/film/earring-to-tea-v2-poster.jpg"
      aria-label={english ? "From the earring to the tea table, a silent film" : "從耳畔到茶席，無聲影片"} aria-describedby="brand-film-description">
      <source src="/media/hero/film/earring-to-tea-v2.webm" type="video/webm" />
      <source src="/media/hero/film/earring-to-tea-v2.mp4" type="video/mp4" />
      <a href="/media/hero/film/earring-to-tea-v2.mp4">{english ? "Watch the film" : "觀看影片"}</a>
    </video>
    <p id="brand-film-description" className="sr-only">{english
      ? "Hands touch a goldfish earring. The camera moves right to a tea table, where a hand lifts the tea tag and the goldfish tea bag sways in a glass cup. A white leather bag stands behind the cup."
      : "雙手輕觸金魚耳環，鏡頭向右移至茶桌。手提起茶標，金魚茶包在玻璃杯裡輕晃，白色皮革包立在杯子後方。"}</p>
  </section>;
}
