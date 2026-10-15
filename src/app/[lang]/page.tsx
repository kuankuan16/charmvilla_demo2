import JsonLd from "@/components/seo/JsonLd";
import { getContent } from "@/data/content";
import { homeSeo, pageMetadata } from "@/lib/seo/metadata";
import { entityIds, physicalStores, ref, webPage } from "@/lib/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/engine/PageShell";
import Header from "@/components/chrome/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import CraftMoments from "@/components/sections/CraftMoments";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Visit from "@/components/sections/Visit";
import SiteFooter from "@/components/chrome/SiteFooter";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return pageMetadata({ lang: locale, path: "/", ...homeSeo(locale) });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const seo = homeSeo(lang);
  const stores = physicalStores(lang, getContent(lang).visit.tabs.find(tab => tab.id === "shops")!.shops!);
  return (
    <PageShell>
      <JsonLd nodes={[webPage(lang, "/", seo.title, seo.description, "WebPage", { mainEntity: ref(entityIds.store), mentions: stores.map(store => ref(String(store["@id"]))) }), ...stores]} />
      <Header />
      <main className="site-main">
        <div className="opening-sequence">
          <Hero />
          <Manifesto />
          <CraftMoments lang={lang} />
        </div>
        <FeaturedProducts lang={lang} />
        {/* 2026-10-01 (user: 「刪掉這屏」): the SHOWN AT screen is off the homepage; the component and its copy stay in the repo. */}
        {/* 2026-10-02 (user: 「整個橫幅區塊都刪」): the bag banner screen is off the homepage; Partners.tsx stays in the repo. */}
        <Visit />
      </main>
      <SiteFooter lang={lang} home />
    </PageShell>
  );
}
