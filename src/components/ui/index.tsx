// Shared UI primitives — used by every section builder. Keep these the only cross-section dependency.
import type { ReactNode } from "react";
import Image from "next/image";
import type { Img } from "@/data/content";
import dims from "@/data/images.json";

/** Uppercase heading with split-lines entrance. */
export function Heading({ as: Tag = "h2", children, className = "", delay }: { as?: "h1" | "h2" | "h3"; children: ReactNode; className?: string; delay?: number }) {
  return (
    <Tag data-animation="split" data-split="lines" data-delay={delay} className={`font-bold leading-tight tracking-tightest ${className}`}>
      {children}
    </Tag>
  );
}

/** Small uppercase label with a leading dot (reference "SERVICES:" / "CLIENT:" rows). */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center gap-10 text-xs font-bold text-stone-deep ${className}`}><span className="dot scale-75" />{children}</div>;
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`icon inline-block h-[0.9em] w-[1.1em] ${className}`} viewBox="0 0 22 18" fill="none" aria-hidden="true">
      <path d="M1 2v10h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
      <path d="M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function Btn({ href, children, outline = false, className = "" }: { href: string; children: ReactNode; outline?: boolean; className?: string }) {
  return (
    <a href={href} className={`btn ${outline ? "btn--outline" : ""} ${className}`}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

/** Picture with the reference's 1.15→1 scale-in; dimensions come from the generated manifest. */
export function Picture({ img, className = "", sizes = "100vw", priority = false, animate = true, fill = false, fit = "cover" }: { img: Img; className?: string; sizes?: string; priority?: boolean; animate?: boolean; fill?: boolean; fit?: "cover" | "contain" }) {
  const d = (dims as unknown as Record<string, [number, number]>)[img.src];
  const w = d ? d[0] : img.w; const h = d ? d[1] : img.h;
  return (
    <div className={`relative overflow-hidden ${fill ? "h-full w-full" : ""} ${className}`} data-animation={animate ? "scale" : undefined} data-from={animate ? "1.15" : undefined} data-to={animate ? "1" : undefined} data-ease={animate ? "power2.out" : undefined}>
      {fill ? (
        <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className={fit === "contain" ? "object-contain" : "object-cover"} />
      ) : (
        <Image src={img.src} alt={img.alt} width={w} height={h} sizes={sizes} priority={priority} className="h-auto w-full" />
      )}
    </div>
  );
}

/** Thin horizontal rule used between list rows. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`m-0 border-0 border-t border-ink/20 ${className}`} />;
}
