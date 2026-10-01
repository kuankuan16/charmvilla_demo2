import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/engine/PageShell";
import Header from "@/components/chrome/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import CraftMoments from "@/components/sections/CraftMoments";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Partners from "@/components/sections/Partners";
import Visit from "@/components/sections/Visit";
import SiteFooter from "@/components/chrome/SiteFooter";
import { alternatesFor, defaultLocale, isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: alternatesFor(isLocale(lang) ? lang : defaultLocale, "/") };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <PageShell>
      <Header />
      <main className="site-main">
        <div className="opening-sequence">
          <Hero />
          <Manifesto />
          <CraftMoments lang={lang} />
        </div>
        <FeaturedProducts lang={lang} />
        {/* 2026-10-01 (user: 「刪掉這屏」): the SHOWN AT screen is off the homepage; the component and its copy stay in the repo. */}
        <Partners lang={lang} />
        <Visit />
      </main>
      <SiteFooter lang={lang} />
    </PageShell>
  );
}
