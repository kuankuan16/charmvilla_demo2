"use client";
// Site cart. Two modes, chosen by NEXT_PUBLIC_COMMERCE_MODE:
//   "local"   (default) — lines live in localStorage with the site's official TWD list prices; no checkout yet.
//   "shopify" — lines live in a Shopify Storefront cart (id in localStorage); checkout hands off to Shopify's
//               hosted checkout (checkoutUrl), where Markets decide currency, taxes, shipping and payment.
// The UI (drawer, add-to-cart) is identical in both modes.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProducts, findProduct, formatPrice, type Product } from "@/data/catalog";
import type { Cart as ShopifyCart } from "@/lib/shopify/types";
import { useT } from "@/i18n/LocaleProvider";
import { apiMessage } from "@/i18n/errors";
import type { Locale } from "@/i18n/config";

export type CartLine = { key: string; slug: string | null; name: string; image: { src: string; alt: string } | null; quantity: number; unitAmount: number; currency: string; variantId?: string; /** no list price yet: shown as "price on request", left out of the subtotal */ onRequest?: boolean };
type Ctx = {
  mode: "local" | "shopify"; ready: boolean; open: boolean; busy: boolean; error: string | null;
  lines: CartLine[]; count: number; subtotal: number; currency: string; checkoutUrl: string | null;
  add: (product: Product, quantity?: number, option?: number) => Promise<void>; update: (key: string, quantity: number) => Promise<void>; remove: (key: string) => Promise<void>;
  setOpen: (v: boolean) => void; formatPrice: (n: number, c?: string) => string;
};

const CartContext = createContext<Ctx | null>(null);
const lineKey = (l: { slug: string; option?: number }) => (l.option === undefined ? l.slug : `${l.slug}#${l.option}`);
const LOCAL_KEY = "cv-cart", ID_KEY = "cv-cart-id";
const MODE: "local" | "shopify" = process.env.NEXT_PUBLIC_COMMERCE_MODE === "shopify" ? "shopify" : "local";

// Lines are named from the site catalogue in the page language; the stored cart itself is language-neutral (slugs / variant ids).
const linesFromShopify = (cart: ShopifyCart | null, lang: Locale): CartLine[] => (cart?.lines.edges ?? []).map(({ node }) => {
  const local = getProducts(lang).find((p) => p.shopify?.variantId === node.merchandise.id);
  return { key: node.id, slug: local?.slug ?? null, name: local?.name ?? node.merchandise.product.title, image: local ? { src: local.image.src, alt: local.image.alt } : node.merchandise.image ? { src: node.merchandise.image.url, alt: node.merchandise.image.altText ?? "" } : null, quantity: node.quantity, unitAmount: Number(node.merchandise.price.amount), currency: node.merchandise.price.currencyCode, variantId: node.merchandise.id };
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useT();
  const [ready, setReady] = useState(false); const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const [localLines, setLocalLines] = useState<{ slug: string; quantity: number; option?: number }[]>([]);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const cartId = useRef<string | null>(null);

  // boot: read the persisted cart
  useEffect(() => {
    // Deferred to a microtask so hydration finishes before the persisted cart is applied (React "no sync setState in effect").
    let cancelled = false;
    queueMicrotask(async () => {
      try {
        if (MODE === "local") { const raw = localStorage.getItem(LOCAL_KEY); if (raw && !cancelled) setLocalLines(JSON.parse(raw)); }
        else { cartId.current = localStorage.getItem(ID_KEY); if (cartId.current) { const d = await fetch(`/api/cart?id=${encodeURIComponent(cartId.current)}`).then((r) => r.json()).catch(() => null); if (!cancelled) { if (d?.cart) setShopifyCart(d.cart); else { localStorage.removeItem(ID_KEY); cartId.current = null; } } } }
      } catch { /* private mode or bad JSON */ }
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => { if (MODE === "local" && ready) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(localLines)); } catch { /* private mode */ } } }, [localLines, ready]);

  const call = useCallback(async (method: string, payload: Record<string, unknown>) => {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/cart", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: cartId.current ?? undefined, ...payload }) });
      const data = await res.json();
      if (!res.ok) throw new Error(apiMessage(lang, data, t("購物車更新失敗", "The bag could not be updated.")));
      setShopifyCart(data.cart); cartId.current = data.cart.id; localStorage.setItem(ID_KEY, data.cart.id);
    } catch (e) { setError(e instanceof Error ? e.message : t("購物車更新失敗", "The bag could not be updated.")); } finally { setBusy(false); }
  }, [lang, t]);

  // `option`: the tea chosen for a gift box sold "one tea per box" (index into product.giftBox.choices); it is part of the line key.
  const add = useCallback(async (product: Product, quantity = 1, option?: number) => {
    if (product.soldOut) return;
    setOpen(true);
    if (MODE === "shopify") { if (!product.shopify?.variantId) { setError(t("此商品尚未在 Shopify 建立對應，暫時無法加入購物車。", "This piece is not yet linked in Shopify and cannot be added to the bag for now.")); return; } const tea = option === undefined ? undefined : findProduct(product.slug, "zh")?.giftBox?.choices?.[option]?.label; await call("POST", { lines: [{ merchandiseId: product.shopify.variantId, quantity, ...(tea ? { attributes: [{ key: "茶款", value: tea }] } : {}) }] }); return; }
    setLocalLines((ls) => { const i = ls.findIndex((l) => l.slug === product.slug && l.option === option); if (i < 0) return [...ls, { slug: product.slug, quantity, ...(option === undefined ? {} : { option }) }]; const c = [...ls]; c[i] = { ...c[i], quantity: c[i].quantity + quantity }; return c; });
  }, [call, t]);
  const update = useCallback(async (key: string, quantity: number) => {
    if (quantity < 1) return;
    if (MODE === "shopify") { await call("PATCH", { lines: [{ id: key, quantity }] }); return; }
    setLocalLines((ls) => ls.map((l) => (lineKey(l) === key ? { ...l, quantity } : l)));
  }, [call]);
  const remove = useCallback(async (key: string) => {
    if (MODE === "shopify") { await call("DELETE", { lineIds: [key] }); return; }
    setLocalLines((ls) => ls.filter((l) => lineKey(l) !== key));
  }, [call]);

  const lines = useMemo<CartLine[]>(() => MODE === "shopify" ? linesFromShopify(shopifyCart, lang) : localLines.flatMap((l) => { const p = findProduct(l.slug, lang); const choice = l.option === undefined ? undefined : p?.giftBox?.choices?.[l.option]; return p ? [{ key: lineKey(l), slug: p.slug, name: choice ? `${p.name}${t(`（${choice.label}）`, ` (${choice.label})`)}` : p.name, image: { src: p.image.src, alt: p.image.alt }, quantity: l.quantity, unitAmount: choice?.price ?? p.price?.amount ?? 0, currency: p.price?.currency ?? "TWD", onRequest: !p.price }] : []; }), [localLines, shopifyCart, lang, t]);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.unitAmount * l.quantity, 0);
  const currency = lines[0]?.currency ?? "TWD";
  const value: Ctx = { mode: MODE, ready, open, busy, error, lines, count, subtotal, currency, checkoutUrl: MODE === "shopify" ? shopifyCart?.checkoutUrl ?? null : null, add, update, remove, setOpen, formatPrice };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside CartProvider"); return ctx; }
