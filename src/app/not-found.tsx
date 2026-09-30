import Link from "next/link";
import CatalogShell from "@/components/catalog/CatalogShell";

export default function NotFound() {
  return <CatalogShell><section className="collection-empty catalog-not-found"><p className="catalog-eyebrow">404 / OBJECT NOT FOUND</p><h1 className="tc">找不到這個頁面。</h1><p className="tc">回到作品清單，繼續欣賞 CHARM VILLA 的材質與工藝。</p><Link href="/collections/all" className="catalog-button tc">瀏覽全部商品 ↗</Link></section></CatalogShell>;
}
