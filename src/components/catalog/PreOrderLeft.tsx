"use client";
// The pre-order tag beside the price, with the shared allowance left (客戶答覆 B7). The page is static, so it starts from the allowance in
// the data; with Shopify on, /api/preorder replaces it with the allowance minus the boxes already ordered (src/lib/shopify/preorder.ts).
// The count shows only at 10 or fewer (user 2026-10-13: 「剩餘超過10盒的都不要顯示…小於等於10才顯示出來，營造飢餓行銷感」); at 0 it reads sold out.
import { useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import type { Product } from "@/data/catalog";

const LIVE = process.env.NEXT_PUBLIC_COMMERCE_MODE === "shopify";
let request: Promise<Record<string, number> | null> | null = null;
const fetchLeft = () => (request ??= fetch("/api/preorder").then((r) => (r.ok ? r.json() : null)).then((d: { left?: Record<string, number> } | null) => d?.left ?? null).catch(() => null));

/** Boxes left for a pre-order product: the live count once read, else the static one from the data. */
export function usePreOrderLeft(product: Product) {
  const [left, setLeft] = useState(product.preOrderRemaining);
  useEffect(() => {
    if (!LIVE || product.preOrderRemaining === undefined) return;
    let on = true;
    fetchLeft().then((m) => { if (on && m && m[product.slug] !== undefined) setLeft(m[product.slug]); });
    return () => { on = false; };
  }, [product.slug, product.preOrderRemaining]);
  return left;
}

export default function PreOrderLeft({ product }: { product: Product }) {
  const { t } = useT();
  const left = usePreOrderLeft(product);
  if (left === 0) return <span className="product-soldout tc">{t("售罄", "Sold out")}</span>;
  return <span className="product-preorder tc">{left !== undefined && left <= 10 ? t(`預購・剩餘 ${left} 盒`, `Pre-order · ${left} left`) : t("預購", "Pre-order")}</span>;
}
