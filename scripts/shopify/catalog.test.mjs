import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyShopifyProduct } from '../../src/lib/shopify/catalog-data.ts';
const snapshot = JSON.parse(readFileSync(new URL('../../src/data/shopify-products.json', import.meta.url)));
const image = { src: '/approved-visual.webp', alt: 'Approved visual', w: 1200, h: 1500 };
const local = { slug: 'kyoto-gift-box', name: '京都版', english: 'KYOTO', image, views: [{ label: 'Front', image }], scenes: [image], category: 'tea', description: 'old', summary: 'old', facts: [], story: { title: 'old', body: 'old' }, price: { amount: 999, currency: 'USD' }, preOrder: true, preOrderRemaining: 100, giftBox: { pieces: 6, series: 'Classic', contents: [] } };

test('Shopify replaces price and stock while preserving approved image objects', () => {
  const source = structuredClone(snapshot.products['kyoto-gift-box']);
  source.variants[0].price = '61.25'; source.availableForSale = false;
  source.variants.forEach(v => { v.availableForSale = false; });
  const p = applyShopifyProduct(local, source, 'en');
  assert.equal(p.image, image); assert.equal(p.views, local.views); assert.equal(p.scenes, local.scenes);
  assert.equal(p.giftBox.choices[0].price, 61.25); assert.equal(p.soldOut, true);
  assert.equal(p.preOrderRemaining, undefined); assert.equal(p.preOrder, false);
});
test('Christmas small box follows the Shopify 2-count unit, never the retired three-box bundle', () => {
  const p = applyShopifyProduct({ ...local, slug: 'snowflake-gift-box', giftBox: { ...local.giftBox, mixBoxes: 3 } }, snapshot.products['snowflake-gift-box'], 'zh');
  assert.equal(p.price.amount, 20); assert.equal(p.giftBox.pieces, 2); assert.equal(p.giftBox.mixBoxes, undefined);
  assert.equal(p.giftBox.choices.length, 5); assert.equal(p.shopifyData.published, false); assert.equal(p.soldOut, true);
});
test('Option photos match by identity, independently of variant order', () => {
  const pink = [{ label: 'Pink photo', image: { ...image, src: '/approved-pink.webp' } }];
  const source = structuredClone(snapshot.products['spring-dawn-gift-box']); source.variants.reverse();
  const p = applyShopifyProduct({ ...local, giftBox: { ...local.giftBox, choices: [{ label: 'Oriental Beauty Tea / Pink', contents: [], views: pink }] } }, source, 'en');
  assert.equal(p.giftBox.choices.find(c => c.label === 'Third Prize Oriental Beauty Tea / Pink').views, pink);
  assert.equal(p.giftBox.choices.find(c => c.label === 'Third Prize Oriental Beauty Tea / Blue').views, undefined);
});
test('Every mapped variant has one identity, without fabricated or shared GIDs', () => {
  const ids = Object.values(snapshot.products).flatMap(p => p.variants.map(v => v.id));
  assert.equal(Object.keys(snapshot.products).length, 14); assert.equal(ids.length, 35);
  assert.equal(new Set(ids).size, ids.length); assert.ok(ids.every(id => /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id)));
});
test('Chinese option labels retain verified pink and Christmas color photographs', () => {
  const pink = [{ label: 'Pink', image: { ...image, src: '/approved-pink.webp' } }];
  const blue = [{ label: 'Stocking', image: { ...image, src: '/approved-stocking.webp' } }];
  const orchid = applyShopifyProduct({ ...local, giftBox: { ...local.giftBox, choices: [{ label: '頭等獎玫瑰烏龍茶／粉紅色', contents: [], views: pink }] } }, snapshot.products['orchid-gift-box'], 'zh');
  assert.equal(orchid.giftBox.choices.find(c => c.label === '頭等獎玫瑰烏龍茶／粉紅色').views, pink);
  const christmas = applyShopifyProduct({ ...local, giftBox: { ...local.giftBox, choices: [{ label: 'Tea Assortment / Stocking', contents: [], views: blue }] } }, snapshot.products['christmas-gift-box'], 'zh');
  assert.equal(christmas.giftBox.choices.find(c => c.label === '綜合茶款／藍色').views, blue);
  assert.equal(christmas.giftBox.choices.find(c => c.label === '綜合茶款／橘色').views, undefined);
});
test('Tea note names follow the Shopify competition grade while preserving editorial text', () => {
  const source = structuredClone(snapshot.products['orchid-gift-box']);
  source.metafields = source.metafields.filter(m => m.key !== 'headless_copy_zh_tw');
  const p = applyShopifyProduct({ ...local, teaNotes: { title: 'Tea', items: [{ name: '東方美人茶', text: 'Existing tea description' }] } }, source, 'zh');
  assert.equal(p.teaNotes.items[0].name, '參等獎東方美人茶');
  assert.equal(p.teaNotes.items[0].text, 'Existing tea description');
});
test('Shopify Chinese CMS restores approved copy without changing commerce or images', () => {
  const manifest = JSON.parse(readFileSync(new URL('../../docs/shopify/zh-TW-migration.json', import.meta.url)));
  const copy = manifest.products['kyoto-gift-box'].copy;
  const source = structuredClone(snapshot.products['kyoto-gift-box']);
  source.metafields = [...source.metafields.filter(m => m.key !== 'headless_copy_zh_tw'), { namespace: 'custom', key: 'headless_copy_zh_tw', type: 'json', value: JSON.stringify(copy) }];
  source.translations = [{ key: 'title', value: copy.title }, { key: 'body_html', value: `<p>${copy.description}</p>` }];
  source.variants[0].price = '62.50'; source.variants[0].availableForSale = false;
  const zh = applyShopifyProduct(local, source, 'zh');
  assert.equal(zh.description, copy.description); assert.deepEqual(zh.story, copy.story);
  assert.equal(zh.facts.find(f => f.label === '保存期限').value, copy.facts.find(f => f.label === '保存期限').value);
  assert.deepEqual(zh.brew.steps, copy.brew.steps); assert.deepEqual(zh.teaNotes.items, copy.teaNotes.items);
  assert.equal(zh.image, image); assert.equal(zh.giftBox.choices[0].price, 62.50); assert.equal(zh.giftBox.choices[0].availableForSale, false);
  const en = applyShopifyProduct(local, source, 'en');
  assert.equal(en.name, source.title); assert.notEqual(en.description, copy.description);
  source.metafields.find(m => m.key === 'product_weight').value = '120 g';
  assert.equal(applyShopifyProduct(local, source, 'zh').facts.find(f => f.label === '重量（含盒）').value, '120 g');
});
test('All 14 Chinese migration entries match Shopify IDs and contain no retired pre-order claims', () => {
  const manifest = JSON.parse(readFileSync(new URL('../../docs/shopify/zh-TW-migration.json', import.meta.url)));
  assert.equal(Object.keys(manifest.products).length, 14);
  for (const [slug, p] of Object.entries(manifest.products)) {
    assert.equal(p.productId, snapshot.products[slug].id);
    assert.match(p.copy.description, /[\u4e00-\u9fff]/);
    assert.doesNotMatch(JSON.stringify(p.copy), /預購商品預計|預購於下單|3 盒一組|三盒一組|剩餘 100/);
  }
});
