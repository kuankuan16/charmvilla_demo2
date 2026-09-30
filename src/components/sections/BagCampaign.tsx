import { bagCampaign } from "@/data/content";
import { Picture } from "@/components/ui";

// Full photographs: no cover crop, text overlay, or scale animation over the product.
export default function BagCampaign() {
  const portraits = bagCampaign.images.slice(0, 4);
  const landscape = bagCampaign.images[4];

  return (
    <section id="bag-campaign" aria-labelledby="bag-campaign-heading" className="bg-white pb-100 laptop:pb-180">
      <div className="container-x mb-25 flex flex-wrap items-baseline justify-between gap-12 pt-20">
        <h2 id="bag-campaign-heading" className="text-xs font-bold">{bagCampaign.heading}</h2>
        <p className="tc text-xs font-medium">{bagCampaign.subtitle}</p>
      </div>
      <div className="grid gap-12 px-12 md:gap-20 lg:px-30">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          {portraits.slice(0, 2).map((img) => (
            <figure key={img.src} data-campaign-image="">
              <Picture img={img} sizes="(min-width:768px) 50vw, 100vw" animate={false} />
            </figure>
          ))}
        </div>
        <div className="grid gap-12 md:grid-cols-[1.43fr_1fr] md:gap-20">
          {portraits.slice(2).map((img, i) => (
            <figure key={img.src} data-campaign-image="">
              <Picture img={img} sizes={i === 0 ? "(min-width:768px) 59vw, 100vw" : "(min-width:768px) 41vw, 100vw"} animate={false} />
            </figure>
          ))}
        </div>
        <figure data-campaign-image="">
          <Picture img={landscape} sizes="100vw" animate={false} />
        </figure>
      </div>
    </section>
  );
}
