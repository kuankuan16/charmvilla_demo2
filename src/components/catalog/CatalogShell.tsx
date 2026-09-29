import Image from "next/image";
import Link from "next/link";
import { brand, visit } from "@/data/content";
import { categories, categoryHref } from "@/data/catalog";

export default function CatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="catalog-shell">
      <a href="#catalog-main" className="catalog-skip">跳至商品內容</a>
      <header className="catalog-header">
        <Link href="/collections/all" className="catalog-header-browse"><span aria-hidden="true">↗</span> <span className="tc">瀏覽商品</span></Link>
        <Link href="/" aria-label="CHARM VILLA 首頁" className="catalog-brand"><Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} priority /></Link>
        <Link href="/#visit" className="catalog-header-visit tc">門市資訊 <span aria-hidden="true">↗</span></Link>
      </header>
      <main id="catalog-main" tabIndex={-1}>{children}</main>
      <footer className="catalog-footer">
        <div className="catalog-footer-top"><p className="catalog-footer-statement tc">把日常的物件，<br />當作展品。</p><div><p className="catalog-eyebrow">EXPLORE THE COLLECTION</p><nav aria-label="商品頁尾導覽"><Link href="/collections/all" className="tc">全部商品</Link>{categories.map((c) => <Link key={c.id} href={categoryHref(c.id)} className="tc">{c.name}</Link>)}</nav></div></div>
        <div className="catalog-footer-bottom"><Link href="/" aria-label="CHARM VILLA 首頁"><Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} /></Link><span>© 2026 CHARM VILLA</span><a href={visit.instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div>
      </footer>
    </div>
  );
}
