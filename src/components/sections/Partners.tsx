// Partners screen → a full-bleed banner (user 2026-10-02: 「這一屏改為[the reference]這種形式，適當地修改圖片，我希望是深色漸層的
// 背景襯托出人物與包包，並導購」), after the reference's "Explore the Collection": one wide photograph edge to edge, the dancer
// and the white bag on a dark gradient, and over it, centred, the bag's name, its line and a square outline button to the bags.
// Server component; content from @/data/content.
import Link from "next/link";
import { getContent } from "@/data/content";
import { Picture } from "@/components/ui";
import { localeHref, type Locale } from "@/i18n/config";

export default function Partners({ lang }: { lang: Locale }) {
  const { banner } = getContent(lang).partners;
  return (
    <section id="partners" className="bag-banner" aria-labelledby="bag-banner-title">
      <div className="bag-banner-image" data-animation="fade"><Picture img={banner.image} fill fit="cover" animate={false} sizes="100vw" /></div>
      <div className="bag-banner-copy" data-animation="moveUp" data-delay="0.1">
        <h2 id="bag-banner-title" className="tc">{banner.title}</h2>
        <p className="tc">{banner.line}</p>
        <Link href={localeHref(lang, banner.cta.href)} className="bag-banner-button tc">{banner.cta.label}</Link>
      </div>
    </section>
  );
}
