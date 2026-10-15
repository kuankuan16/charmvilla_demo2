"use client";
import { formatPrice, type Product } from "@/data/catalog";
import { useT } from "@/i18n/LocaleProvider";
import { useProductOption } from "./ProductOption";
import { useLiveProduct } from "./useLiveProduct";
export default function LiveProductPrice({ product }: { product: Product }) {
  const { t } = useT(); const { option } = useProductOption(); const live = useLiveProduct(product);
  const id = option === undefined ? product.shopify?.variantId : product.giftBox?.choices?.[option]?.shopifyVariantId;
  const selected = live.variants?.find(v => v.id === id);
  if (product.displayOnly || !live.price) return null;
  const amount = selected ? Number(selected.price) : live.price.amount;
  const from = !selected && live.variants?.some(v => Number(v.price) !== amount);
  const soldOut = selected ? !selected.availableForSale : live.soldOut;
  const price = formatPrice(amount, live.price.currency);
  return <p className="product-price">{from ? t(`${price} 起`, `From ${price}`) : price}
    {soldOut && product.preOrderRemaining === undefined && <span className="product-soldout tc">{t("售罄", "Sold out")}</span>}
    {/* Pre-order identifies the campaign; live availability separately controls purchasing. */}
    {product.preOrder && <span className="product-preorder tc">{live.preOrderRemaining === undefined || live.error ? t("預購", "Pre-order") : live.preOrderRemaining === 0 ? t("預購額滿", "Pre-order sold out") : t(`預購・剩餘 ${live.preOrderRemaining} ${product.preOrderUnit === "set" ? "組" : "盒"}`, `Pre-order · ${live.preOrderRemaining} left`)}</span>}
  </p>;
}
