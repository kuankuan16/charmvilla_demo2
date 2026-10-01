"use client";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

// One full-width ink button, after the reference's FIND RETAILERS (user 2026-10-01: 「做成加入購物車的按鈕，原本的相同功能的設計
// 拿掉」). The quantity stepper and the bar docked to the page bottom are gone; quantity is set in the bag drawer.
export default function AddToCart({ product }: { product: Product }) {
  const cart = useCart(); const { t } = useT();
  return <button type="button" className="product-buy tc" onClick={() => cart.add(product, 1)} disabled={cart.busy}>{t("加入購物車", "Add to bag")}</button>;
}
