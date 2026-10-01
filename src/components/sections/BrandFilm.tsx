"use client";
// The brand film (earring → the camera turns to the tea table → the goldfish tea bag is drawn up by its tag), shown on
// the About page (user 2026-10-01). Muted and looped; it plays only while at least half of it is on screen, and a pause
// chosen by the visitor is kept. No autoplay under reduced motion or data saving. The film itself carries no text.
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./BrandFilm.module.css";

const FILM = "/media/hero/film/earring-to-tea-v2"; // a new cut gets a new file name: caches keep the old one otherwise

export default function BrandFilm() {
  const { t } = useT();
  const video = useRef<HTMLVideoElement>(null);
  const wantsPlay = useRef(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    el.muted = true; el.defaultMuted = true;        // React does not write the muted attribute; autoplay needs it set
    wantsPlay.current = !motion.matches && !saveData;
    let inView = false;
    const sync = () => {
      if (inView && !document.hidden && wantsPlay.current) void el.play().catch(() => { /* the play button stays available */ });
      else if (!el.paused) el.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.intersectionRatio >= .5; sync(); }, { threshold: [0, .5] });
    observer.observe(el);
    const onPlay = () => setPlaying(true), onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay); el.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect(); el.removeEventListener("play", onPlay); el.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", sync); el.pause();
    };
  }, []);

  const toggle = () => {
    const el = video.current!;
    if (el.paused) { wantsPlay.current = true; void el.play().catch(() => {}); } else { wantsPlay.current = false; el.pause(); }
  };

  return <div id="brand-film" className={styles.frame}>
    <video ref={video} className={styles.video} muted loop playsInline preload="metadata" width={1920} height={1080}
      poster={`${FILM}-poster.jpg`} aria-label={t("從耳畔到茶席，無聲影片", "From the earring to the tea table, a silent film")} aria-describedby="brand-film-description">
      <source src={`${FILM}.webm`} type="video/webm" />
      <source src={`${FILM}.mp4`} type="video/mp4" />
    </video>
    <button type="button" className={styles.toggle} data-playing={playing} aria-label={playing ? t("暫停影片", "Pause the film") : t("播放影片", "Play the film")} onClick={toggle}><span aria-hidden="true" /></button>
    <p id="brand-film-description" className="sr-only">{t(
      "雙手輕觸金魚耳環，鏡頭向右移至茶桌。手提起茶標，金魚茶包在玻璃杯裡輕晃，白色皮革包立在杯子後方。",
      "Hands touch a goldfish earring. The camera moves right to a tea table, where a hand lifts the tea tag and the goldfish tea bag sways in a glass cup. A white leather bag stands behind the cup.")}</p>
  </div>;
}
