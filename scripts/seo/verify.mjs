/** Read-only HTTP regression crawl. Never loads credentials or calls commerce mutations. */
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { get as httpGet } from 'node:http';
import { dirname, resolve } from 'node:path';
const base = process.env.SEO_VERIFY_URL || 'http://localhost:3026';
const output = resolve(process.env.SEO_VERIFY_OUTPUT || `/tmp/charmvilla-seo-crawl-${Date.now()}.json`);
const origin = 'https://www.charmvilla.com';
const decode = s => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1].toLowerCase(), decode(m[2])]));
const get = async path => {
  const r = await fetch(`${base}${path}`, { redirect: 'manual', headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(30000) });
  return { response:r, html:await r.text() };
};
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200);
const entries = [...sitemap.html.matchAll(/<url>(.*?)<\/url>/gs)].map(m => ({
  url: decode(m[1].match(/<loc>(.*?)<\/loc>/s)[1]),
  alternates: [...m[1].matchAll(/<xhtml:link\b[^>]*>/g)].map(x => attrs(x[0])),
}));
assert.equal(new Set(entries.map(e => e.url)).size, entries.length, 'Duplicate sitemap URLs');
const pages = [], errors = [], assets = new Set(), internalLinks = new Set();
for (const entry of entries) {
  const path = new URL(entry.url).pathname;
  try {
    const { response:r, html } = await get(path);
    const metaTags = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attrs(m[0]));
    const linkTags = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]));
    const meta = key => metaTags.find(t => t.name === key || t.property === key)?.content;
    const canonical = linkTags.filter(t => t.rel === 'canonical');
    const h1 = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(m => decode(m[1].replace(/<[^>]*>/g, '')));
    const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    const nodes = scripts.flatMap(s => s['@graph'] ?? [s]);
    const ids = nodes.map(n => n['@id']);
    assert.equal(r.status, 200, 'Status');
    assert.equal(canonical.length, 1, 'One canonical');
    assert.equal(new URL(canonical[0].href).href.replace(/\/$/, ''), entry.url.replace(/\/$/, ''), 'Canonical');
    assert.ok(!meta('robots')?.includes('noindex'), 'Unexpected meta noindex');
    assert.equal(h1.length, 1, 'One H1');
    const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1]);
    assert.ok(title && meta('description'), 'Title and description');
    assert.equal(meta('og:title'), title, 'OG title must match current page');
    assert.equal(meta('og:description'), meta('description'), 'OG description');
    assert.equal(meta('twitter:title'), title, 'Twitter title');
    assert.equal(meta('twitter:description'), meta('description'), 'Twitter description');
    assert.equal(new URL(meta('og:url')).href, new URL(entry.url).href, 'OG URL');
    assert.equal(meta('og:locale'), path === '/zh' || path.startsWith('/zh/') ? 'zh_TW' : 'en_US', 'OG locale');
    const alternates = linkTags.filter(t => t.rel === 'alternate' && t.hreflang);
    assert.equal(alternates.length, 3, 'Three hreflang entries');
    for (const alternate of entry.alternates) assert.ok(alternates.some(a => a.hreflang === alternate.hreflang && new URL(a.href).href === new URL(alternate.href).href), 'Sitemap/head hreflang consistency');
    assert.equal(new Set(ids).size, ids.length, 'Unique entity IDs');
    assert.ok(nodes.some(n => n['@type'] === 'OnlineStore'), 'OnlineStore');
    const page = nodes.find(n => ['WebPage', 'ItemPage', 'AboutPage', 'CollectionPage'].includes(n['@type']));
    assert.equal(page?.url, entry.url, 'WebPage URL');
    const idSet = new Set(ids);
    const check = value => {
      if (!value || typeof value !== 'object') return;
      if (Object.keys(value).length === 1 && value['@id']) assert.ok(idSet.has(value['@id']), `Unresolved entity ${value['@id']}`);
      for (const [key, child] of Object.entries(value)) {
        if (['url','image','logo','contentUrl','item','hasMap','sameAs','@id','availability','dayOfWeek'].includes(key)) {
          for (const v of Array.isArray(child) ? child : [child]) if (typeof v === 'string') assert.ok(/^https:\/\//.test(v), `Absolute HTTPS URL: ${key}`);
        }
        check(child);
      }
    };
    check(nodes);
    const product = nodes.find(n => n['@type'] === 'Product');
    if (product) {
      assert.ok(product.image?.length, 'Product images');
      assert.equal(product.mainEntityOfPage['@id'], page['@id']);
      for (const offer of product.offers ?? []) {
        assert.equal(offer.priceCurrency, 'USD'); assert.ok(Number.isFinite(Number(offer.price)));
        assert.ok(['InStock','OutOfStock','PreOrder','BackOrder'].some(s => offer.availability === `https://schema.org/${s}`));
      }
    }
    for (const image of [meta('og:image'), meta('twitter:image'), ...nodes.flatMap(n => n['@type'] === 'ImageObject' ? [n.url] : typeof n.image === 'string' ? [n.image] : Array.isArray(n.image) ? n.image : [])]) if (image?.startsWith(origin)) assets.add(new URL(image).pathname);
    const links = [...html.matchAll(/<a\b[^>]*>/g)].map(m => attrs(m[0]).href).filter(Boolean);
    for (const href of links) if (href.startsWith('/') && !href.startsWith('//') && !/^\/(?:api|media|brand|_next)\//.test(href)) internalLinks.add(new URL(href, origin).pathname);
    const missingAlt = [...html.matchAll(/<img\b[^>]*>/g)].filter(m => !Object.hasOwn(attrs(m[0]), 'alt')).length;
    pages.push({ path, status:r.status, title, description:meta('description'), canonical:canonical[0].href, hreflang:alternates, ogType:meta('og:type'), h1, schema:nodes.map(n => ({type:n['@type'], id:n['@id']})), offers:product?.offers?.length ?? 0, missingAlt, htmlBytes:Buffer.byteLength(html), previewNoindex:r.headers.get('x-robots-tag') });
    assert.equal(missingAlt, 0, 'Image alt attributes');
    console.log(`OK ${path}`);
  } catch (error) { errors.push({path,error:error.message}); console.log(`FAIL ${path}: ${error.message}`); }
}
const controls = [];
for (const [path,status] of [['/en/about',308],['/en/products/kyoto-gift-box',308],['/zh/products/does-not-exist',404],['/products/does-not-exist',404],['/collections/bags',404],['/collections/does-not-exist',404],['/zh/does-not-exist',404],['/does-not-exist',404],['/tasks',200],['/zh/tasks',200],['/account/reset/test-token',200],['/zh/account/activate/test-token',200]]) {
  const {response:r,html} = await get(path);
  const robots = [...html.matchAll(/<meta\b[^>]*>/g)].map(m=>attrs(m[0])).filter(a=>a.name==='robots'||a.name==='googlebot').map(a=>a.content);
  controls.push({path,status:r.status,location:r.headers.get('location'),robots});
  if(r.status!==status) errors.push({path,error:`Expected ${status}, got ${r.status}`});
  if((status===404||path.includes('/tasks')||path.includes('/account'))&&!robots.some(r=>r.includes('noindex'))) errors.push({path,error:'Missing noindex'});
}
const assetResults = [];
for (const path of assets) { const r=await fetch(base+path,{method:'HEAD'}); assetResults.push({path,status:r.status}); if(r.status!==200) errors.push({path,error:'Schema/OG asset unavailable'}); }
const extraLinks = [];
for (const path of internalLinks) if (!pages.some(p=>p.path===path)) { const {response:r}=await get(path); extraLinks.push({path,status:r.status}); if(r.status>=400) errors.push({path,error:'Broken internal link'}); }
const robots = await get('/robots.txt');
assert.match(robots.html, /Sitemap: https:\/\/www.charmvilla.com\/sitemap.xml/);
assert.ok(!robots.html.includes('Disallow: /\n'), 'Public pages must be crawlable');
// Undici fetch rewrites Host; node:http preserves it for this local host-rule check.
if (new URL(base).hostname === 'localhost') {
  const prodRobots = await new Promise((resolve, reject) => httpGet(base+'/about', { headers:{host:'www.charmvilla.com'} }, r => { r.resume(); resolve(r.headers['x-robots-tag']); }).on('error', reject));
  assert.equal(prodRobots, undefined, 'Production host must not receive preview noindex');
}
const duplicates = key => Object.entries(Object.groupBy(pages, p => p[key])).filter(([,group])=>group.length>1).map(([value,group])=>({value,paths:group.map(p=>p.path)}));
const duplicateTitles=duplicates('title'), duplicateDescriptions=duplicates('description');
if(duplicateTitles.length) errors.push({error:'Duplicate titles',details:duplicateTitles});
if(duplicateDescriptions.length) errors.push({error:'Duplicate descriptions',details:duplicateDescriptions});
const report={ date:new Date().toISOString(),base,sitemapCount:entries.length,pages,controls,assets:assetResults,extraLinks,robots:robots.html,duplicateTitles,duplicateDescriptions,errors };
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:pages.length,assets:assetResults.length,controls:controls.length,errors},null,2));
if(errors.length) process.exitCode=1;
