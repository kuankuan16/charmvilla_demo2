"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

export default function CollectionBrowser({ products }: { products: Product[] }) {
  const { lang, t } = useT();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    ScrollTrigger.defaults({ scroller: window });
    let dispose: (() => void) | undefined;
    const context = gsap.context(() => { dispose = initAnimations(root.current!); }, root);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; dispose?.(); context.revert(); };
  }, [products]);
  const teaOnly = products.length > 0 && products.every(p => p.category === "tea");
  return (
    <div ref={root} className="collection-results">
      <p className="tc sr-only" role="status" aria-live="polite">{teaOnly ? t("禮盒一覽", "Gift boxes") : t("作品一覽", "Pieces")} <span>{String(products.length).padStart(2, "0")}</span></p>
      {products.length ? <div className="catalog-grid">{products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} animated lang={lang} />)}</div> : <div className="collection-empty"><h2 className="tc">{t("此系列目前沒有商品。", "No pieces in this collection yet.")}</h2></div>}
    </div>
  );
}
