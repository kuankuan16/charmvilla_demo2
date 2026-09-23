import { interlude } from "@/data/content";
import { Picture } from "@/components/ui";

/**
 * Interlude — full-bleed media break between Jewelry and Tea (reference: Laxer full-bleed
 * still at y≈12300). Purely decorative; the image drifts with a scrub parallax.
 */
export default function Interlude() {
  return (
    <section id="interlude" aria-hidden="true" className="relative grid h-[60vh] min-h-500 laptop:h-screen overflow-hidden">
      <div data-animation="parallax" data-scroll-speed="0.85" className="absolute -top-[10%] left-0 h-[120%] w-full">
        <Picture img={interlude.image} fill sizes="100vw" animate={false} className="h-full w-full" />
      </div>
    </section>
  );
}
