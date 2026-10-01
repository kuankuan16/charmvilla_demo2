"use client";
// Product page first screen, set exactly after jakobsencopenhagen.com/en/products/holger-1-5-seater (user 2026-10-01:
// 「直接照這個一模一樣」; measurements in docs/qa/2026-10-01-product-studio-gallery/reference/): a tall studio photograph holds
// columns 1–6 and stays in place while columns 9–12 scroll. The right column opens with a row of 5:6 thumbnails (images
// only, the active one framed 4px outside), and the name, text, key facts and the button sit at the foot of the first
// screen (`intro`); the remaining specifications follow below (`children`). The gallery holds studio views only, all 4:5,
// so the tall image has the same size and height on every product page. The image opens enlarged.
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { ProductView } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

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
  return (
    <section className="product-hero" aria-labelledby="product-name">
      <div className="product-stage">
        <button ref={trigger} type="button" className="product-main-image" onClick={() => setExpanded(true)} aria-label={t(`放大圖片：${name}・${current.label}`, `Enlarge image: ${name}, ${current.label}`)}>
          {/* quality 90 and a full-width source: this image must stay crisp on large and high-density screens */}
          <Image key={current.image.src} src={current.image.src} alt={current.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" quality={90} priority />
        </button>
      </div>
      <div className="product-column">
        <div className="product-first">
          {views.length > 1
            ? <div className="product-thumbnails" role="group" aria-label={t(`${name}圖片`, `Images of ${name}`)}>{views.map((v, i) => <button key={v.image.src} type="button" aria-label={t(`查看${v.label}`, `View ${v.label}`)} aria-pressed={i === active} onClick={() => setActive(i)}><Image src={v.image.src} alt="" width={200} height={240} sizes="100px" /></button>)}</div>
            : <span />}
          {intro}
        </div>
        {children}
      </div>
      <dialog ref={dialog} className="product-lightbox" aria-label={t(`${name}放大圖片`, `Enlarged image of ${name}`)} onClick={(e) => { if (e.target === e.currentTarget) close(); }} onClose={() => { setExpanded(false); trigger.current?.focus({ preventScroll: true }); }} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}>
        {expanded && <div className="product-lightbox-inner"><div className="product-lightbox-header"><span className="tc">{name} · {current.label}</span><button type="button" autoFocus onClick={close} aria-label={t("關閉放大圖片", "Close enlarged image")}>CLOSE ×</button></div><div className="product-lightbox-image"><Image src={current.image.src} alt={current.image.alt} fill sizes="95vw" quality={90} className="object-contain" /></div><div className="product-lightbox-controls"><button type="button" onClick={() => move(-1)} disabled={views.length === 1} aria-label={t("上一張放大圖片", "Previous enlarged image")}>←</button><span aria-live="polite">{active + 1} / {views.length}</span><button type="button" onClick={() => move(1)} disabled={views.length === 1} aria-label={t("下一張放大圖片", "Next enlarged image")}>→</button></div></div>}
      </dialog>
    </section>
  );
}
