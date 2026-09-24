"use client";
// Product cards (one per colour) + a native <dialog> detail view with switchable angles.
// Lenis is stopped while the dialog is open; focus returns to the card that opened it.
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/data/content";
import { Label, Arrow, Picture } from "@/components/ui";
import { getScroller } from "@/lib/motion/scroller";

type View = { label: string; en: string; image: Img };
type Product = { id: string; name: string; en: string; views: View[] };
type Props = {
  products: Product[];
  facts: string[];
  patent: string;
  heading: string;
  detail: { hint: string; viewsLabel: string; close: string; closeZh: string };
  cta: { label: string; href: string };
};

export default function ProductGrid({ products, facts, patent, heading, detail, cta }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, btn: HTMLButtonElement) => {
    openerRef.current = btn;
    setActive(i);
    setView(0);
  };
  const close = () => dialogRef.current?.close();

  // Show the modal once a product is selected; stop the page scroller underneath.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d || active === null) return;
    if (!d.open) d.showModal();
    getScroller()?.stop();
    return () => getScroller()?.start();
  }, [active]);

  const onClose = () => {
    setActive(null);
    openerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (active === null) return;
    const n = products[active].views.length;
    if (e.key === "ArrowRight") { e.preventDefault(); setView((v) => (v + 1) % n); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setView((v) => (v - 1 + n) % n); }
  };

  const product = active !== null ? products[active] : null;
  const current = product ? product.views[Math.min(view, product.views.length - 1)] : null;

  return (
    <>
      <div className="container-x mt-40 grid grid-cols-1 gap-y-40 md:grid-cols-3 md:gap-x-20" data-product-grid="">
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-haspopup="dialog"
            aria-label={`${p.name}｜${detail.hint}`}
            onClick={(e) => open(i, e.currentTarget)}
            className="group block w-full text-left"
            data-animation="moveUp"
            data-delay={i * 0.1}
            data-product-card={p.id}
          >
            <div className="relative aspect-[4/5] w-full bg-white">
              <Picture img={p.views[0].image} fill sizes="(min-width:768px) 30vw, 100vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            </div>
            <div className="mt-20 flex items-baseline justify-between gap-15 border-t border-ink/20 pt-15">
              <h3 className="tc text-2xl font-bold leading-none lg:text-3xl">{p.name}</h3>
              <span className="text-xs font-bold text-stone-deep">{p.en}</span>
            </div>
            <div className="mt-10 flex items-center gap-8 text-xs font-bold">
              <Arrow />
              <span className="tc link-underline">{detail.hint}</span>
              <span className="ml-auto text-stone-deep">{p.views.length} {detail.viewsLabel.replace(":", "")}</span>
            </div>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        aria-label={product ? `${heading} ${product.name}` : heading}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-ink backdrop:bg-ink/70"
        data-product-dialog=""
      >
        {product && current && (
          <div className="grid h-full grid-rows-[55dvh_1fr] md:grid-cols-12 md:grid-rows-1">
            <div className="relative bg-white md:col-span-7 md:h-dvh md:border-r md:border-ink/15">
              <div className="absolute inset-0 p-20 lg:p-40">
                <div className="relative h-full w-full">
                  <Picture key={current.image.src} img={current.image} fill fit="contain" animate={false} sizes="(min-width:768px) 58vw, 100vw" priority />
                </div>
              </div>
              <div className="absolute bottom-20 left-25 flex items-center gap-10 text-xs font-bold lg:left-40" data-product-view="">
                <span className="dot scale-75" /><span className="tc">{current.label}</span><span className="text-stone-deep">{current.en}</span>
              </div>
            </div>

            <div className="relative flex flex-col overflow-y-auto px-25 pb-30 pt-25 md:col-span-5 md:h-dvh lg:px-40 lg:pt-40">
              <button type="button" onClick={close} className="absolute right-25 top-20 flex items-center gap-10 text-xs font-bold lg:right-40" aria-label={detail.closeZh}>
                <span className="link-underline">{detail.close}</span>
                <span className="relative block h-16 w-16"><span className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rotate-45 bg-ink" /><span className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 -rotate-45 bg-ink" /></span>
              </button>

              <Label>{heading}</Label>
              <div className="mt-20 flex items-baseline gap-15">
                <h2 className="tc text-4xl font-bold leading-none lg:text-5xl">{product.name}</h2>
                <span className="text-xs font-bold text-stone-deep">{product.en}</span>
              </div>

              <div className="mt-30">
                <Label>{detail.viewsLabel}</Label>
                <div className="mt-12 grid grid-cols-4 gap-10" role="group" aria-label={detail.viewsLabel}>
                  {product.views.map((v, i) => (
                    <button key={v.image.src} type="button" onClick={() => setView(i)} aria-pressed={i === view} aria-label={`${v.label} ${v.en}`} className={`relative aspect-[4/5] w-full border transition-colors ${i === view ? "border-ink" : "border-ink/15 hover:border-ink/50"}`}>
                      <Picture img={v.image} fill animate={false} sizes="120px" className="p-1" />
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-30 border-t border-ink/20">
                {facts.map((f, i) => (
                  <li key={f} className="flex items-center gap-15 border-b border-ink/20 py-12 text-base font-bold">
                    <span className="text-xs text-stone-deep">{`0${i + 1}`}</span><span className="tc">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="tc mt-15 text-xs font-bold text-ink/70">{patent}</div>

              <div className="mt-auto pt-30">
                <a className="btn" href={cta.href} onClick={close}><span className="tc">{cta.label}</span><Arrow /></a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
