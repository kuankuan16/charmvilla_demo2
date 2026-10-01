import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandFilm from "@/components/sections/BrandFilm";
import { getContent } from "@/data/content";
import { alternatesFor, defaultLocale, isLocale, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return {
    title: t("關於｜CHARM VILLA", "About | CHARM VILLA"),
    description: getContent(lang).manifesto.paragraphs.slice(0, 2).join(" "),
    alternates: alternatesFor(lang, "/about"),
  };
}

// About (user 2026-10-01: 「新增一個 about 頁面，把影片移過去，首頁就不需要出現影片」). One spread on the product-page grid:
// the film holds the left columns and stays in place, the brand story and the two awards run down the right.
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const { manifesto, tea } = getContent(lang);
  return (
    <article className="about-page">
      <div className="about-film"><BrandFilm /></div>
      <div className="about-copy">
        <h1 className="tc">{t("淬鍊日常的詩意：當工藝遇上生活儀式", "Crafting Everyday Poetics")}</h1>
        <p className="about-sub">{t("Crafting Everyday Poetics — Where Artistry Meets Living.", "Where Artistry Meets Living.")}</p>
        <div className="about-story tc">{manifesto.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>
        <ul className="about-awards" aria-label={tea.honoursAria}>
          {tea.awards.map((award) => <li key={award.image.src}><Image src={award.image.src} alt={award.image.alt} width={award.image.w} height={award.image.h} sizes="90px" /><p className="tc">{award.text}</p></li>)}
        </ul>
      </div>
    </article>
  );
}
