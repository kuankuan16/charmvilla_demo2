// 7: SHOW MORE! — leather-bag launch dates + invitation card (reference: the "LET'S TALK ABOUT YOU" CTA block).
import { showMore } from "@/data/content";
import { Heading, Picture } from "@/components/ui";

export default function ShowMore() {
  return (
    <section id="show-more" className="container-x relative border-t border-ink/20 bg-white pt-30 mb-100 laptop:mb-180">
      <div className="grid grid-cols-12 gap-x-16 lg:gap-x-20">
        <div className="col-span-12 lg:col-span-7">

          <Heading className="mt-20 text-5xl leading-none lg:text-8xl">{showMore.heading}</Heading>
          <div className="tc mt-15 text-2xl font-bold" data-animation="moveUp" data-delay="0.1">
            {showMore.sub}
          </div>

          <ul className="mt-40 border-t border-ink/20">
            {showMore.events.map((e, i) => (
              <li
                key={e.date}
                data-animation="moveUp"
                data-delay={0.15 + i * 0.1}
                className="grid grid-cols-[90px_90px_1fr] items-baseline gap-x-15 border-b border-ink/20 py-15 lg:grid-cols-[130px_120px_1fr] lg:gap-x-20"
              >
                <span className="text-3xl font-bold leading-none lg:text-5xl">{e.date}</span>
                <span className="text-xs font-bold">{e.city}</span>
                <span className="tc text-base font-bold">{e.venue}</span>
              </li>
            ))}
          </ul>

          <div className="mt-30">
            <a className="btn btn--outline" href={showMore.cta.href} target="_blank" rel="noreferrer">
              <span className="tc">{showMore.cta.label}</span>
            </a>
          </div>
        </div>

        <div className="col-span-12 mt-40 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <div className="relative aspect-[2/3] w-full max-w-[320px]" data-animation="clip" data-delay="0.2">
            <Picture img={showMore.invitation} fill sizes="320px" className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
