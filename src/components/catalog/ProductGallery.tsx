"use client";
// Product page stage, after jakobsencopenhagen.com product pages (user 2026-10-01: 雜誌排版；情境圖縮圖極簡統一，無贅字):
// a tall image stays in place on the left while the right column scrolls. The right column opens with a row of small,
// uniform thumbnails without any wording, and the name, text and button sit at the foot of the first screen (`intro`);
// the specifications follow below (`children`). Choosing a thumbnail changes the tall image; the image opens enlarged.
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { ProductView } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

// A portrait photograph fills the tall frame; a square or landscape one is shown whole, so the piece is never cropped away.
const fitOf = (view: ProductView) => (view.image.h >= view.image.w * 1.1 ? "cover" : "contain");

export default function ProductGallery({ name, views, intro, children }: { name: string; views: ProductView[]; intro: ReactNode; children?: ReactNode }) {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const current = views[active];
  const move = (offset: number) => setActive((i) => (i + offset + views.length) % views.length);
  useEffect(() => {
    if (!expanded) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [expanded]);
  const close = () => dialog.current?.close();
  // The bar fixed to the bottom of the page repeats the button; it stays away while the button in the page is on screen.
  useEffect(() => {
    const target = document.querySelector(".product-intro .add-to-cart") ?? document.querySelector(".product-intro");
    const dock = document.querySelector(".product-dock");
    if (!target || !dock) return;
    const observer = new IntersectionObserver(([entry]) => dock.toggleAttribute("data-hidden", entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="product-hero" aria-labelledby="product-name">
      <div className="product-stage">
        <button ref={trigger} type="button" className="product-main-image" data-fit={fitOf(current)} onClick={() => setExpanded(true)} aria-label={t(`放大圖片：${name}・${current.label}`, `Enlarge image: ${name}, ${current.label}`)}>
          <Image key={current.image.src} src={current.image.src} alt={current.image.alt} fill sizes="(min-width:768px) 46vw, 100vw" priority />
          <span className="product-zoom" aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product-column">
        <div className="product-first">
          {views.length > 1
            ? <div className="product-thumbnails" role="group" aria-label={t(`${name}圖片`, `Images of ${name}`)}>{views.map((v, i) => <button key={v.image.src} type="button" aria-label={t(`查看${v.label}`, `View ${v.label}`)} aria-pressed={i === active} onClick={() => setActive(i)}><Image src={v.image.src} alt="" width={112} height={136} /></button>)}</div>
            : <span />}
          {intro}
        </div>
        {children}
      </div>
      <dialog ref={dialog} className="product-lightbox" aria-label={t(`${name}放大圖片`, `Enlarged image of ${name}`)} onClick={(e) => { if (e.target === e.currentTarget) close(); }} onClose={() => { setExpanded(false); trigger.current?.focus({ preventScroll: true }); }} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}>
        {expanded && <div className="product-lightbox-inner"><div className="product-lightbox-header"><span className="tc">{name} · {current.label}</span><button type="button" autoFocus onClick={close} aria-label={t("關閉放大圖片", "Close enlarged image")}>CLOSE ×</button></div><div className="product-lightbox-image"><Image src={current.image.src} alt={current.image.alt} fill sizes="95vw" className="object-contain" /></div><div className="product-lightbox-controls"><button type="button" onClick={() => move(-1)} disabled={views.length === 1} aria-label={t("上一張放大圖片", "Previous enlarged image")}>←</button><span aria-live="polite">{active + 1} / {views.length}</span><button type="button" onClick={() => move(1)} disabled={views.length === 1} aria-label={t("下一張放大圖片", "Next enlarged image")}>→</button></div></div>}
      </dialog>
    </section>
  );
}
