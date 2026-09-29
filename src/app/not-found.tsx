import Link from "next/link";
import CatalogShell from "@/components/catalog/CatalogShell";

export default function NotFound() {
  return <CatalogShell><section className="collection-empty catalog-not-found"><p className="catalog-eyebrow">404 / OBJECT NOT FOUND</p><h1 className="tc">這件物件，暫時不在這裡。</h1><p className="tc">回到商品清單，繼續探索 CHARM VILLA 的日常物件。</p><Link href="/collections/all" className="catalog-button tc">瀏覽全部商品 ↗</Link></section></CatalogShell>;
}
