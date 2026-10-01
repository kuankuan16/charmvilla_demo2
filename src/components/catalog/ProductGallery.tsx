"use client";
// Product page first screen, layout and pointer behaviour after jakobsencopenhagen.com/en/products/kalle (user 2026-10-01:
// 「直接照這個一模一樣」「版型與滑鼠的互動請高度學習」; measurements in docs/qa/2026-10-01-product-studio-gallery/reference/):
// - the studio photographs are stacked in one frame on columns 1–6 and cross-fade in 300ms when the view changes;
// - moving the pointer over the frame brings up a thin arrow at its left and right edge (previous / next view);
// - the right column opens with 5:6 thumbnails; one frame, 4px outside the thumbnail, slides to the chosen one;
// - name, text, every specification and the ink button close the column at the foot of the image (`intro`).
// The gallery holds studio views only, all 4:5, so the image has the same size and height on every product page.
// A click on the image opens it enlarged.
// After jakobsencopenhagen.com/en/products/karla (user 2026-10-01: 「右側的情境照應該要對齊上面資訊欄的欄位，左邊商品圖會暫時固定」):
// the right column goes on under the button (`children`: story text and scene photographs, on the same columns as the
// information above them) and the image on the left stays under the header until that column has passed.
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { ProductView } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

const Arrow = ({ flip = false }: { flip?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}><path d="M13.708 5.854H.708m0 0L6.223.354M.708 5.854l5.515 5.5" stroke="currentColor" /></svg>;

export default function ProductGallery({ name, views, intro, children }: { name: string; views: ProductView[]; intro: ReactNode; children?: ReactNode }) {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [frame, setFrame] = useState<[number, number]>([0, 0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const current = views[active];
  const move = (offset: number) => setActive((i) => (i + offset + views.length) % views.length);
  useEffect(() => {
    if (!expanded) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [expanded]);
  // The single frame travels to the chosen thumbnail (the reference moves one frame instead of restyling each thumbnail).
  useEffect(() => {
    const place = () => { const el = thumbs.current?.querySelectorAll("button")[active]; if (el) setFrame([el.offsetLeft, el.offsetTop]); };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);
  const close = () => dialog.current?.close();
  return (
    <section className="product-hero" aria-labelledby="product-name">
      {/* takes the image's place in the first row, so that row is as tall as the image while the image itself spans both rows and sticks */}
      <div className="product-stage-size" aria-hidden="true" />
      <div className="product-stage">
        <div ref={stage} className="product-main-image" role="region" aria-label={t(`${name}圖片`, `Images of ${name}`)}>
          {/* quality 90 and a half-window source: this image must stay crisp on large and high-density screens */}
          {views.map((v, i) => <button key={v.image.src} type="button" className="product-slide" data-active={i === active} aria-hidden={i !== active} tabIndex={i === active ? 0 : -1} onClick={() => setExpanded(true)} aria-label={t(`放大圖片：${name}・${v.label}`, `Enlarge image: ${name}, ${v.label}`)}>
            <Image src={v.image.src} alt={v.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" quality={90} priority={i === 0} />
          </button>)}
          {views.length > 1 && <>
            <button type="button" className="product-arrow product-arrow--prev" onClick={() => move(-1)} aria-label={t("上一張", "Previous image")}><Arrow /></button>
            <button type="button" className="product-arrow product-arrow--next" onClick={() => move(1)} aria-label={t("下一張", "Next image")}><Arrow flip /></button>
          </>}
        </div>
      </div>
      <div className="product-column">
        <div className="product-first">
          {/* the space above the thumbnails and the gap under them give way first when the text is long */}
          <span className="product-first-lead" aria-hidden="true" />
          {views.length > 1 && <div ref={thumbs} className="product-thumbnails" role="group" aria-label={t(`${name}縮圖`, `Thumbnails of ${name}`)}>
            {views.map((v, i) => <button key={v.image.src} type="button" aria-label={t(`查看${v.label}`, `View ${v.label}`)} aria-pressed={i === active} onClick={() => setActive(i)}><Image src={v.image.src} alt="" width={200} height={240} sizes="100px" /></button>)}
            <span className="product-thumb-frame" aria-hidden="true" style={{ transform: `translate(${frame[0]}px, ${frame[1]}px)` }} />
          </div>}
          <span className="product-first-gap" aria-hidden="true" />
          {intro}
        </div>
      </div>
      {children && <div className="product-more">{children}</div>}
      <dialog ref={dialog} className="product-lightbox" aria-label={t(`${name}放大圖片`, `Enlarged image of ${name}`)} onClick={(e) => { if (e.target === e.currentTarget) close(); }} onClose={() => { setExpanded(false); stage.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus({ preventScroll: true }); }} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}>
        {expanded && <div className="product-lightbox-inner"><div className="product-lightbox-header"><span className="tc">{name} · {current.label}</span><button type="button" autoFocus onClick={close} aria-label={t("關閉放大圖片", "Close enlarged image")}>CLOSE ×</button></div><div className="product-lightbox-image"><Image src={current.image.src} alt={current.image.alt} fill sizes="95vw" quality={90} className="object-contain" /></div><div className="product-lightbox-controls"><button type="button" onClick={() => move(-1)} disabled={views.length === 1} aria-label={t("上一張放大圖片", "Previous enlarged image")}>←</button><span aria-live="polite">{active + 1} / {views.length}</span><button type="button" onClick={() => move(1)} disabled={views.length === 1} aria-label={t("下一張放大圖片", "Next enlarged image")}>→</button></div></div>}
      </dialog>
    </section>
  );
}
