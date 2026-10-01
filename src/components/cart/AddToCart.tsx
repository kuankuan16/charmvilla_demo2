"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const cart = useCart(); const [qty, setQty] = useState(1); const { t } = useT();
  return (
    <div className={`add-to-cart ${compact ? "add-to-cart--compact" : ""}`}>
      {!compact && <div className="cart-qty" role="group" aria-label={t("數量", "Quantity")}><button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t("減少數量", "Decrease quantity")}>−</button><span>{qty}</span><button type="button" onClick={() => setQty((q) => q + 1)} aria-label={t("增加數量", "Increase quantity")}>+</button></div>}
      <button type="button" className="catalog-button tc" onClick={() => cart.add(product, compact ? 1 : qty)} disabled={cart.busy}>{t("加入購物車", "Add to bag")}</button>
    </div>
  );
}
