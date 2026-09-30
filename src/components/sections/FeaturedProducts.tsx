import Link from "next/link";
import { findProduct, productHref } from "@/data/catalog";
import { Heading, Picture } from "@/components/ui";
import { imageFit } from "@/data/content";

// A single cross-category selection; full collections live on their own pages.
const selected = [
  "braided-leather-bag-white",
  "pearl-chain-goldfish-earrings",
  "ginkgo-teaspoon-gift-box",
  "reunion-paulownia-gift-box",
  "bird-chopstick-rest",
  "bezel-diamond-goldfish-earrings",
].map(slug => findProduct(slug)!);

export default function FeaturedProducts() {
  return <section id="featured" className="featured-products" aria-labelledby="featured-heading">
    <header className="featured-heading">
      <div><p className="catalog-eyebrow">SELECTED OBJECTS</p><Heading className="tc" as="h2"><span id="featured-heading">推薦商品精選</span></Heading></div>
      <p className="tc">循著材質與線條，選出值得細看的作品。從肩上、耳畔到餐桌，讓藝術走進每天的片刻。</p>
    </header>
    <div className="featured-grid">
      {selected.map((product) => <article key={product.slug} data-featured-product={product.slug}>
        <Link href={productHref(product)} aria-label={`欣賞 ${product.name}`}>
          <div className={`featured-image featured-image--${(product.featuredImage ?? product.image).cutout ? "cutout" : "scene"}`}><Picture img={product.featuredImage ?? product.image} fill fit={imageFit(product.featuredImage ?? product.image)} animate={false} sizes="(min-width:768px) 30vw, 90vw" /></div>
          <div className="featured-caption"><h3 className="tc">{product.name}</h3></div>
          <p className="tc">{product.summary}</p>
        </Link>
      </article>)}
    </div>
    <div className="featured-more"><Link href="/collections/all" className="tc link-underline">欣賞全部作品</Link></div>
  </section>;
}
