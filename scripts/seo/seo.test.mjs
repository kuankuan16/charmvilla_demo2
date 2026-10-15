import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pageMetadata, pageUrl, seoText, snippet } from '../../src/lib/seo/metadata.ts';
import { siteEntities, entityIds, productNode, articleNode, pageNodes, graph, serializeSchema } from '../../src/lib/seo/schema.ts';
import { applyShopifyProduct } from '../../src/lib/shopify/catalog-data.ts';
const snapshot = JSON.parse(readFileSync(new URL('../../src/data/shopify-products.json', import.meta.url)));
const image = { src: '/media/approved.webp', alt: 'Approved image', w: 1200, h: 1500 };
const local = { slug: 'kyoto-gift-box', name: '京都版', english: 'KYOTO', image, views: [{ label: 'Front', image }, { placeholder: true, image: { ...image, src: '/placeholder.webp' } }], category: 'tea', description: 'old', summary: 'old', facts: [], story: { title: 'old', body: 'old' }, price: { amount: 999, currency: 'USD' }, giftBox: { pieces: 6, series: 'Classic', contents: [] } };

test('both locales share canonical, hreflang, OG and Twitter identity without inherited home titles', () => {
  for (const lang of ['zh', 'en']) {
    const meta = pageMetadata({ lang, path: '/products/kyoto-gift-box', title: '京都版\u200b | CHARM\u2060 VILLA', description: 'A real product description', image });
    assert.equal(meta.openGraph.url, pageUrl(lang, '/products/kyoto-gift-box'));
    assert.equal(meta.openGraph.title, meta.title); assert.equal(meta.twitter.title, meta.title);
    assert.equal(meta.twitter.description, meta.description);
    assert.equal(meta.openGraph.locale, lang === 'zh' ? 'zh_TW' : 'en_US');
    assert.equal(meta.alternates.languages['x-default'], '/products/kyoto-gift-box');
    assert.ok(!meta.openGraph.url.includes('/en/'));
    assert.ok(meta.openGraph.images[0].url.startsWith('https://www.charmvilla.com/'));
  }
  assert.ok(snippet('Long description '.repeat(20), 'en').length <= 160);
  assert.ok(snippet('這是商品介紹。'.repeat(30), 'zh').length <= 90);
  assert.equal(seoText('Show more!\u200b CHARM\u2060 VILLA'), 'Show more! CHARM VILLA');
});
test('US online seller is distinct from the brand; no false US storefront or brand social equivalence', () => {
  const nodes = siteEntities('en', ['https://www.instagram.com/charmvilla/']);
  const store = nodes.find(n => n['@id'] === entityIds.store);
  const brand = nodes.find(n => n['@id'] === entityIds.brand);
  assert.equal(store['@type'], 'OnlineStore'); assert.equal(store.legalName, 'Haoying LLC');
  assert.equal(store.address.addressCountry, 'US'); assert.equal(store.brand['@id'], brand['@id']);
  assert.ok(!store.sameAs); assert.ok(!store.openingHours); assert.ok(!store.parentOrganization);
  assert.equal(brand['@type'], 'Brand'); assert.ok(!brand.foundingDate); assert.ok(!brand.legalName);
});
test('every Shopify variant retains its own price, stock, SKU and seller with approved images', () => {
  const source = structuredClone(snapshot.products['spring-dawn-gift-box']);
  source.published = true; source.status = 'ACTIVE';
  source.variants[0].price = '231.75'; source.variants[0].sku = 'LIVE-SKU'; source.variants[0].availableForSale = false;
  source.variants[1].availableForSale = true; source.variants[1].currentlyNotInStock = false;
  const product = applyShopifyProduct({ ...local, slug: 'spring-dawn-gift-box' }, source, 'zh');
  const node = productNode(product, '小金魚茶包', 'zh');
  assert.equal(node.offers.length, source.variants.length);
  assert.equal(node.offers[0].price, '231.75'); assert.equal(node.offers[0].sku, 'LIVE-SKU');
  assert.equal(node.offers[0].availability, 'https://schema.org/OutOfStock');
  assert.equal(node.offers[1].availability, 'https://schema.org/InStock');
  assert.ok(node.offers.every(o => o.seller['@id'] === entityIds.store && o.priceCurrency === 'USD'));
  assert.ok(node.offers.every(o => o.name.includes('春曉') || o.name.includes(product.name)));
  assert.equal(new Set(node.offers.map(o => o['@id'])).size, node.offers.length);
  assert.deepEqual(node.image, ['https://www.charmvilla.com/media/approved.webp']);
  assert.ok(!node.aggregateRating); assert.ok(!node.offers[0].priceValidUntil);
});
test('unpublished, display-only, inactive or unconfirmed currency products never advertise offers', () => {
  const product = applyShopifyProduct(local, snapshot.products['christmas-gift-box'], 'en');
  for (const p of [product, { ...product, displayOnly: true }, { ...product, shopifyData: { ...product.shopifyData, published: true, status: 'DRAFT' } }, { ...product, price: { amount: 120, currency: 'TWD' } }]) {
    assert.equal(productNode(p, 'Tea', 'en').offers, undefined);
  }
  assert.equal(productNode(local, 'Tea', 'en').offers, undefined);
});
test('JSON-LD is script-safe and round-trips hostile CMS strings without executable markup', () => {
  const text = '</script><script>alert(1)</script>';
  const encoded = serializeSchema(graph([{ '@type': 'Product', name: text }]));
  assert.ok(!encoded.includes('<')); assert.equal(JSON.parse(encoded)['@graph'][0].name, text);
});
test('article dates never turn future event dates into publication timestamps; graph references resolve', () => {
  const news = { slug: 'event', title: 'Event', summary: 'Event description', date: '2030-01-01', tag: 'Events', card: image };
  const article = articleNode(news, 'en');
  assert.equal(article.datePublished, undefined); assert.equal(article.dateModified, undefined);
  const nodes = [...siteEntities('en', []), ...pageNodes('en', '/news/event', 'Event', 'Event description', 'WebPage', [{path:'/news', name:'News'}], {mainEntity:{'@id':article['@id']}}), article];
  const ids = new Set(nodes.map(n => n['@id']));
  function check(value) {
    if (!value || typeof value !== 'object') return;
    if (Object.keys(value).length === 1 && value['@id']) assert.ok(ids.has(value['@id']), `Unresolved ${value['@id']}`);
    Object.values(value).forEach(check);
  }
  check(nodes);
});

test('backordered variants do not turn stocked siblings into pre-orders; explicit preorder tags apply to the product', () => {
  const source = structuredClone(snapshot.products['kyoto-gift-box']);
  source.tags = []; source.published = true; source.status = 'ACTIVE';
  source.variants[0].availableForSale = true; source.variants[0].currentlyNotInStock = true;
  source.variants[1].availableForSale = true; source.variants[1].currentlyNotInStock = false;
  const product = applyShopifyProduct(local, source, 'en');
  assert.equal(product.preOrder, true);
  const offers = productNode(product, 'Tea', 'en').offers;
  assert.equal(offers[0].availability, 'https://schema.org/BackOrder');
  assert.equal(offers[1].availability, 'https://schema.org/InStock');
  source.tags = ['pre-order'];
  assert.equal(productNode(applyShopifyProduct(local, source, 'en'), 'Tea', 'en').offers[1].availability, 'https://schema.org/PreOrder');
});
