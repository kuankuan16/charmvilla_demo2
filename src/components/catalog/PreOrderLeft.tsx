"use client";
// The pre-order tag beside the price, with the shared allowance left (客戶答覆 B7). The page is static, so it starts from the allowance in
// the data; with Shopify on, /api/preorder replaces it with the allowance minus the boxes already ordered (src/lib/shopify/preorder.ts).
// The count always shows (user 2026-10-14: 「20 盒和 100 盒也顯示數字」, replacing 10-13 「小於等於10才顯示」); at 0 it reads sold out.
import { useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import type { Product } from "@/data/catalog";

const LIVE = process.env.NEXT_PUBLIC_COMMERCE_MODE === "shopify";
// one request shared by the tag and the button, read again when older than 30 s (the server counts at most every 30 s)
let request: { at: number; p: Promise<Record<string, number> | null> } | null = null;
export const fetchPreOrderLeft = () => {
  if (!request || Date.now() - request.at > 30_000) request = { at: Date.now(), p: fetch("/api/preorder").then((r) => (r.ok ? r.json() : null)).then((d: { left?: Record<string, number> } | null) => d?.left ?? null).catch(() => null) };
  return request.p;
};

/** Boxes left for a pre-order product: the live count once read, else the static one from the data. */
export function usePreOrderLeft(product: Pick<Product, "slug" | "preOrderRemaining">) {
  const [left, setLeft] = useState(product.preOrderRemaining);
  useEffect(() => {
    if (!LIVE || product.preOrderRemaining === undefined) return;
    let on = true;
    const read = () => fetchPreOrderLeft().then((m) => { if (on && m && m[product.slug] !== undefined) setLeft(m[product.slug]); });
    read();
    const timer = window.setInterval(read, 30_000);
    return () => { on = false; window.clearInterval(timer); };
  }, [product.slug, product.preOrderRemaining]);
  return left;
}

export default function PreOrderLeft({ product }: { product: Product }) {
  const { t } = useT();
  const left = usePreOrderLeft(product);
  if (left === 0) return <span className="product-soldout tc">{t("售罄", "Sold out")}</span>;
  // a set sold as several boxes (聖誕心意禮) counts its allowance in sets (client reply 2026-10-14 §2: 200 sets)
  const unit = product.giftBox?.mixBoxes ? "組" : "盒";
  return <span className="product-preorder tc">{left !== undefined ? t(`預購・剩餘 ${left} ${unit}`, `Pre-order · ${left} left`) : t("預購", "Pre-order")}</span>;
}

/** The card's tag on collection pages: 預購, or 售罄 once the shared allowance is used up (no count on cards). */
export function CardPreOrderTag({ product, preOrder, soldOut }: { product: Pick<Product, "slug" | "preOrderRemaining">; preOrder: string; soldOut: string }) {
  const left = usePreOrderLeft(product);
  return left === 0 ? <span className="catalog-card-soldout tc">{soldOut}</span> : <span className="catalog-card-preorder tc">{preOrder}</span>;
}
