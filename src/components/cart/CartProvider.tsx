"use client";
// Site cart. Two modes, chosen by NEXT_PUBLIC_COMMERCE_MODE:
//   "local"   (default) — lines live in localStorage with the site's list prices (USD on the US catalogue); no checkout yet.
//   "shopify" — lines live in a Shopify Storefront cart (id in localStorage); checkout hands off to Shopify's
//               hosted checkout (checkoutUrl), where Markets decide currency, taxes, shipping and payment.
// The UI (drawer, add-to-cart) is identical in both modes.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { findProduct, formatPrice, type Product } from "@/data/catalog";
import type { Cart as ShopifyCart } from "@/lib/shopify/types";
import { variantFor, productForVariant } from "@/lib/shopify/variants";
import { useT } from "@/i18n/LocaleProvider";
import { apiMessage } from "@/i18n/errors";
import type { Locale } from "@/i18n/config";

export type CartLine = { key: string; slug: string | null; name: string; image: { src: string; alt: string } | null; quantity: number; unitAmount: number; currency: string; variantId?: string; /** no list price yet: shown as "price on request", left out of the subtotal */ onRequest?: boolean; /** a pre-order line: the bag says so with its shipping time */ preOrder?: boolean };
type Ctx = {
  mode: "local" | "shopify"; ready: boolean; open: boolean; busy: boolean; error: string | null; /** Shopify changed a line instead of refusing it (e.g. fewer in stock) */ notice: string | null;
  lines: CartLine[]; count: number; subtotal: number; currency: string; checkoutUrl: string | null;
  add: (product: Product, quantity?: number, option?: number, mix?: number[]) => Promise<void>; update: (key: string, quantity: number) => Promise<void>; remove: (key: string) => Promise<void>;
  setOpen: (v: boolean) => void; formatPrice: (n: number, c?: string) => string;
};

const CartContext = createContext<Ctx | null>(null);
const lineKey = (l: { slug: string; option?: number; mix?: number[] }) => (l.mix ? `${l.slug}#m${l.mix.join("-")}` : l.option === undefined ? l.slug : `${l.slug}#${l.option}`);
// Mix-and-match set (雪花三盒組): `mix` counts boxes per tea, in giftBox.choices order, e.g. [2,0,1,0,0] = two boxes of the first tea, one of the third.
const mixText = (product: Product | undefined, mix: number[], sep: string, times: string) => mix.flatMap((n, i) => { const label = product?.giftBox?.choices?.[i]?.label; return n > 0 && label ? [`${label}${times}${n}`] : []; }).join(sep);
const mixFromAttrs = (attrs?: { key: string; value: string }[]) => { const raw = attrs?.find((a) => a.key === "_mix")?.value; return raw ? raw.split(",").map(Number) : undefined; };
const LOCAL_KEY = "cv-cart", ID_KEY = "cv-cart-id";
/** Fired by the account page on sign-out: the bag tied to that customer is let go, so the next person on a shared computer starts clean. */
export const SIGNED_OUT_EVENT = "cv-signed-out";
const MODE: "local" | "shopify" = process.env.NEXT_PUBLIC_COMMERCE_MODE === "shopify" ? "shopify" : "local";

// Lines are named from the site catalogue in the page language; the stored cart itself is language-neutral (slugs / variant ids).
// The variant GID tells which product and which option (tea, tea × lid colour) the line is (src/lib/shopify/variants.ts).
const linesFromShopify = (cart: ShopifyCart | null, lang: Locale, t: (zh: string, en: string) => string): CartLine[] => (cart?.lines.edges ?? []).map(({ node }) => {
  const hit = productForVariant(node.merchandise.id);
  const local = hit ? findProduct(hit.slug, lang) : undefined;
  const choice = hit?.option === undefined ? undefined : local?.giftBox?.choices?.[hit.option];
  const mix = local?.giftBox?.mixBoxes ? mixFromAttrs(node.attributes) : undefined;
  const picked = mix ? mixText(local, mix, t("、", ", "), t(" × ", " × ")) : choice?.label;
  const name = local ? (picked ? `${local.name}${t(`（${picked}）`, ` (${picked})`)}` : local.name) : node.merchandise.product.title;
  return { key: node.id, slug: local?.slug ?? null, name, image: local ? { src: local.image.src, alt: local.image.alt } : node.merchandise.image ? { src: node.merchandise.image.url, alt: node.merchandise.image.altText ?? "" } : null, quantity: node.quantity, unitAmount: Number(node.merchandise.price.amount), currency: node.merchandise.price.currencyCode, variantId: node.merchandise.id, ...(local?.preOrder ? { preOrder: true } : {}) };
});

