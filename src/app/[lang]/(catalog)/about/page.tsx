import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAbout } from "@/data/about";
import { getContent } from "@/data/content";
import { categoryHref, getCategories } from "@/data/catalog";
import { alternatesFor, defaultLocale, isLocale, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return {
    title: t("關於 CHARM VILLA", "About | CHARM VILLA"),
    description: getAbout(lang).intro,
    alternates: alternatesFor(lang, "/about"),
  };
}

// About (user 2026-10-05: 「根據目前的設計風格…自動幫我完成 about 頁面，我要刪除裡面的影片，並幫我產生適合情境的圖」). The film is gone;
// the page follows the collection pages' editorial type: a display heading with the official slogan beside it, a wide photograph,
// a row of figures, four chapters that alternate photograph and text on the 12 columns, the range, the slogan again and
// the sources every fact comes from (src/data/about.ts).
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const about = getAbout(lang);
  const { tea } = getContent(lang);
  const categories = getCategories(lang);
  return (
    <article className="about-page">
      <header className="about-hero">
        <div className="about-hero-title">
          <p className="catalog-eyebrow tc">{about.eyebrow}</p>
          <h1>{about.title}</h1>
        </div>
        <div className="about-hero-copy">
          <p className="about-slogan tc">{about.slogan}</p>
          <p className="about-intro tc">{about.intro}</p>
        </div>
      </header>
      <figure className="about-hero-image"><Image src={about.hero.src} alt={about.hero.alt} fill priority sizes="100vw" quality={90} /></figure>

      <ul className="about-figures">
        {about.figures.map((f) => <li key={f.value}><strong>{f.value}</strong><span className="tc">{f.label}</span></li>)}
      </ul>

      {about.chapters.map((c) => (
        <section key={c.id} className={`about-chapter about-chapter--${c.side}`} aria-labelledby={`about-${c.id}`}>
          <figure className="about-chapter-image" style={{ aspectRatio: c.image.w / c.image.h > 1.2 ? "3 / 2" : "4 / 5" }}>
            <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" />
          </figure>
          <div className="about-chapter-text">
            <p className="about-chapter-index">{c.index}</p>
            <h2 id={`about-${c.id}`} className="tc">{c.title}</h2>
            {c.body.map((p) => <p key={p} className="tc">{p}</p>)}
            {c.quote && <blockquote className="about-quote"><p className="tc">{c.quote.text}</p><cite className="tc">{c.quote.by}</cite></blockquote>}
            {/* the two award marks under the 03 text, larger, without captions (user 2026-10-05: 「刪除說明字，並加大 logo」「得獎 logo 加在這段文字之下」) */}
            {c.id === "world" && <div className="about-award-marks" role="group" aria-label={tea.honoursAria}>
              {tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} sizes="200px" />)}
            </div>}
          </div>
        </section>
      ))}

      <section className="about-range" aria-labelledby="about-range-title">
        <h2 id="about-range-title" className="tc">{about.rangeTitle}</h2>
        <ul>
          {about.range.map((r) => {
            const cat = categories.find((c) => c.id === r.id);
            if (!cat) return null;
            return <li key={r.id}><Link href={categoryHref(r.id, lang)} className="about-range-card">
              <span className="about-range-image"><Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 31vw, 48vw" style={r.position ? { objectPosition: r.position } : undefined} /></span>
              <span className="about-range-name tc">{cat.name}</span>
            </Link></li>;
          })}
        </ul>
      </section>


      <p className="about-closing tc">{about.slogan}</p>

      <footer className="about-sources">
        <h2 className="tc">{about.sourcesTitle}</h2>
        <ol>{about.sources.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" className="tc">{s.label}</a></li>)}</ol>
        <p className="tc">{t("本頁內容依上述報導與官方資料整理。", "This page is compiled from the reports and official sources above.")}</p>
      </footer>
    </article>
  );
}
