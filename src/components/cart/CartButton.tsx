"use client";
import { useCart } from "./CartProvider";
import { useT } from "@/i18n/LocaleProvider";

/** Header bag icon: opens the drawer and shows the line count. */
export default function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const { t } = useT();
  return (
    <button type="button" className={`header-cart-btn ${className}`} onClick={() => cart.setOpen(true)} aria-label={t(`購物車，${cart.count} 件`, `Bag, ${cart.count} ${cart.count === 1 ? "item" : "items"}`)} title={t("購物車", "Bag")}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      {cart.count > 0 && <span className="header-cart-count" aria-hidden="true">{cart.count}</span>}
    </button>
  );
}
