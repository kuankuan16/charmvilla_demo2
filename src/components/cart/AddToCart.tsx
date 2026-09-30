"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/catalog";

export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const cart = useCart(); const [qty, setQty] = useState(1);
  return (
    <div className={`add-to-cart ${compact ? "add-to-cart--compact" : ""}`}>
      {!compact && <div className="cart-qty" role="group" aria-label="數量"><button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="減少數量">−</button><span>{qty}</span><button type="button" onClick={() => setQty((q) => q + 1)} aria-label="增加數量">+</button></div>}
      <button type="button" className="catalog-button tc" onClick={() => cart.add(product, compact ? 1 : qty)} disabled={cart.busy}>加入購物車</button>
    </div>
  );
}
