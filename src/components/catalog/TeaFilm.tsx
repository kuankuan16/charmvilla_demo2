"use client";
// The sunrise film, now at the bottom left of 美好的沖泡方式 in place of the photograph (user 2026-10-08: 「改成剛剛的影片」; first a full-width band under 茶款介紹):
// the video fills the band edge to edge (100vh, 60vh on phones, 40vh on small phones), plays muted on a loop, and a round
// frosted button at the bottom right pauses and resumes it. Kept light (user: 「官網可以瀏覽順暢 loading 不會太久」): the page
// shows only the poster until the band comes within a screen of the viewport, then fetches the 720p file on phones or the 1080p
// one elsewhere (both H.264, fast-start, muted) and plays; it pauses while scrolled away. With reduced motion it waits on its
// poster until the button is pressed.
import { useEffect, useRef, useState } from "react";

type Props = { src: string; srcSmall: string; poster: string; label: string; playLabel: string; pauseLabel: string };

export default function TeaFilm({ src, srcSmall, poster, label, playLabel, pauseLabel }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const stoppedByUser = useRef(false);
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onPlay = () => setPaused(false), onPause = () => setPaused(true);
    v.addEventListener("play", onPlay); v.addEventListener("pause", onPause);
    const attach = () => { if (!v.src) { v.src = window.matchMedia("(max-width: 767px)").matches ? srcSmall : src; v.load(); } };
    const near = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { attach(); near.disconnect(); } }, { rootMargin: "100% 0px" });
    const seen = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible) { if (!reduced && !stoppedByUser.current) { attach(); v.play().catch(() => {}); } }
      else if (!v.paused) v.pause();
    }, { threshold: 0.15 });
    near.observe(v); seen.observe(v);
    return () => { near.disconnect(); seen.disconnect(); v.removeEventListener("play", onPlay); v.removeEventListener("pause", onPause); };
  }, [src, srcSmall]);
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (!v.src) { v.src = window.matchMedia("(max-width: 767px)").matches ? srcSmall : src; v.load(); }
    if (v.paused) { stoppedByUser.current = false; v.play().catch(() => {}); } else { stoppedByUser.current = true; v.pause(); }
  };
  return (
    <figure className="tea-film" aria-label={label}>
      <video ref={video} className="tea-film-video" poster={poster} muted loop playsInline preload="none" disablePictureInPicture aria-label={label} />
      <button type="button" className="tea-film-control" onClick={toggle} aria-label={paused ? playLabel : pauseLabel} aria-pressed={paused}>
        {paused
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>}
      </button>
    </figure>
  );
}
