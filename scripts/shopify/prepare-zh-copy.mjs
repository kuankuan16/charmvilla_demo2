// Prepare a reviewable migration manifest from the captured, approved demo copy. No Shopify writes.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const original = JSON.parse(await readFile(`${root}docs/shopify/zh-TW-source.json`, 'utf8'));
const snapshot = JSON.parse(await readFile(`${root}src/data/shopify-products.json`, 'utf8'));
const products = {};
for (const [slug, source] of Object.entries(original.products)) {
  const shopify = snapshot.products[slug];
  if (!shopify || shopify.id !== source.productId) throw new Error(`Identity mismatch: ${slug}`);
  const { title, description, story, storyMore, teaNotes, brew, imageNote, choiceLabel } = structuredClone(source);
  const copy = { version: 1, locale: 'zh-TW', title, description, facts: [], story, teaNotes, brew, imageNote, choiceLabel };
  const adjustments = [];
  const meta = Object.fromEntries(shopify.metafields.map(m => [m.key, m.value]));
  for (const raw of source.facts) {
    const f = structuredClone(raw);
    if (f.label === '每日使用的線條') { copy.story = { title: f.label, body: f.value }; continue; }
    f.label = f.label.replace('外盒尺寸長 × 寬 × 高', '外盒尺寸（長 × 寬 × 高）').replace('重量含盒', '重量（含盒）');
    if (f.label === '可選茶款' || f.label === '盒蓋顏色' || f.label === '盒蓋款式' || f.label === '選茶方式') {
      adjustments.push(`${f.label}由即時 Shopify 選項產生，不複製舊陣列。`); continue;
    }
    if (f.label === '產品須知') {
      f.items = (f.items ?? [f.value]).filter(s => !/^預購商品預計|^預購於下單|^聖誕節前送達/.test(s));
      if (f.items.length !== raw.items?.length) adjustments.push('移除舊預購出貨日期／付款條件與聖誕到貨截止日；不將舊販售政策套用即時庫存。');
      f.value = f.items.join('\n');
      if (!f.value) continue;
    }
    if (['reunion-paper-gift-box', 'snowflake-gift-box'].includes(slug) && /外盒尺寸|重量/.test(f.label)) {
      adjustments.push(`未遷入 Shopify 尚無依據的舊${f.label}：${f.value}`); continue;
    }
    if (f.label === '材質') f.value = f.value.replace('台灣一級檜木', '台灣檜木');
    const key = f.label.startsWith('外盒尺寸') ? 'packaging_dimensions' : f.label.startsWith('重量') ? 'product_weight' : f.label === '材質' ? 'product_material' : f.label === '盒型與材質' ? 'packaging_material' : f.label === '販售單位' ? 'product_contents' : undefined;
    // If an English Shopify fact later changes, the adapter must not show its old Chinese value.
    if (key && meta[key]) f.source = { key, value: meta[key] };
    if (f.label === '販售單位' && meta.teabag_count) f.source = { key: 'teabag_count', value: meta.teabag_count };
    copy.facts.push(f);
  }
  if (storyMore) {
    // On the butterfly page the secondary story precedes the main story in DOM order.
    copy.story = { ...storyMore, more: story };
  }
  if (slug === 'reunion-paper-gift-box') {
    copy.facts.find(f => f.label === '盒型與材質').value = '金色款：橘色紙盒搭配金色手工刺繡盒蓋；粉紅色款：桐木盒搭配粉紅色手工刺繡盒蓋；藍色款：藍色紙盒搭配黃色手工刺繡盒蓋。三款皆內含相同的 15 包茶款組合。';
    copy.choiceLabel = '選擇包裝';
    adjustments.push('團圓改為 Shopify 的 Gold／Pink／Blue 三種包裝，保留原中文故事。');
  }
  if (slug === 'snowflake-gift-box') {
    copy.description = copy.description.replace('，三盒一組', '，以單盒販售');
    copy.facts.find(f => f.label === '販售單位').value = '1 盒／所選茶款小金魚茶包 2 入';
    copy.choiceLabel = '選擇茶款（每盒擇一）';
    adjustments.push('單盒2入依Shopify，移除三盒組／混搭說法；價格仍為即時US$20。');
  }
  if (slug === 'christmas-gift-box') {
    copy.description = copy.description.replace('可選擇聖誕襪或拐杖糖盒蓋', '可選擇藍色或橘色紙盒，搭配聖誕手工刺繡盒蓋');
    copy.facts.find(f => f.label === '盒型與材質').value = '藍色或橘色紙盒搭配聖誕手工刺繡布面盒蓋';
    copy.choiceLabel = '選擇茶款與盒色';
    adjustments.push('販售盒色名稱依Shopify Blue／Orange；原照片對照保持不變。');
  }
  if (['winter-blossom-gift-box', 'spring-dawn-gift-box', 'orchid-gift-box'].includes(slug)) {
    for (const n of copy.teaNotes.items) if (n.name === '東方美人茶') n.name = '參等獎東方美人茶';
    adjustments.push('東方美人獎項名稱依Shopify規格修正為參等獎。');
  }
  products[slug] = { productId: shopify.id, sourceUrl: source.url, copy, adjustments };
}
await writeFile(`${root}docs/shopify/zh-TW-migration.json`, JSON.stringify({ locale: 'zh-TW', sourceCapturedAt: original.capturedAt, products }, null, 2) + '\n');
console.log(`Prepared ${Object.keys(products).length} products; no Shopify writes.`);
