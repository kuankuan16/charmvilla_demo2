import Link from "next/link";
// Footer — white logo, section nav, copyright + Instagram (reference: the LAXER logo / address-list footer, inverted to ink).
import Image from "next/image";
import { brand, sections } from "@/data/content";
import SocialLinks from "@/components/ui/SocialLinks";
import { localeHref, translator, type Locale } from "@/i18n/config";

export default function Footer({ lang }: { lang: Locale }) {
  const t = translator(lang);
  const zh = lang === "zh";
  return (
    <footer id="footer" className="container-x bg-ink pt-60 pb-40 text-paper">
      <div className="flex flex-wrap items-start justify-between gap-30">
        <div data-animation="moveUp">
          <Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} className="h-auto w-[220px] brightness-0 invert" />
        </div>

        <nav aria-label={t("頁尾", "Footer")}>
          <ul className="flex flex-wrap gap-x-30 gap-y-10 text-xs font-bold">
            <li><Link href={localeHref(lang, "/collections/all")} className="link-underline">ALL OBJECTS</Link>{zh && <span className="tc ml-6 font-medium opacity-70">全部商品</span>}</li>
            {sections
              .filter((s) => s.id !== "hero")
              .map((s) => (
                <li key={s.id}>
                  <a href={s.id === "visit" ? "#visit" : localeHref(lang, `/collections/${s.id}`)} className="link-underline">
                    {s.label}
                  </a>
                  {zh && <span className="tc ml-6 font-medium opacity-70">{s.zh}</span>}
                </li>
              ))}
            <li><Link href={localeHref(lang, "/about")} className="link-underline">ABOUT</Link>{zh && <span className="tc ml-6 font-medium opacity-70">關於</span>}</li>
          </ul>
        </nav>
      </div>

      <div className="mt-50 flex flex-wrap justify-between gap-10 pt-20 text-xs font-bold">
        <span>© 2026 CHARM VILLA</span>
        <SocialLinks lang={lang} />
      </div>
    </footer>
  );
}
