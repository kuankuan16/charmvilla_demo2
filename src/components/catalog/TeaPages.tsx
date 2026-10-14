// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 follows Vizooli's sticky card process, then 美好的沖泡方式
// combines proposal 02's left photograph/right guide with proposal 01's point-to-point progress (user 2026-10-12).
// Rules begin at the copy column; stationary nodes connect only as far as the final node. The brewing icons are
// described where they are drawn below (the goldfish is the logo's vector, outlined like the rest, 「小金魚改為線稿，跟其他的風格一樣」, 2026-10-07).
import type { Product } from "@/data/catalog";
import TeaKinds from "./TeaKinds";
import BrewProcess from "./BrewProcess";
import BrewCup from "./BrewCup";
import { site, type Img } from "@/data/content";
import { Picture } from "@/components/ui";
import { brewed, cup, fish, hotWater, icon, kettleBody, sachetBody, steam } from "./brew-drawing";

// The icons' parts — the cup, kettle, sachet, goldfish, steam and their drawing history — live in brew-drawing.tsx, shared with
// the pinned cup (BrewCup) that builds up beside the steps (2026-10-14). The cup sits at the same place and size in steps 1, 3, 4 and 5.
/** one icon per brewing step, in the steps' order: pour (a tilted gooseneck kettle, the stream, steam), open (the seal strip torn off at
 *  the notch, the goldfish lifted out), add the goldfish (dropping into the hot water), steep (a stopwatch at five minutes, the goldfish
 *  in the tea), enjoy (steam) */
const brewIcons = [
  icon(<>
    {cup(hotWater)}
    <g transform="translate(44.6 19.4) rotate(-34)">{kettleBody}</g>
    <path d="M16.8 24.1C16.2 27.7 19.6 38 19.6 46.6" />
    {steam(11, 38.4, 8)}{steam(27.4, 38.4, 8)}
  </>),
  icon(<>
    <mask id="brew-open" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64"><rect width="64" height="35" fill="#fff" /></mask>
    <g mask="url(#brew-open)">{fish(29, 25, 24)}</g>
    {sachetBody}
  </>),
  icon(<>
    {cup(hotWater)}
    {fish(23, 21, 21) /* smaller over the cup (user 2026-10-14: 「03 的小金魚比例要縮小」) */}
    <path d="M52 9V24M48.8 20.8L52 24l3.2-3.2" />
  </>),
  icon(<>
    {cup(brewed(true), false, true)}
    <circle cx="51" cy="17" r="8.5" /><path d="M51 17L54.2 11.9M49.3 6.2h3.4M51 6.2V8.5" />
  </>),
  icon(<>
    {cup(brewed(true), false, true, 1.2)}
    {steam(20, 30, 14)}{steam(27, 27, 17)}{steam(34, 30, 14)}
  </>),
];

/** the dry-leaf photograph of a tea, one scene for all of them (Nano Banana 2.1 after the rose oolong's, what each tea's dry leaf looks like
 *  checked on the web first; user 2026-10-08: 「用 Google 搜尋該類別的茶葉樣子並放入裡面，要生成所有的風格是一致的」); the competition teas
 *  show their base tea. The name is matched on either language's page. */
