"use client";
// Right-hand cart drawer (Bang & Olufsen style): lines with quantity steppers, subtotal, shipping note, checkout.
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { productHref, categoryHref } from "@/data/catalog";
import { localeHref } from "@/i18n/config";
import { useT } from "@/i18n/LocaleProvider";

export default function CartDrawer() {
  const cart = useCart();
  const { lang, t } = useT();
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cart.setOpen(false); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [cart]);
  useEffect(() => { document.documentElement.classList.toggle("cart--open", cart.open); return () => document.documentElement.classList.remove("cart--open"); }, [cart.open]);
  const free = cart.currency === "TWD" && cart.subtotal >= 2000;
  return (
    <div className={`cart-root ${cart.open ? "is-open" : ""}`} aria-hidden={!cart.open}>
      <button type="button" className="cart-backdrop" aria-label={t("關閉購物車", "Close bag")} onClick={() => cart.setOpen(false)} tabIndex={cart.open ? 0 : -1} />
      <aside className="cart-panel" role="dialog" aria-modal="true" aria-label={t("購物車", "Bag")} inert={!cart.open}>
        <header className="cart-head"><h2 className="tc">{t("購物車", "Bag")} <span>{cart.count}</span></h2><button type="button" onClick={() => cart.setOpen(false)} aria-label={t("關閉購物車", "Close bag")} className="cart-close">✕</button></header>
        {cart.lines.length === 0 ? (
          <div className="cart-empty tc"><p>{t("購物車是空的。", "Your bag is empty.")}</p><Link href={categoryHref("tea", lang)} onClick={() => cart.setOpen(false)} className="catalog-button tc">{t("選購茶包禮盒", "Browse tea gifts")}</Link></div>
        ) : (
          <>
            <ul className="cart-lines">
              {cart.lines.map((l) => (
                <li key={l.key} className="cart-line">
                  <div className="cart-line-image">{l.image && <img src={l.image.src} alt={l.image.alt} />}</div>
                  <div className="cart-line-body">
                    <p className="tc cart-line-name">{l.slug ? <Link href={productHref(l.slug, lang)} onClick={() => cart.setOpen(false)}>{l.name}</Link> : l.name}</p>
                    <p className="cart-line-price">{l.onRequest ? t("價格洽詢", "Price on request") : cart.formatPrice(l.unitAmount, l.currency)}</p>
                    <div className="cart-line-tools">
                      <div className="cart-qty" role="group" aria-label={t("數量", "Quantity")}>
                        <button type="button" onClick={() => cart.update(l.key, l.quantity - 1)} disabled={cart.busy || l.quantity <= 1} aria-label={t("減少數量", "Decrease quantity")}>−</button>
                        <span aria-live="polite">{l.quantity}</span>
                        <button type="button" onClick={() => cart.update(l.key, l.quantity + 1)} disabled={cart.busy} aria-label={t("增加數量", "Increase quantity")}>+</button>
                      </div>
                      <button type="button" className="cart-remove tc" onClick={() => cart.remove(l.key)} disabled={cart.busy}>{t("移除", "Remove")}</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart-foot">
              {cart.error && <p className="cart-error tc" role="alert">{cart.error}</p>}
              <div className="cart-subtotal"><span className="tc">{t("小計", "Subtotal")}</span><strong>{cart.formatPrice(cart.subtotal, cart.currency)}</strong></div>
              <p className="cart-note tc">{cart.currency === "TWD" ? (free ? t("台灣宅配免運費。", "Free home delivery in Taiwan.") : t("台灣宅配運費 NT$ 120，滿 NT$ 2,000 免運。", "Home delivery in Taiwan NT$ 120; free for orders of NT$ 2,000 or more.")) : t("運費、稅金與關稅於結帳時依配送國家計算。", "Shipping, taxes and duties are calculated at checkout by destination country.")}</p>
              {cart.mode === "shopify" && cart.checkoutUrl
                ? <a href={cart.checkoutUrl} className="catalog-button cart-checkout tc">{t("前往結帳", "Go to checkout")}</a>
                : <button type="button" className="catalog-button cart-checkout tc" disabled title={t("金流串接完成後開放", "Available once payment is connected")}>{t("前往結帳", "Go to checkout")}</button>}
              <p className="cart-note tc"><Link href={localeHref(lang, "/shopping-guide#shipping")} onClick={() => cart.setOpen(false)} className="underline underline-offset-4">{t("運送、付款與退換貨說明", "Delivery, payment and returns")}</Link></p>
              {cart.mode === "local" && <p className="cart-note tc">{t("線上結帳將於 Shopify 串接完成後開放；目前可先加入購物車或洽詢門市。", "Online checkout will open once Shopify is connected. For now you can add pieces to your bag or contact a store.")}</p>}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
