"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/data/catalog";
type Live = { price?: Product["price"]; soldOut?: boolean; published: boolean; preOrderRemaining?: number; variants: { id: string; price: string; availableForSale: boolean; quantityAvailable: number | null }[] };
let request: { at: number; result: Promise<Record<string, Live>> } | undefined;
function read() {
  if (!request || Date.now() - request.at > 10000) request = { at: Date.now(), result: fetch("/api/products", { cache: "no-store" }).then(async r => {
    if (!r.ok) throw new Error("Inventory unavailable");
    return (await r.json()).products;
  }) };
  return request.result;
}
export function useLiveProduct(product: Product) {
  const liveMode = process.env.NEXT_PUBLIC_COMMERCE_MODE === "shopify" && Boolean(product.shopifyData);
  const [state, setState] = useState<{ live?: Live; error: boolean; checked: boolean }>({ error: false, checked: !liveMode });
  useEffect(() => {
    if (!liveMode) return;
    let on = true;
    const update = () => read().then(data => {
      if (!data[product.slug]) throw new Error("Product unavailable");
      if (on) setState({ live: data[product.slug], error: false, checked: true });
    }).catch(() => { if (on) setState(s => ({ ...s, error: true, checked: true })); });
    update();
    const timer = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    return () => { on = false; window.clearInterval(timer); window.removeEventListener("focus", update); };
  }, [product.slug, liveMode]);
  return { ...state, price: state.live?.price ?? product.price, variants: state.live?.variants ?? product.shopifyData?.variants, soldOut: state.live?.soldOut ?? product.soldOut, preOrderRemaining: state.live?.preOrderRemaining ?? product.preOrderRemaining };
}
