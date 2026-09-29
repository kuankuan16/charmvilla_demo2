import Link from "next/link";
import { Picture } from "@/components/ui";
import { getCategory, productHref, type Product } from "@/data/catalog";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="catalog-card" data-catalog-card={product.slug}>
      <Link href={productHref(product)} aria-label={`瀏覽 ${product.name}`}>
        <div className={`catalog-card-image catalog-card-image--${product.category}`}><Picture img={product.image} fill fit="contain" animate={false} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" /><span className="catalog-card-open" aria-hidden="true">↗</span></div>
        <div className="catalog-card-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{getCategory(product.category)?.en}</span></div>
        <h3 className="tc">{product.name}</h3>
        <p className="tc">{product.summary}</p>
        <span className="catalog-card-link tc">探索商品 <span aria-hidden="true">↗</span></span>
      </Link>
    </article>
  );
}
