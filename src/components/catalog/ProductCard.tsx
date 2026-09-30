import Link from "next/link";
import { Picture } from "@/components/ui";
import { getCategory, productHref, type Product } from "@/data/catalog";
import { imageFit } from "@/data/content";

export default function ProductCard({ product, index = 0, animated = false }: { product: Product; index?: number; animated?: boolean }) {
  return (
    <article className="catalog-card" data-catalog-card={product.slug} data-animation={animated ? "moveUp" : undefined} data-delay={animated ? (index % 3) * .1 : undefined}>
      <Link href={productHref(product)} aria-label={`瀏覽 ${product.name}`}>
        <div className={`catalog-card-image catalog-card-image--${product.category} catalog-card-image--${product.image.cutout ? "cutout" : "scene"}`}><Picture img={product.image} fill fit={imageFit(product.image)} animate={animated} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" /></div>
        <div className="catalog-card-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{getCategory(product.category)?.en}</span></div>
        <h3 className="tc">{product.name}</h3>
        <p className="tc">{product.summary}</p>
        <span className="catalog-card-link tc">{product.category === "tea" ? "查看禮盒" : "欣賞作品"}</span>
      </Link>
    </article>
  );
}
