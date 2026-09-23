import PageShell from "@/components/engine/PageShell";
import Header from "@/components/chrome/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Bags from "@/components/sections/Bags";
import Jewelry from "@/components/sections/Jewelry";
import Interlude from "@/components/sections/Interlude";
import Tea from "@/components/sections/Tea";
import Teaware from "@/components/sections/Teaware";
import Shown from "@/components/sections/Shown";
import ShowMore from "@/components/sections/ShowMore";
import Visit from "@/components/sections/Visit";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <PageShell>
      <Header />
      <main className="pt-50">
        <Hero />
        <Manifesto />
        <Bags />
        <Jewelry />
        <Interlude />
        <Tea />
        <Teaware />
        <Shown />
        <ShowMore />
        <Visit />
      </main>
      <Footer />
    </PageShell>
  );
}
