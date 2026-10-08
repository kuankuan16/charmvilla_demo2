// One sheet under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 and 沖泡方式, side by side on one screen until 2026-10-08
// (user 2026-10-07: 「『茶款介紹』與『沖泡方式』整合成一屏（並調整版型），放在目前商品的情境之下，推薦商品之上」; before that two
// brochure pages right under the first screen). A rule with small labels across the top, the teas as a numbered list at the
// left, the brewing steps with line icons at the right; no picture (「配圖都是錯誤的，不要放」), no small decorative text
// (「所有裝飾性的小字都拿掉，精簡」), no numbers (「這一區塊的裝飾數字都拿掉」), no rules; each row is title | text in two columns
// (「拿掉線，標題都加大一點，內容改在另外一欄」).
// 沖泡方式 since 2026-10-08 after rooferplus.webflow.io's 「A Process Designed for Precision」 (user: 「分析並高度學習…這一屏的動態效果，並推理
// 適合目前官網設計風格的樣式呈現」): its own screen under 茶款介紹 — the title at the top left, a photograph at the bottom left (「左下角的圖」),
// the steps at the right on a hairline rail that fills in bronze as the page scrolls, each step's dot and icon turning bronze when the fill
// reaches it (lib/motion/animations.ts, brew-process). Still no numbers and no rules between the steps: the rail is the one line.
// 茶款介紹 since 2026-10-08 after nexifye.webflow.io's 「Strategic Guidance for High-Growth Startups」 (user: 「分析並高度學習…這一屏的動態
// 效果，並推理適合目前官網設計風格的樣式呈現『茶款介紹』」): the title stays put at the left (sticky) and rises in once, 45px, 0.5s, power2.out;
// at the right one card per tea, every card sticky at the same height, so each one slides up over the one before like a sheet of paper;
// square corners like every button on the site, a hairline frame, no numbers (the reference's 「01 —」 is left out).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import { Picture } from "@/components/ui";
import BrewProcess from "./BrewProcess";
import TeaFilm from "./TeaFilm";
import TeaNotesCarousel from "./TeaNotesCarousel";
import { site, type Img } from "@/data/content";
import { GOLDFISH_D } from "./goldfish-path";

const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** one icon per brewing step, in the steps' order (pour, open, add the goldfish — the brand's vector goldfish, steep, enjoy) */
// the brand's goldfish as a line drawing like the other icons (user 2026-10-07: 「小金魚改為線稿，跟其他的風格一樣」): stroke only, ~1.3/48 of the box
const goldfish = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 1224 1028" width="40" height="40" aria-hidden="true" className="brew-icon-goldfish"><path d={GOLDFISH_D} fill="none" stroke="currentColor" strokeWidth="32" strokeLinejoin="round" /></svg>;
const brewIcons = [
  icon(<><path d="M13 22h22l-2.2 15.2a2 2 0 0 1-2 1.8H17.2a2 2 0 0 1-2-1.8z" /><path d="M35 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 7c5 0 7 3 7 7 0 3-2 4-2 8" /><path d="M20 10c0 2-1.5 3-1.5 5" /><circle cx="25" cy="13" r=".6" fill="currentColor" /></>),
  icon(<><path d="M15 12h18v26H15z" /><path d="M15 12v-2h18v2" /><path d="M16 8.5h16M16 10.5h16" strokeWidth=".8" /><path d="M13 19h22" strokeDasharray="2 2.5" /><path d="M33 19l2.5-1.5v3z" fill="currentColor" stroke="none" /><path d="M20 27h8M20 31h8" strokeWidth=".9" /></>),
  goldfish(),
  icon(<><circle cx="24" cy="24" r="15" /><path d="M24 13v11l6 4" /><path d="M24 9v2M39 24h-2M24 39v-2M9 24h2" /></>),
  icon(<><path d="M12 22h22v6a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" /><path d="M34 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 41h30" /><path d="M18 8c0 2.5-2 3.5-2 6s2 3 2 5M24 6c0 2.5-2 3.5-2 6s2 3 2 5M30 8c0 2.5-2 3.5-2 6s2 3 2 5" /></>),
];

/** the dry-leaf photograph of a tea, in the manner of small Taiwanese tea houses' product photographs (Nano Banana 2.1; user 2026-10-08) */
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined =>
  /玫瑰烏龍|Rose Oolong/.test(name) ? site("tea-leaf-rose-oolong.webp", t("淺灰石板上一小堆玫瑰烏龍茶：緊實的深綠茶球混著粉紅玫瑰花瓣與幾顆玫瑰花苞", "A small heap of Rose Oolong on pale grey stone: tightly rolled dark-green tea pearls among pink rose petals and a few rosebuds"), 2528, 1696) : undefined;

export default function TeaPages({ product, t }: { product: Product; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  const title = [notes?.title, brew?.title].filter(Boolean).join(t("與", " and "));
  return (
    <section className="tea-sheet" aria-label={title}>
      {/* 茶款介紹 in the stores screen's manner (user 2026-10-08, evening: 「參考門市的設計手法，店面換成茶種資訊」「右邊最大的圖先幫我用影片試試看」):
          the heading and the tea cards at the left, the sunrise film filling the right half (TeaNotesCarousel). Each card's photograph is
          the dry leaves of that tea, learnt from wolftea.com and yoshantea.com's tea photographs; only 玫瑰烏龍茶 has one so far (a sample for
          approval), the others show a grey 缺圖 block. The film: the same 20-second backlit cup of goldfish tea on every tea box (Wan 3.0
          from a Nano Banana 2.1 frame; ffmpeg 1080p/720p, muted). */}
      {notes && <TeaNotesCarousel title={notes.title} items={notes.items.map((n) => ({ ...n, image: leafPhoto(n.name, t) }))}>
        <TeaFilm src="/media/video/goldfish-tea-sunrise-1080.mp4" srcSmall="/media/video/goldfish-tea-sunrise-720.mp4" poster="/media/video/goldfish-tea-sunrise-poster.webp"
          label={t("清晨的一杯小金魚茶：逆光下，她捧著冒著熱氣的茶杯，走進晨霧裡的草地", "A cup of goldfish tea at sunrise: backlit, she holds the steaming cup, then walks out into the misty meadow")}
          playLabel={t("播放影片", "Play the film")} pauseLabel={t("暫停影片", "Pause the film")} />
      </TeaNotesCarousel>}
      {brew && <BrewProcess>
        <h2 id="brew-title" className="tc" data-animation="split" data-split="chars" data-duration="0.9" data-stagger-interval="0.06" data-start="top 88%">{brew.title}</h2>
        {brew.image && <figure className="brew-process-media" data-animation="moveUp" data-from="100" data-duration="1.2" data-ease="power2.out" data-start="top 90%"><Picture img={brew.image} fill fit="cover" animate={false} sizes="(min-width:768px) 31vw, 100vw" /></figure>}
        <ol className="brew-steps" data-brew-steps="">
          {brew.steps.map((s, i) => <li key={s.title} data-brew-step=""><span className="brew-rail" aria-hidden="true"><span className="brew-dot" />{i < brew.steps.length - 1 && <span className="brew-line"><span className="brew-line-fill" /></span>}</span><span className="brew-icon">{brewIcons[i] ?? brewIcons[4]}</span><h3 className="tc">{s.title}</h3><p className="tc">{s.text}</p></li>)}
        </ol>
      </BrewProcess>}
    </section>
  );
}