const leafPhotos: [RegExp, string, string, string, number, number][] = [
  [/玫瑰烏龍|Rose Oolong/, "tea-leaf-rose-oolong.webp", "玫瑰烏龍茶的茶葉與玫瑰花瓣", "Rose Oolong Tea leaves with rose petals", 2528, 1696],
  [/東方美人|Oriental Beauty/, "tea-leaf-oriental-beauty.webp", "東方美人茶的茶葉", "Oriental Beauty Tea leaves", 2528, 1696],
  [/紅玉|Ruby/, "tea-leaf-ruby-18.webp", "紅玉紅茶的茶葉", "Ruby Black Tea leaves", 2528, 1696],
  [/金萱|Jin Xuan/, "tea-leaf-jin-xuan.webp", "金萱烏龍茶的茶葉", "Jin Xuan Oolong Tea leaves", 2528, 1696],
  [/蜜香|Honey/, "tea-leaf-rose-honey-black.webp", "玫瑰蜜香紅茶的茶葉與玫瑰花瓣", "Rose & Honey-Scented Black Tea leaves with rose petals", 2528, 1696],
  [/花果|Fruit/, "tea-leaf-fruit-herbal.webp", "花果茶的果乾與花草", "Fruit & Herbal Tea, dried fruit and herbs", 2528, 1696],
  // the competition teas: not a leaf but the tea being poured, in the dark, steaming manner of the user's two references (2026-10-08:
  // 「比賽獲獎茶的情境照用專業的泡茶感呈現」; Nano Banana 2.1, portrait)
  [/比賽獲獎|Competition/, "tea-scene-competition-brewing-dark.webp", "把金黃茶湯倒進白瓷杯", "Golden tea poured into a white porcelain cup", 1856, 2304],
];
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined => {
  const hit = leafPhotos.find(([re]) => re.test(name));
  return hit && site(hit[1], t(hit[2], hit[3]), hit[4], hit[5]);
};

export default function TeaPages({ product, t }: { product: Product; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  const title = [notes?.title, brew?.title].filter(Boolean).join(t("與", " and "));
  return (
    <section className="tea-sheet" aria-label={title}>
      {/* 京都版 holds one tea chosen from four (user 2026-10-13: 「京都版後面備註 4 選 1」) */}
      {notes && <TeaKinds title={notes.title} productName={product.slug === "kyoto-gift-box" ? `${product.name}${t("（4 選 1）", " (choose 1 of 4)")}` : product.giftBox?.mixBoxes /* 雪花三盒組：每盒 5 選 1、三盒可混搭（2026-10-14） */ ? `${product.name}${t(`（${product.giftBox.choices?.length ?? 0} 款可混搭）`, ` (mix and match from ${product.giftBox.choices?.length ?? 0})`)}` : ["winter-blossom-gift-box", "spring-dawn-gift-box", "orchid-gift-box"].includes(product.slug) /* 「暮雪也要備註2選1」「春曉也是一樣的邏輯處理」 */ ? `${product.name}${t("（2 選 1）", " (choose 1 of 2)")}` : product.name} items={notes.items.map((n) => ({ name: n.name, text: n.text, term: n.term, image: leafPhoto(n.name, t) }))} />}
      {brew && <BrewProcess>
        {brew.image && <figure className="brew-visual">
          {/* one 2:3 stage: the cup drawing that builds up step by step, and over it the photograph of the finished cup (BrewCup.tsx) */}
          <div className="brew-stage">
            <BrewCup t={t} />
            <div className="brew-photo"><Picture img={brew.image} fill animate={false} sizes="(max-width: 767px) 100vw, (max-width: 1279px) 40vw, 530px" /></div>
          </div>
        </figure>}
        <div className="brew-guide">
          <header className="brew-intro">
            <p className="brew-kicker tc"><span aria-hidden="true" />{t("美好的", "A beautiful")}</p>
            <h2 id="brew-title" className="brew-title tc">{t("沖泡方式", "way to brew")}</h2>
          </header>
          <ol className="brew-steps" data-brew-steps="">
            {brew.steps.map((s, i) => <li key={s.title} data-brew-step="">
              <span className="brew-node" data-brew-node="" aria-hidden="true" />
              <div className="brew-step-content" data-brew-reveal="">
                <span className="brew-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="brew-copy"><h3 className="tc">{s.title}</h3><p className="tc">{s.text}</p></div>
                <span className="brew-icon" aria-hidden="true">{brewIcons[i] ?? brewIcons[4]}</span>
              </div>
            </li>)}
          </ol>
        </div>
      </BrewProcess>}
    </section>
  );
}
