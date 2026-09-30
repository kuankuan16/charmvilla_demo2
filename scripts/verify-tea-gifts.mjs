import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import sharp from 'sharp';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const qa = path.join(root, 'docs/qa/2026-09-29-tea-gift-boxes');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'charmvilla-tea-'));
for (const file of ['content', 'tea-gifts', 'christmas-gifts', 'catalog']) {
  const source = fs.readFileSync(path.join(root, `src/data/${file}.ts`), 'utf8');
  fs.writeFileSync(path.join(tmp, `${file}.js`), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText);
}
for (const name of ['images.json', 'gift-box-images.json', 'official-prices.json', 'shopify-map.json', 'studio-listing.json']) fs.copyFileSync(path.join(root, 'src/data', name), path.join(tmp, name));
const { teaGifts } = (await import(pathToFileURL(path.join(tmp, 'tea-gifts.js')).href)).default;
const { products, teaCatalog } = (await import(pathToFileURL(path.join(tmp, 'catalog.js')).href)).default;
const expectedIds = [891,64,954,1053,104,692,970,183,343,196,850,582,960,88,1072,994];
assert.deepEqual(teaGifts.map(g => g.officialId), expectedIds);
assert.equal(new Set(products.map(p => p.slug)).size, products.length);
assert.equal(teaCatalog.length, 18, 'two Christmas editions + sixteen official gift boxes');
const christmas = teaCatalog.filter(p => p.variant?.group === 'christmas-edition-2026');
assert.deepEqual(christmas.map(p => p.slug), ['christmas-edition-stocking', 'christmas-edition-candy-cane']);
for (const p of christmas) { assert(!p.officialUrl && !p.giftBox, `${p.slug} must not claim official listing or box contents`); assert(p.facts.some(f => f.label === '上市資訊')); for (const view of p.views) assert(fs.existsSync(path.join(root, 'public', view.image.src)), `Missing ${view.image.src}`); }
assert(!products.some(p => p.slug.startsWith('goldfish-tea-')));
const selectedSource = fs.readFileSync(path.join(root, 'src/components/sections/FeaturedProducts.tsx'), 'utf8');
const selectedBlock = selectedSource.match(/const selected = \[([\s\S]+?)\]/)[1];
for (const slug of selectedBlock.matchAll(/"([^"]+)"/g)) assert(products.some(p => p.slug === slug[1]), `Missing featured ${slug[1]}`);
for (const gift of teaGifts) {
  const options = gift.choices ? gift.choices.map(c => c.contents) : [gift.contents];
  if (gift.choices) assert.equal(gift.contents.length, 0, 'Choices are alternatives, not cumulative box contents');
  for (const contents of options) assert.equal(contents.reduce((sum, c) => sum + c.count, 0), gift.pieces, gift.slug);
  const product = teaCatalog.find(p => p.slug === gift.slug);
  assert.equal(new URL(product.officialUrl).searchParams.get('id'), String(gift.officialId));
  assert(product.facts.some(f => f.label === '販售單位' && f.value.includes(`${gift.pieces} 入`)));
  for (const view of product.views) assert(fs.existsSync(path.join(root, 'public', view.image.src)), `Missing ${view.image.src}`);
}
const sceneHashes = {
  'CV-0348': 'dd19e7772c2ae7d92124230ff7a655c9e21e2462f5d6102a716e922c5d8ea7a2',
  'CV-0350': '8902e20cc6fbd5a14d05264bbe864c4cc44952493e8e9ec13c2c97f77d51d4de',
  'CV-0356': '85127f9a50d337ea600cdcb7e51b00a21d99dfbf04d2ea13eebaf917db4e89b0',
  'CV-0357': 'b65cf7a64b11c76e48a760ea2955ccf2817c941daf5a9b903eef9a6ca8081ef4',
  'CV-0040': 'e33baa691a34eaddaed5e910096452909857f17e1f1602ef4af28bff4eb68ee6',
  'CV-0041': '98a35e6b81ca094d92bfed1cbbc2b265fb11c08a7bbc8c1da1ad4ed9a4214cc7',
  'CV-0231': '0dcf33caaf6223a9ac6c8c3a8f369113cc35e7846df5a3abc77c10c34155ba1c',
  'CV-0234': '5c0915563877878bafaec4b52ee5ae8bf3946d35293a34a4931c245d1d90db8f',
  'CV-0243': '5e039e8ab30e42f5cd4692a7d5b3e9c00b1ae48f03b3b35029369dbef04ac640',
  'CV-0245': 'f1eab080a0f52ae4c4d093f5df663e5096a4f08fce9ec68d6531ae78a252a36b',
};
(async () => {
  const imageChecks = [];
  for (const [id, expected] of Object.entries(sceneHashes)) {
    const file = path.join(root, `public/media/gallery/${id}.webp`);
    const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    assert.equal(sha256, expected, `${id} differs from gallery`);
    imageChecks.push({ id, sha256, status: 'published', source: `https://charmvilla-gallery.vercel.app/api/media/${id}/webp` });
  }
  const composite = [];
  for (let i = 0; i < teaCatalog.length; i++) {
    const p = teaCatalog[i];
    const input = await sharp(path.join(root, 'public', p.image.src)).flatten({ background: '#fff' }).resize(240, 300, { fit: 'contain', background: '#fff' }).png().toBuffer();
    const x = (i % 4) * 270 + 15, y = Math.floor(i / 4) * 350 + 15;
    composite.push({ input, left: x, top: y });
    const label = Buffer.from(`<svg width="240" height="35"><text x="0" y="15" font-size="11" font-family="Arial">${String(i+1).padStart(2,'0')} / ${p.english}</text><text x="0" y="30" font-size="11" font-family="Arial">${p.giftBox ? `${p.giftBox.pieces} tea bags / box` : 'Christmas edition 2026'}</text></svg>`);
    composite.push({ input: label, left: x, top: y + 302 });
  }
  await sharp({ create: { width: 1080, height: Math.ceil(teaCatalog.length / 4) * 350 + 30, channels: 3, background: '#f6f8fa' } }).composite(composite).png().toFile(path.join(qa, 'catalog-contact-sheet.png'));
  fs.writeFileSync(path.join(qa, 'verification.json'), JSON.stringify({ checkedAt: '2026-09-29', result: 'pass', giftBoxCount: 16, aiCoverCount: 4, officialCoverCount: 12, officialReferenceCount: 16, uniqueSlugs: true, contentsCountsMatchEachBox: true, wholeBoxChoicesNotAdditive: true, featuredLinksResolve: true, oldFlavorListingsRemoved: true, galleryHashes: imageChecks, build: 'blocked: Google Fonts network access', browserRuntime: 'not verified: local listener denied by environment', deployed: false }, null, 2)+'\n');
  fs.writeFileSync(path.join(qa, 'catalog-snapshot.json'), JSON.stringify(teaCatalog, null, 2)+'\n');
  fs.rmSync(tmp, { recursive: true });
  console.log('PASS: 16 gift boxes, contents/choices totals, image hashes, unique routes and featured links.');
})();
