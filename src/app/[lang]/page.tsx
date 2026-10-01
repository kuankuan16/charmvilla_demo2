import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/engine/PageShell";
import Header from "@/components/chrome/Header";
import Hero from "@/components/sections/Hero";
import BrandFilm from "@/components/sections/BrandFilm";
import Manifesto from "@/components/sections/Manifesto";
import CraftMoments from "@/components/sections/CraftMoments";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Shown from "@/components/sections/Shown";
import Partners from "@/components/sections/Partners";
import Visit from "@/components/sections/Visit";
import Footer from "@/components/sections/Footer";
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
          <BrandFilm lang={lang} />
          <Manifesto />
          <CraftMoments />
        </div>
        <FeaturedProducts lang={lang} />
        <Shown lang={lang} />
        <Partners lang={lang} />
        <Visit />
      </main>
      <Footer lang={lang} />
    </PageShell>
  );
}
