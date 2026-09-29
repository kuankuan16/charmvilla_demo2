import Link from "next/link";
// Footer — white logo, section nav, copyright + Instagram (reference: the LAXER logo / address-list footer, inverted to ink).
import Image from "next/image";
import { visit, brand, sections } from "@/data/content";

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink px-25 pt-60 pb-40 text-paper lg:px-30">
      <div className="flex flex-wrap items-start justify-between gap-30">
        <div data-animation="moveUp">
          <Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} className="h-auto w-[220px]" />
        </div>

        <nav aria-label="頁尾">
          <ul className="flex flex-wrap gap-x-30 gap-y-10 text-xs font-bold">
            <li><Link href="/collections/all" className="link-underline">ALL OBJECTS</Link><span className="tc ml-6 font-medium opacity-70">全部商品</span></li>
            {sections
              .filter((s) => s.id !== "hero")
              .map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="link-underline">
                    {s.label}
                  </a>
                  <span className="tc ml-6 font-medium opacity-70">{s.zh}</span>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <div className="mt-50 flex flex-wrap justify-between gap-10 border-t border-paper/20 pt-20 text-xs font-bold">
        <span>© 2026 CHARM VILLA</span>
        <a href={visit.instagram} target="_blank" rel="noreferrer" className="link-underline">
          INSTAGRAM
        </a>
      </div>
    </footer>
  );
}
