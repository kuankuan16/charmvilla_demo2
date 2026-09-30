"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";
import { usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/catalog";

export default function CollectionBrowser({ products }: { products: Product[] }) {
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
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = products.filter((p) => words.every((word) => `${p.name} ${p.english} ${p.summary} ${p.description}`.toLocaleLowerCase().includes(word)));
  return (
    <div ref={root} className="collection-results">
      <div className="collection-tools"><p className="tc" role="status" aria-live="polite">{query ? "搜尋結果" : "作品一覽"} <span>{String(visible.length).padStart(2, "0")}</span></p><div className="collection-search"><label htmlFor="product-search" className="tc">搜尋商品</label><input id="product-search" type="search" value={query} onChange={(e) => updateQuery(e.target.value)} placeholder="名稱、風味或材質" className="tc" />{query && <button type="button" onClick={() => updateQuery("")} className="tc">清除</button>}</div></div>
      {visible.length ? <div className="catalog-grid">{visible.map((p, i) => <ProductCard key={p.slug} product={p} index={i} animated />)}</div> : <div className="collection-empty"><p className="catalog-eyebrow">KEEP EXPLORING</p><h2 className="tc">還沒找到這件物件。</h2><p className="tc">試試不同的名稱、風味或材質，或回到這個系列的完整清單。</p><button className="catalog-button tc" onClick={() => updateQuery("")}>顯示全部商品 ↗</button></div>}
    </div>
  );
}
