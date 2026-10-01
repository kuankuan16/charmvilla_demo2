"use client";
import { useRef, useState } from "react";
import { getContent } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";
import InkBloom from "@/components/ui/InkBloom";

export default function StoreCarousel() {
  const { lang, t } = useT();
  const { visit } = getContent(lang);
  const shops = visit.tabs.find(tab => tab.id === "shops")!.shops!;
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{x:number; scroll:number; moved:boolean} | null>(null);
  const [active,setActive] = useState(0);
  const choose = (index:number) => {
    const el=track.current;
    if(!el)return;
    const cards=el.querySelectorAll<HTMLElement>('.store-card');
    const target=cards[index];
    if(!target)return;
    el.scrollTo({left:target.offsetLeft-cards[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return <div className="store-carousel" aria-roledescription={t("輪播", "carousel")} aria-label={t("分店介紹", "Our stores")}>
    <div className="store-brush story-brush" aria-hidden="true"><InkBloom observe seed={21}/></div>
    <header className="store-heading"><div><h2>{visit.storesHeading}</h2>{visit.storesSub && <p className="tc">{visit.storesSub}</p>}</div>
      <div className="store-dots" role="group" aria-label={t("選擇門市", "Choose a store")}>{shops.map((shop,i)=><button type="button" key={shop.name} aria-label={t(`查看${shop.name}`, `View ${shop.name}`)} aria-pressed={active===i} onClick={()=>choose(i)}><span/></button>)}</div>
    </header>
    <div ref={track} className="store-track" tabIndex={0} aria-label={t("門市卡片，可左右滑動", "Store cards, scroll left or right")}
      onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(Math.max(0,Math.min(shops.length-1,active+(e.key==='ArrowRight'?1:-1))));}}}
      onScroll={()=>{const el=track.current;if(!el)return;const cards=el.querySelectorAll<HTMLElement>('.store-card');const gap=cards[1]?.offsetLeft-cards[0].offsetLeft;if(gap)setActive(Math.max(0,Math.min(shops.length-1,Math.round(el.scrollLeft/gap))));}}
      onPointerDown={e=>{if(e.pointerType!=='mouse'||(e.target as HTMLElement).closest('a,button'))return;drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,moved:false};e.currentTarget.dataset.dragging='true';e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(!drag.current)return;const delta=e.clientX-drag.current.x;drag.current.moved ||= Math.abs(delta)>5;e.currentTarget.scrollLeft=drag.current.scroll-delta;}}
      onPointerUp={e=>{if(!drag.current)return;drag.current=null;delete e.currentTarget.dataset.dragging;choose(active);}}
      onPointerCancel={e=>{drag.current=null;delete e.currentTarget.dataset.dragging;}}>
      {shops.map((shop,i)=><article className="store-card" key={shop.name} aria-label={shop.name}>
        <div className="store-copy"><p className="store-city">{shop.intro.city} <span>{i+1} / {shops.length}</span></p><p className="store-name tc">{shop.name}</p><h3 className="tc">{shop.intro.heading}</h3><p className="store-description tc">{shop.intro.body}</p><div className="store-information tc"><p>{shop.addr}</p><p>{shop.hours}</p></div><a href={shop.href} target="_blank" rel="noreferrer" className="store-map tc">{t("查看地圖", "View map")}</a></div>
        <div className="store-photo"><Picture img={shop.image} fill animate={false} sizes="(min-width:768px) 42vw,86vw"/></div>
      </article>)}
    </div>
  </div>;
}
