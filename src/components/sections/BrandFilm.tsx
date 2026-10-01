"use client";
// Brand film card (user 2026-10-01: 「影片我想要像 recruit.positive.co.jp：這一屏由下往上滑出來，在中間小小的區塊播放」).
// Modelled on that site's Strategy boards: the card rises from below over the previous screen and comes to rest in the
// middle of the viewport, where it holds for a stretch of scrolling; the screen behind it (the hero, pinned by
// .film-stage in globals.css) shrinks a little and takes a tint. The film plays in a small block in the middle of the
// card: muted, looped, only while the block is on screen. The film itself carries no text.
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./BrandFilm.module.css";

const FILM = "/media/hero/film/earring-to-tea-v2"; // a new cut gets a new file name: caches keep the old one otherwise

export default function BrandFilm() {
  const { t } = useT();
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const wantsPlay = useRef(true);
  const [playing, setPlaying] = useState(false);

  // How far the card has risen: 0 when its top edge enters at the bottom of the viewport, 1 when it rests in the middle.
  useEffect(() => {
    const el = card.current!;
    const stage = el.closest<HTMLElement>(".film-stage");
    if (!stage) return;
    let raf = 0, last = -1, rest = 0;
    const measure = () => { rest = parseFloat(getComputedStyle(el).top) || 0; };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const p = Math.min(1, Math.max(0, (window.innerHeight - el.getBoundingClientRect().top) / Math.max(1, window.innerHeight - rest)));
      if (Math.abs(p - last) > .002) { last = p; stage.style.setProperty("--film-p", p.toFixed(3)); }
    };
    measure(); window.addEventListener("resize", measure);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); stage.style.removeProperty("--film-p"); };
  }, []);

  // Plays only while at least half of the block is visible; a pause chosen by the visitor is kept.
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

  return <section id="brand-film" className={styles.section} aria-label={t("CHARM VILLA 品牌影片", "CHARM VILLA brand film")}>
    <div ref={card} className={styles.card}>
      <p className={styles.eyebrow}>Film</p>
      <div className={styles.frame}>
        <video ref={video} className={styles.video} muted loop playsInline preload="metadata" width={1920} height={1080}
          poster={`${FILM}-poster.jpg`} aria-label={t("從耳畔到茶席，無聲影片", "From the earring to the tea table, a silent film")} aria-describedby="brand-film-description">
          <source src={`${FILM}.webm`} type="video/webm" />
          <source src={`${FILM}.mp4`} type="video/mp4" />
        </video>
        <button type="button" className={styles.toggle} data-playing={playing} aria-label={playing ? t("暫停影片", "Pause the film") : t("播放影片", "Play the film")} onClick={toggle}><span aria-hidden="true" /></button>
      </div>
      <div className={styles.copy}>
        <h2 className={`${styles.title} tc`}>{t("淬鍊日常的詩意：當工藝遇上生活儀式", "Crafting Everyday Poetics")}</h2>
        <p className={styles.sub}>{t("Crafting Everyday Poetics — Where Artistry Meets Living.", "Where Artistry Meets Living.")}</p>
      </div>
      <p id="brand-film-description" className="sr-only">{t(
        "雙手輕觸金魚耳環，鏡頭向右移至茶桌。手提起茶標，金魚茶包在玻璃杯裡輕晃，白色皮革包立在杯子後方。",
        "Hands touch a goldfish earring. The camera moves right to a tea table, where a hand lifts the tea tag and the goldfish tea bag sways in a glass cup. A white leather bag stands behind the cup.")}</p>
    </div>
  </section>;
}
