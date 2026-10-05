"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice, type Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

// One full-width ink button, after the reference's FIND RETAILERS (user 2026-10-01: 「做成加入購物車的按鈕，原本的相同功能的設計
// 拿掉」). The quantity stepper and the bar docked to the page bottom are gone; quantity is set in the bag drawer.
// Gift boxes sold "one tea per box" (心有愛、春曉、暮雪) ask for the tea first; the choice travels with the bag line (2026-10-02).
export default function AddToCart({ product }: { product: Product }) {
  const cart = useCart(); const { t } = useT();
  const choices = product.giftBox?.choices;
  const [option, setOption] = useState<number | undefined>(undefined);
  const missing = Boolean(choices) && option === undefined;
  return <>
    {choices && <fieldset className="product-variants product-choices"><legend className="tc">{t("選擇茶款（每盒擇一）", "Choose the tea (one per box)")}</legend>
      <div>{choices.map((c, i) => <label key={c.label} className="tc"><input type="radio" name={`tea-${product.slug}`} checked={option === i} onChange={() => setOption(i)} />{c.label}{c.price && c.price !== product.price?.amount ? `・${formatPrice(c.price)}` : ""}</label>)}</div>
    </fieldset>}
    <button type="button" className="product-buy tc" onClick={() => cart.add(product, 1, option)} disabled={cart.busy || missing || product.soldOut}>{product.soldOut ? t("已售罄", "Sold out") : missing ? t("請先選擇茶款", "Choose a tea first") : t("加入購物車", "Add to bag")}</button>
  </>;
}
