"use client";
import { useRef, useState } from "react";
import { visit } from "@/data/content";
import { Picture } from "@/components/ui";
import InkBloom from "@/components/ui/InkBloom";

const shops = visit.tabs.find(tab => tab.id === "shops")!.shops!;
const introductions = [
  { city: "Taipei", heading: "在城市裡，留一段細看的時間", body: "走進台北晶華門市，讓畫面中的作品來到眼前。從皮革的編織、金飾的輪廓，到茶與器物，沿著材質逐件觀看，感受作品與日常生活的距離。" },
  { city: "Kyoto", heading: "在寺町，與作品相遇", body: "來到京都寺町，將步伐放慢。從一尾小金魚到隨身的物件，近看手作的細節，也想像它們走進自己的茶席、餐桌與日常。" },
];

export default function StoreCarousel() {
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
  return <div className="store-carousel" aria-roledescription="輪播" aria-label="分店介紹">
    <div className="store-brush story-brush" aria-hidden="true"><InkBloom observe seed={21}/></div>
    <header className="store-heading"><div><h2>Our Stores</h2><p className="tc">分店介紹</p></div>
      <div className="store-dots" role="group" aria-label="選擇門市">{shops.map((shop,i)=><button type="button" key={shop.name} aria-label={`查看${shop.name}`} aria-pressed={active===i} onClick={()=>choose(i)}><span/></button>)}</div>
    </header>
    <div ref={track} className="store-track" tabIndex={0} aria-label="門市卡片，可左右滑動"
      onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(Math.max(0,Math.min(shops.length-1,active+(e.key==='ArrowRight'?1:-1))));}}}
      onScroll={()=>{const el=track.current;if(!el)return;const cards=el.querySelectorAll<HTMLElement>('.store-card');const gap=cards[1]?.offsetLeft-cards[0].offsetLeft;if(gap)setActive(Math.max(0,Math.min(shops.length-1,Math.round(el.scrollLeft/gap))));}}
      onPointerDown={e=>{if(e.pointerType!=='mouse'||(e.target as HTMLElement).closest('a,button'))return;drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,moved:false};e.currentTarget.dataset.dragging='true';e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(!drag.current)return;const delta=e.clientX-drag.current.x;drag.current.moved ||= Math.abs(delta)>5;e.currentTarget.scrollLeft=drag.current.scroll-delta;}}
      onPointerUp={e=>{if(!drag.current)return;drag.current=null;delete e.currentTarget.dataset.dragging;choose(active);}}
      onPointerCancel={e=>{drag.current=null;delete e.currentTarget.dataset.dragging;}}>
      {shops.map((shop,i)=><article className="store-card" key={shop.name} aria-label={shop.name}>
        <div className="store-copy"><p className="store-city">{introductions[i].city} <span>{i+1} / {shops.length}</span></p><p className="store-name tc">{shop.name}</p><h3 className="tc">{introductions[i].heading}</h3><p className="store-description tc">{introductions[i].body}</p><div className="store-information tc"><p>{shop.addr}</p><p>{shop.hours}</p></div><a href={shop.href} target="_blank" rel="noreferrer" className="store-map tc">查看地圖 <span aria-hidden="true">→</span></a></div>
        <div className="store-photo"><Picture img={shop.image} fill animate={false} sizes="(min-width:768px) 42vw,86vw"/></div>
      </article>)}
    </div>
  </div>;
}
