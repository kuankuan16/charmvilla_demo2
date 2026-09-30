import Image from "next/image";
import Link from "next/link";
import Header from "@/components/chrome/Header";
import { brand, visit } from "@/data/content";
import { categories, categoryHref } from "@/data/catalog";

export default function CatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="catalog-shell">
      <a href="#catalog-main" className="catalog-skip">跳至商品內容</a>
      <Header innerPage />
      <main id="catalog-main" tabIndex={-1}>{children}</main>
      <footer className="catalog-footer">
        <div className="catalog-footer-top"><p className="catalog-footer-statement tc">藝術即生活</p><div><p className="catalog-eyebrow">EXPLORE THE GALLERY</p><nav aria-label="商品頁尾導覽"><Link href="/collections/all" className="tc">全部商品</Link>{categories.map((c) => <Link key={c.id} href={categoryHref(c.id)} className="tc">{c.name}</Link>)}</nav></div></div>
        <div className="catalog-footer-bottom"><Link href="/" aria-label="CHARM VILLA 首頁"><Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} /></Link><span>© 2026 CHARM VILLA</span><a href={visit.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a></div>
      </footer>
    </div>
  );
}
