"use client";
import { useState } from "react";
import { useProductOption } from "@/components/catalog/ProductOption";
import { useCart } from "./CartProvider";
import { formatPrice, type Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";

// One full-width ink button, after the reference's FIND RETAILERS (user 2026-10-01: 「做成加入購物車的按鈕，原本的相同功能的設計
// 拿掉」). The quantity stepper and the bar docked to the page bottom are gone; quantity is set in the bag drawer.
// Gift boxes sold "one tea per box" (心有愛、春曉、暮雪) ask for the tea first; the choice travels with the bag line (2026-10-02).
export default function AddToCart({ product }: { product: Product }) {
  const cart = useCart(); const { t } = useT();
  const choices = product.giftBox?.choices;
  const { option, setOption } = useProductOption(); // shared with the gallery (ProductOption.tsx)
  // Mix-and-match set (雪花三盒組, user 2026-10-14: 「可以自由混搭茶種（最多３種，每盒同一種口味）」): a stepper per tea, boxes counted
  // against the set size; three boxes means at most three teas. The set is one line in the bag.
  const boxes = product.giftBox?.mixBoxes;
  const [mix, setMix] = useState<number[]>(() => (choices ?? []).map(() => 0));
  const picked = mix.reduce((a, b) => a + b, 0);
  const step = (i: number, d: number) => setMix((m) => m.map((n, j) => (j === i ? n + d : n)));
  const missing = boxes ? picked !== boxes : Boolean(choices) && option === undefined;
  // No list price yet (the bird chopstick rest): the button waits instead of putting a priceless line in the bag (2026-10-13 commerce audit).
  const noPrice = !product.price;
  // Display-only pieces (客戶答覆 B1–B4, 2026-10-12) have no options and no button at all — not a disabled one.
  if (product.displayOnly) return null;
  return <>
    {choices && boxes && <fieldset className="product-variants product-mix">
      <legend className="tc">{product.giftBox?.choiceLabel}</legend>
      {/* client tea-names review 2026-10-13 §2 */}
      <p className="product-mix-help tc">{t(`請選 ${boxes} 盒，每盒 ${product.giftBox?.pieces ?? 2} 包同一種茶。`, `Choose ${boxes} boxes. Each box contains ${product.giftBox?.pieces ?? 2} tea bags of one variety.`)}</p>
      <ul>{choices.map((c, i) => <li key={c.label} className={mix[i] ? "is-picked" : undefined}>
        <span className="tc">{c.label}</span>
        <span className="product-mix-step" role="group" aria-label={t(`${c.label}的盒數`, `Boxes of ${c.label}`)}>
          <button type="button" onClick={() => step(i, -1)} disabled={!mix[i]} aria-label={t(`減少一盒${c.label}`, `One box fewer of ${c.label}`)}>−</button>
          <span aria-live="polite">{mix[i]}</span>
          <button type="button" onClick={() => step(i, 1)} disabled={picked >= boxes} aria-label={t(`增加一盒${c.label}`, `One more box of ${c.label}`)}>+</button>
        </span>
      </li>)}</ul>
      <p className="product-choice-note tc" aria-live="polite">{picked === boxes ? t(`已選好 ${boxes} 盒`, `All ${boxes} boxes chosen`) : t(`已選 ${picked}／${boxes} 盒`, `${picked} of ${boxes} boxes chosen`)}</p>
    </fieldset>}
    {choices && !boxes && <fieldset className="product-variants product-choices"><legend className="tc">{product.giftBox?.choiceLabel ?? t("選擇茶款（每盒擇一）", "Choose Your Tea")}{product.teaTbd && <span className="product-tbd tc"> {t("茶款待確認", "Teas to be confirmed")}</span>}</legend>
      <div>{choices.map((c, i) => <label key={c.label} className="tc" title={c.note}><input type="radio" name={`tea-${product.slug}`} checked={option === i} onChange={() => setOption(i)} />{c.label}{c.price && c.price !== product.price?.amount ? `・${formatPrice(c.price, product.price?.currency)}` : ""}</label>)}</div>
      {/* the chosen packaging in one line (user 2026-10-07: the 包裝選項 texts 「可以精簡呈現在這區」) */}
      {option !== undefined && choices[option]?.note && <p className="product-choice-note tc">{choices[option].note}</p>}
    </fieldset>}
    <button type="button" className="product-buy tc" onClick={() => (boxes ? cart.add(product, 1, undefined, mix) : cart.add(product, 1, option))} disabled={cart.busy || missing || product.soldOut || noPrice}>{product.soldOut ? t("已售罄", "Sold out") : noPrice ? (product.priceTbd ? t("價格待訂", "Price to be announced") : t("價格確認中", "Price coming soon")) : missing && boxes ? t(`還要選 ${boxes - picked} 盒`, `Choose ${boxes - picked} more ${boxes - picked === 1 ? "box" : "boxes"}`) : missing ? (product.giftBox?.choiceLabel === t("選擇盒蓋", "Choose your lid") ? t("請先選擇盒蓋", "Choose your lid") : product.giftBox?.choiceLabel?.includes("包裝") || product.giftBox?.choiceLabel?.includes("packaging") ? t("請先選擇包裝", "Choose your packaging") : product.giftBox?.choiceLabel === t("選擇茶款與盒蓋顏色", "Choose your tea and lid color") ? t("請先選擇茶款與盒蓋顏色", "Choose your tea and lid color") : t("請先選擇茶款", "Choose your tea")) : product.preOrder ? t("加入預購", "Pre-order") : t("加入購物車", "Add to bag")}</button>
  </>;
}
