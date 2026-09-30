"use client";
// Right-hand cart drawer (Bang & Olufsen style): lines with quantity steppers, subtotal, shipping note, checkout.
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { productHref } from "@/data/catalog";

export default function CartDrawer() {
  const cart = useCart();
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cart.setOpen(false); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [cart]);
  useEffect(() => { document.documentElement.classList.toggle("cart--open", cart.open); return () => document.documentElement.classList.remove("cart--open"); }, [cart.open]);
  const free = cart.currency === "TWD" && cart.subtotal >= 2000;
  return (
    <div className={`cart-root ${cart.open ? "is-open" : ""}`} aria-hidden={!cart.open}>
      <button type="button" className="cart-backdrop" aria-label="關閉購物車" onClick={() => cart.setOpen(false)} tabIndex={cart.open ? 0 : -1} />
      <aside className="cart-panel" role="dialog" aria-modal="true" aria-label="購物車" inert={!cart.open}>
        <header className="cart-head"><h2 className="tc">購物車 <span>{cart.count}</span></h2><button type="button" onClick={() => cart.setOpen(false)} aria-label="關閉購物車" className="cart-close">✕</button></header>
        {cart.lines.length === 0 ? (
          <div className="cart-empty tc"><p>購物車是空的。</p><Link href="/collections/tea" onClick={() => cart.setOpen(false)} className="catalog-button tc">選購茶包禮盒</Link></div>
        ) : (
          <>
            <ul className="cart-lines">
              {cart.lines.map((l) => (
                <li key={l.key} className="cart-line">
                  <div className="cart-line-image">{l.image && <img src={l.image.src} alt={l.image.alt} />}</div>
                  <div className="cart-line-body">
                    <p className="tc cart-line-name">{l.slug ? <Link href={productHref(l.slug)} onClick={() => cart.setOpen(false)}>{l.name}</Link> : l.name}</p>
                    <p className="cart-line-price">{cart.formatPrice(l.unitAmount, l.currency)}</p>
                    <div className="cart-line-tools">
                      <div className="cart-qty" role="group" aria-label="數量">
                        <button type="button" onClick={() => cart.update(l.key, l.quantity - 1)} disabled={cart.busy || l.quantity <= 1} aria-label="減少數量">−</button>
                        <span aria-live="polite">{l.quantity}</span>
                        <button type="button" onClick={() => cart.update(l.key, l.quantity + 1)} disabled={cart.busy} aria-label="增加數量">+</button>
                      </div>
                      <button type="button" className="cart-remove tc" onClick={() => cart.remove(l.key)} disabled={cart.busy}>移除</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart-foot">
              {cart.error && <p className="cart-error tc" role="alert">{cart.error}</p>}
              <div className="cart-subtotal"><span className="tc">小計</span><strong>{cart.formatPrice(cart.subtotal, cart.currency)}</strong></div>
              <p className="cart-note tc">{cart.currency === "TWD" ? (free ? "台灣宅配免運費。" : "台灣宅配運費 NT$ 120，滿 NT$ 2,000 免運。") : "運費、稅金與關稅於結帳時依配送國家計算。"}</p>
              {cart.mode === "shopify" && cart.checkoutUrl
                ? <a href={cart.checkoutUrl} className="catalog-button cart-checkout tc">前往結帳</a>
                : <button type="button" className="catalog-button cart-checkout tc" disabled title="金流串接完成後開放">前往結帳</button>}
              {cart.mode === "local" && <p className="cart-note tc">線上結帳將於 Shopify 串接完成後開放；目前可先加入購物車或洽詢門市。</p>}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