// Line attributes travel to Shopify checkout, the order and the order emails, so they are in English (the US store's language).
// The option itself is the variant; the attribute only repeats it in words. Pre-order lines are marked so the warehouse can tell them apart.
const lineAttributes = (product: Product, option?: number, mix?: number[]) => {
  const en = findProduct(product.slug, "en");
  // a mix-and-match set: the teas in words for the warehouse, plus a hidden `_mix` (underscore keys stay out of checkout) to name the line again in the bag
  if (mix) return { attributes: [{ key: "Teas", value: mixText(en, mix, ", ", " × ") }, { key: "_mix", value: mix.join(",") }, ...(product.preOrder ? [{ key: "Pre-order", value: "Yes" }] : [])] };
  const label = option === undefined ? undefined : en?.giftBox?.choices?.[option]?.label;
  const legend = en?.giftBox?.choiceLabel?.toLowerCase() ?? "";
  const key = legend.includes("packaging") ? "Packaging" : legend === "choose your lid" ? "Lid" : legend.includes("lid") ? "Tea / Lid color" : "Tea";
  const attrs = [...(label ? [{ key, value: label }] : []), ...(product.preOrder ? [{ key: "Pre-order", value: "Yes" }] : [])];
  return attrs.length ? { attributes: attrs } : {};
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useT();
  const [ready, setReady] = useState(false); const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null); const [notice, setNotice] = useState<string | null>(null);
  const [localLines, setLocalLines] = useState<{ slug: string; quantity: number; option?: number; mix?: number[] }[]>([]);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const cartId = useRef<string | null>(null);

  // boot: read the persisted cart
  useEffect(() => {
    // Deferred to a microtask so hydration finishes before the persisted cart is applied (React "no sync setState in effect").
    let cancelled = false;
    queueMicrotask(async () => {
      try {
        if (MODE === "local") { const raw = localStorage.getItem(LOCAL_KEY); if (raw && !cancelled) setLocalLines(JSON.parse(raw)); }
        else { cartId.current = localStorage.getItem(ID_KEY); if (cartId.current) { const d = await fetch(`/api/cart?id=${encodeURIComponent(cartId.current)}`).then((r) => r.json()).catch(() => null); if (!cancelled) { if (d?.cart) setShopifyCart(d.cart); else if (d && d.configured === true && d.cart === null) { localStorage.removeItem(ID_KEY); cartId.current = null; } /* an outage or a network error keeps the id for the next visit */ } } }
      } catch { /* private mode or bad JSON */ }
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const onSignedOut = () => { try { localStorage.removeItem(ID_KEY); } catch { /* private mode */ } cartId.current = null; setShopifyCart(null); };
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
  }, []);
  useEffect(() => { if (MODE === "local" && ready) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(localLines)); } catch { /* private mode */ } } }, [localLines, ready]);

  const call = useCallback(async (method: string, payload: Record<string, unknown>) => {
    setBusy(true); setError(null); setNotice(null);
    try {
      const res = await fetch("/api/cart", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: cartId.current ?? undefined, ...payload }) });
      const data = await res.json();
      if (!res.ok) throw new Error(apiMessage(lang, data, t("購物車更新失敗", "The bag could not be updated.")));
      setShopifyCart(data.cart); cartId.current = data.cart.id; localStorage.setItem(ID_KEY, data.cart.id);
      if (data.warning) setNotice(lang === "en" ? data.warning : t("部分商品的數量已依目前庫存調整。", "Some quantities were changed to match what is in stock."));
    } catch (e) { setError(e instanceof Error ? e.message : t("購物車更新失敗", "The bag could not be updated.")); } finally { setBusy(false); }
  }, [lang, t]);

  // `option`: the tea chosen for a gift box sold "one tea per box" (index into product.giftBox.choices); it is part of the line key.
  // `mix`: boxes per tea for a mix-and-match set (product.giftBox.mixBoxes); the whole set is one line, one variant.
  const add = useCallback(async (product: Product, quantity = 1, option?: number, mix?: number[]) => {
    if (product.soldOut) return;
    setOpen(true);
    if (MODE === "shopify") {
      const merchandiseId = variantFor(product.slug, option); // one GID per option (src/data/shopify-map.json)
      if (!merchandiseId) { setError(t("此商品尚未在 Shopify 建立對應，暫時無法加入購物車。", "This piece cannot be added to the bag for now.")); return; }
      await call("POST", { lines: [{ merchandiseId, quantity, ...lineAttributes(product, option, mix) }] }); return;
    }
    const key = lineKey({ slug: product.slug, option, mix });
    setLocalLines((ls) => { const i = ls.findIndex((l) => lineKey(l) === key); if (i < 0) return [...ls, { slug: product.slug, quantity, ...(option === undefined ? {} : { option }), ...(mix ? { mix } : {}) }]; const c = [...ls]; c[i] = { ...c[i], quantity: c[i].quantity + quantity }; return c; });
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

  const lines = useMemo<CartLine[]>(() => MODE === "shopify" ? linesFromShopify(shopifyCart, lang, t) : localLines.flatMap((l) => { const p = findProduct(l.slug, lang); const choice = l.option === undefined ? undefined : p?.giftBox?.choices?.[l.option]; const picked = l.mix ? mixText(p, l.mix, t("、", ", "), t(" × ", " × ")) : choice?.label; return p ? [{ key: lineKey(l), slug: p.slug, name: picked ? `${p.name}${t(`（${picked}）`, ` (${picked})`)}` : p.name, image: { src: p.image.src, alt: p.image.alt }, quantity: l.quantity, unitAmount: choice?.price ?? p.price?.amount ?? 0, currency: p.price?.currency ?? "USD", onRequest: !p.price, ...(p.preOrder ? { preOrder: true } : {}) }] : []; }), [localLines, shopifyCart, lang, t]);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  // Shopify's own subtotal once connected (discounts and price changes match checkout); the line sum in local mode
  const subtotal = MODE === "shopify" && shopifyCart ? Number(shopifyCart.cost.subtotalAmount.amount) : lines.reduce((n, l) => n + l.unitAmount * l.quantity, 0);
  const currency = MODE === "shopify" && shopifyCart ? shopifyCart.cost.subtotalAmount.currencyCode : lines[0]?.currency ?? "USD";
  const value: Ctx = { mode: MODE, ready, open, busy, error, notice, lines, count, subtotal, currency, checkoutUrl: MODE === "shopify" ? shopifyCart?.checkoutUrl ?? null : null, add, update, remove, setOpen, formatPrice };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside CartProvider"); return ctx; }
