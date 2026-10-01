"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProductView } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

export default function ProductGallery({ name, views, note }: { name: string; views: ProductView[]; note?: string }) {
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
    <div className="product-gallery" aria-label={t(`${name}圖片`, `Images of ${name}`)}>
      <button ref={trigger} type="button" className="product-main-image" onClick={() => setExpanded(true)} aria-label={t(`放大圖片：${name}・${current.label}`, `Enlarge image: ${name}, ${current.label}`)}>
        <Image src={current.image.src} alt={current.image.alt} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-contain" priority />
        <span className="product-zoom tc">{t("放大查看", "Enlarge")} <span aria-hidden="true">{t("＋", "+")}</span></span>
      </button>
      <div className="product-gallery-tools"><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")} <span className="tc">{current.label}</span></span>{views.length > 1 && <div><button type="button" aria-label={t("上一張圖片", "Previous image")} onClick={() => move(-1)}>←</button><button type="button" aria-label={t("下一張圖片", "Next image")} onClick={() => move(1)}>→</button></div>}</div>
      {views.length > 1 && <div className="product-thumbnails">{views.map((v, i) => <button key={v.image.src} type="button" aria-label={t(`查看${v.label}`, `View ${v.label}`)} aria-pressed={i === active} onClick={() => setActive(i)}><Image src={v.image.src} alt="" width={84} height={100} className="object-contain" /><span className="tc">{v.label}</span></button>)}</div>}
      {note && <p className="product-image-note tc">{note}</p>}
      <dialog ref={dialog} className="product-lightbox" aria-label={t(`${name}放大圖片`, `Enlarged image of ${name}`)} onClick={(e) => { if (e.target === e.currentTarget) close(); }} onClose={() => { setExpanded(false); trigger.current?.focus({ preventScroll: true }); }} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}>
        {expanded && <div className="product-lightbox-inner"><div className="product-lightbox-header"><span className="tc">{name} · {current.label}</span><button type="button" autoFocus onClick={close} aria-label={t("關閉放大圖片", "Close enlarged image")}>CLOSE ×</button></div><div className="product-lightbox-image"><Image src={current.image.src} alt={current.image.alt} fill sizes="95vw" className="object-contain" /></div><div className="product-lightbox-controls"><button type="button" onClick={() => move(-1)} disabled={views.length === 1} aria-label={t("上一張放大圖片", "Previous enlarged image")}>←</button><span aria-live="polite">{active + 1} / {views.length}</span><button type="button" onClick={() => move(1)} disabled={views.length === 1} aria-label={t("下一張放大圖片", "Next enlarged image")}>→</button></div></div>}
      </dialog>
    </div>
  );
}
