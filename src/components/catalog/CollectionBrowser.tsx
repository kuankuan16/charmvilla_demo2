"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";
import { usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

export default function CollectionBrowser({ products }: { products: Product[] }) {
  const { lang, t } = useT();
  const root = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const query = params.get("q") || "";
  useEffect(() => {
    if (!root.current) return;
    ScrollTrigger.defaults({ scroller: window });
    let dispose: (() => void) | undefined;
    const context = gsap.context(() => { dispose = initAnimations(root.current!); }, root);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; dispose?.(); context.revert(); };
  }, [query, products]);
  const updateQuery = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("q", value); else next.delete("q");
    const suffix = next.toString();
    // Next.js patches the native History API to update useSearchParams.
    // Passing its internal history state would bypass that synchronization.
    window.history.replaceState(null, "", pathname + (suffix ? `?${suffix}` : ""));
  };
  const teaOnly = products.length > 0 && products.every(p => p.category === "tea");
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = products.filter((p) => words.every((word) => `${p.name} ${p.english} ${p.summary} ${p.description} ${p.facts.map(f => f.value).join(" ")}`.toLocaleLowerCase().includes(word)));
  return (
    <div ref={root} className="collection-results">
      <div className="collection-tools"><p className="tc" role="status" aria-live="polite">{query ? t("搜尋結果", "Search results") : teaOnly ? t("禮盒一覽", "Gift boxes") : t("作品一覽", "Pieces")} <span>{String(visible.length).padStart(2, "0")}</span></p><div className="collection-search"><label htmlFor="product-search" className="tc">{t("搜尋商品", "Search pieces")}</label><input id="product-search" type="search" value={query} onChange={(e) => updateQuery(e.target.value)} placeholder={teaOnly ? t("禮盒名稱、入數或茶款", "Box name, count or tea") : t("名稱、風味或材質", "Name, flavour or material")} className="tc" />{query && <button type="button" onClick={() => updateQuery("")} className="tc">{t("清除", "Clear")}</button>}</div></div>
      {visible.length ? <div className="catalog-grid">{visible.map((p, i) => <ProductCard key={p.slug} product={p} index={i} animated lang={lang} />)}</div> : <div className="collection-empty"><p className="catalog-eyebrow">KEEP EXPLORING</p><h2 className="tc">{t("還沒找到這件物件。", "No piece found yet.")}</h2><p className="tc">{t("試試不同的名稱、風味或材質，或回到這個系列的完整清單。", "Try a different name, flavour or material, or go back to the full list for this collection.")}</p><button className="catalog-button tc" onClick={() => updateQuery("")}>{t("顯示全部商品", "Show all pieces")}</button></div>}
    </div>
  );
}
