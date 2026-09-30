import PageShell from "@/components/engine/PageShell";
import Header from "@/components/chrome/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Shown from "@/components/sections/Shown";
import Partners from "@/components/sections/Partners";
import Visit from "@/components/sections/Visit";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <PageShell>
      <Header />
      <main className="site-main">
        <div className="opening-sequence">
          <Hero />
          <Manifesto />
        </div>
        <FeaturedProducts />
        <Shown />
        <Partners />
        <Visit />
      </main>
      <Footer />
    </PageShell>
  );
}
