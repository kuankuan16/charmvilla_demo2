// Studio listing images (2026-09-30): every card on /collections/all sits on the same warm-grey seamless as the white
// bag (CV-0398). The backdrop is modelled from CV-0398 itself (per-row left/right edge tones, shifted up 8% like the
// bags), objects are cut-outs or flat-ground mattes composited with a soft contact shadow, and the three bag photos are
// shifted up 8% (bottom extended by mirroring their own backdrop). Output: public/media/site/studio-<slug>-hd.webp
// + src/data/studio-listing.json (slug → file). Run: npx --yes --package=node@24 -c 'node scripts/studio-listing.mjs'
// 2026-10-01 (user: the tall product-page image must be crisp): the canvas is 2000×2500 (was 1200×1500), the bags are
// built from the original PNGs instead of the gallery's compressed WebP exports, and the gift boxes use the official
// site's 1440px files where they exist — all in assets-src/studio/. Files carry the -hd suffix because their pixels changed.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = (p) => path.join(root, 'public', p);
const outDir = pub('media/site');
const W = 2000, H = 2500;               // 4:5 canvas
const K = W / 1200;                     // the layout numbers below were set on a 1200-wide canvas
const srcDir = path.join(root, 'assets-src/studio');
const SHIFT = 0.08;                     // bags (and the modelled backdrop) move up by 8% of the height
const FLOOR = 0.80;                     // objects standing on the floor share the bags' base line (0.884 − 0.08)
const rgba = async (file) => { const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height }; };
const toPng = (img) => sharp(img.data, { raw: { width: img.w, height: img.h, channels: 4 } }).png().toBuffer();

// ---------- backdrop -----------------------------------------------------------------------------------------------
// plain = only the wall of the bag photograph, with no floor line and no floor shadow: pieces shown straight on and
// hanging in the air (the earrings) have no surface to stand on (user 2026-10-01: 「商品平視的時候，並不需要出現像包包一樣有個底座的陰影」).
async function backdrop(plain = false) {
  const src = await rgba(pub('media/gallery/CV-0398.webp'));
  const band = 30, shift = Math.round(src.h * SHIFT);
  const rowMean = (y, fromRight) => { const s = [0, 0, 0]; for (let x = 0; x < band; x++) { const i = (y * src.w + (fromRight ? src.w - 1 - x : x)) * 4; s[0] += src.data[i]; s[1] += src.data[i + 1]; s[2] += src.data[i + 2]; } return s.map((v) => v / band); };
  // shifted + mirrored row index: rows below the original bottom repeat the backdrop upside down
  const srcRow = (y) => { const r = y + shift; return r < src.h ? r : src.h - 1 - (r - src.h + 1); };
  const L = [], R = [];
  for (let y = 0; y < src.h; y++) { L.push(rowMean(srcRow(y), false)); R.push(rowMean(srcRow(y), true)); }
  const smooth = (arr) => arr.map((_, y) => { const s = [0, 0, 0]; let n = 0; for (let k = -12; k <= 12; k++) { const r = Math.min(src.h - 1, Math.max(0, y + k)); s[0] += arr[r][0]; s[1] += arr[r][1]; s[2] += arr[r][2]; n++; } return s.map((v) => v / n); });
  const Ls = smooth(L), Rs = smooth(R);
  const out = Buffer.alloc(W * H * 4);
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < H; y++) {
    const sy = Math.min(src.h - 1, (plain ? 0.06 + 0.3 * (y / (H - 1)) : y / (H - 1)) * (src.h - 1)); const y0 = Math.floor(sy), y1 = Math.min(src.h - 1, y0 + 1), f = sy - y0;
    for (let x = 0; x < W; x++) {
      const t = x / (W - 1); const n = (rnd() + rnd() - 1) * 1.6; // ±~1 level of luminance grain, colour-neutral
      const i = (y * W + x) * 4;
      for (let c = 0; c < 3; c++) { const l = Ls[y0][c] * (1 - f) + Ls[y1][c] * f, r = Rs[y0][c] * (1 - f) + Rs[y1][c] * f; out[i + c] = Math.max(0, Math.min(255, Math.round(l * (1 - t) + r * t + n))); }
      out[i + 3] = 255;
    }
  }
  return { data: out, w: W, h: H };
}

// ---------- matting from a flat / near-flat ground ------------------------------------------------------------------
// Background plate: per-channel quadratic surface fitted to confident background pixels (border tone ± tol), so a
// photographed ground with a slight vignette/gradient mattes cleanly instead of leaving a lighter halo.
function fitPlate(img, tol = 10) {
  const { data, w, h } = img; const med = [0, 1, 2].map((c) => { const v = []; for (let x = 0; x < w; x += 4) { v.push(data[x * 4 + c], data[((h - 1) * w + x) * 4 + c]); } for (let y = 0; y < h; y += 4) { v.push(data[(y * w) * 4 + c], data[(y * w + w - 1) * 4 + c]); } v.sort((a, b) => a - b); return v[v.length >> 1]; });
  const basis = (x, y) => { const X = (2 * x) / (w - 1) - 1, Y = (2 * y) / (h - 1) - 1; return [1, X, Y, X * X, X * Y, Y * Y]; };
  let coef = [0, 1, 2].map((c) => [med[c], 0, 0, 0, 0, 0]);
  const evalAt = (x, y, c) => { const b = basis(x, y); let s = 0; for (let k = 0; k < 6; k++) s += coef[c][k] * b[k]; return s; };
  for (let pass = 0; pass < 2; pass++) {
    const A = Array.from({ length: 6 }, () => new Float64Array(6)); const B = [0, 1, 2].map(() => new Float64Array(6)); let n = 0;
    for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) {
      const i = (y * w + x) * 4; let ok = true; for (let c = 0; c < 3 && ok; c++) if (Math.abs(data[i + c] - evalAt(x, y, c)) > (pass ? tol * 0.6 : tol)) ok = false; if (!ok) continue;
      const b = basis(x, y); n++; for (let r = 0; r < 6; r++) { for (let k = 0; k < 6; k++) A[r][k] += b[r] * b[k]; for (let c = 0; c < 3; c++) B[c][r] += b[r] * data[i + c]; }
    }
    if (n < 50) break;
    coef = [0, 1, 2].map((c) => { const M = A.map((row, r) => [...row, B[c][r]]); for (let i = 0; i < 6; i++) { let piv = i; for (let r = i + 1; r < 6; r++) if (Math.abs(M[r][i]) > Math.abs(M[piv][i])) piv = r; [M[i], M[piv]] = [M[piv], M[i]]; for (let r = 0; r < 6; r++) { if (r === i) continue; const f = M[r][i] / M[i][i]; for (let k = i; k <= 6; k++) M[r][k] -= f * M[i][k]; } } return M.map((row, i) => row[6] / row[i]); });
  }
  return (x, y, c) => evalAt(x, y, c);
}
function matte(img, bg, lo = 10, hi = 40) {
  const { data, w, h } = img; const a = new Uint8Array(w * h); const plate = typeof bg === 'function' ? bg : null;
  for (let p = 0; p < w * h; p++) { const i = p * 4; const x = p % w, y = (p - x) / w; let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(data[i + c] - (plate ? plate(x, y, c) : bg[c]))); const t = Math.max(0, Math.min(1, (d - lo) / (hi - lo))); a[p] = Math.round(255 * t * t * (3 - 2 * t)); }
  // hole fill: anything not reachable from the border through low-alpha pixels is inside the object
  const outside = new Uint8Array(w * h); const q = new Int32Array(w * h); let qh = 0, qt = 0;
  const push = (p) => { if (!outside[p] && a[p] < 128) { outside[p] = 1; q[qt++] = p; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); } for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (qh < qt) { const p = q[qh++]; const x = p % w, y = (p - x) / w; if (x > 0) push(p - 1); if (x < w - 1) push(p + 1); if (y > 0) push(p - w); if (y < h - 1) push(p + w); }
  for (let p = 0; p < w * h; p++) if (!outside[p]) a[p] = 255;
  const out = Buffer.from(data); for (let p = 0; p < w * h; p++) out[p * 4 + 3] = a[p];
  return { data: out, w, h };
}
// official PNGs were matted on white: pull the white fringe out of semi-transparent edge pixels
function defringeWhite(img) {
  const out = Buffer.from(img.data);
  for (let p = 0; p < img.w * img.h; p++) { const i = p * 4, a = out[i + 3] / 255; if (a > 0 && a < 1) for (let c = 0; c < 3; c++) out[i + c] = Math.max(0, Math.min(255, Math.round((out[i + c] - 255 * (1 - a)) / a))); }
  return { data: out, w: img.w, h: img.h };
}
function bbox(img, minA = 24) {
  let x0 = img.w, y0 = img.h, x1 = -1, y1 = -1;
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) if (img.data[(y * img.w + x) * 4 + 3] >= minA) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
async function cropToBox(img, b, pad = 2) {
  const left = Math.max(0, b.x0 - pad), top = Math.max(0, b.y0 - pad), width = Math.min(img.w - left, b.w + 2 * pad), height = Math.min(img.h - top, b.h + 2 * pad);
  const buf = await sharp(await toPng(img)).extract({ left, top, width, height }).png().toBuffer();
  return rgba(buf);
}

// ---------- shadows ------------------------------------------------------------------------------------------------
async function ellipseShadow(cx, cy, rx, ry, sigma, strength) {
  const a = Buffer.alloc(W * H);
  for (let y = Math.max(0, Math.floor(cy - ry - 2)); y < Math.min(H, cy + ry + 2); y++) for (let x = Math.max(0, Math.floor(cx - rx - 2)); x < Math.min(W, cx + rx + 2); x++) { const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) a[y * W + x] = 255; }
  const blurred = await sharp(a, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).toColourspace('b-w').raw().toBuffer(); // b-w: blur would otherwise promote the mask to 3 channels
  const out = Buffer.alloc(W * H * 4); for (let p = 0; p < W * H; p++) out[p * 4 + 3] = Math.round(blurred[p] * strength);
  return { input: out, raw: { width: W, height: H, channels: 4 }, left: 0, top: 0 };
}
async function dropShadow(objPng, left, top, dx, dy, sigma, strength) {
  const { data, info } = await sharp(objPng).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const a = Buffer.alloc(W * H);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { const X = x + left + dx, Y = y + top + dy; if (X >= 0 && X < W && Y >= 0 && Y < H) a[Y * W + X] = data[y * info.width + x]; }
  const blurred = await sharp(a, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).toColourspace('b-w').raw().toBuffer(); // b-w: blur would otherwise promote the mask to 3 channels
  const out = Buffer.alloc(W * H * 4); for (let p = 0; p < W * H; p++) out[p * 4 + 3] = Math.round(blurred[p] * strength);
  return { input: out, raw: { width: W, height: H, channels: 4 }, left: 0, top: 0 };
}

// ---------- compose ------------------------------------------------------------------------------------------------
// fit: {w,h} max box in canvas px, or {scale} = canvas px per source px (shared true scale across the jewelry)
// overlay: {file, disc, cx, cy, r} = a round RGBA cut-out (disc radius `disc` in its own px) laid over the object at canvas
// centre (cx, cy) with radius r; what the object had inside that circle is removed first, except gold (the chain's top link).
async function compose(bg, obj, { fit, anchor, floorY = FLOOR, centreY = 0.5, shadow = 'floor', overlay = null }, outFile) {
  const b = bbox(obj); const cropped = await cropToBox(obj, b);
  let ow, oh;
  if (fit.scale) { ow = Math.round(cropped.w * fit.scale); oh = Math.round(cropped.h * fit.scale); }
  else { const s = Math.min(fit.w * K / cropped.w, fit.h * K / cropped.h); ow = Math.round(cropped.w * s); oh = Math.round(cropped.h * s); }
  const objPng = await sharp(await toPng(cropped)).resize(ow, oh, { kernel: 'lanczos3', fit: 'fill' }).png().toBuffer();
  const left = Math.round((W - ow) / 2);
  const top = anchor === 'floor' ? Math.round(floorY * H - oh) : Math.round(centreY * H - oh / 2);
  let objLayer = { input: objPng, left, top };
  if (overlay) {
    const base = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: objPng, left, top }]).raw().toBuffer();
    const R = overlay.r + 2.5;
    for (let y = Math.floor(overlay.cy - R); y <= Math.ceil(overlay.cy + R); y++) for (let x = Math.floor(overlay.cx - R); x <= Math.ceil(overlay.cx + R); x++) {
      const i = (y * W + x) * 4; if (Math.hypot(x + 0.5 - overlay.cx, y + 0.5 - overlay.cy) <= R && base[i] - base[i + 2] < 60) base[i + 3] = 0;
    }
    const size = Math.round((await sharp(overlay.file).metadata()).width * (overlay.r / overlay.disc));
    const disc = await sharp(overlay.file).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer();
    const full = await sharp(base, { raw: { width: W, height: H, channels: 4 } }).composite([{ input: disc, left: Math.round(overlay.cx - size / 2), top: Math.round(overlay.cy - size / 2) }]).png().toBuffer();
    objLayer = { input: full, left: 0, top: 0 };
  }
  const layers = [];
  if (shadow === 'floor') {
    const cx = left + ow / 2, cy = top + oh - 3;
    layers.push(await ellipseShadow(cx, cy + ow * 0.02, ow * 0.55, ow * 0.075, ow * 0.075, 0.16)); // ambient spread
    layers.push(await ellipseShadow(cx, cy, ow * 0.47, ow * 0.03, ow * 0.028, 0.34));               // contact
  } else if (shadow === 'drop') {
    layers.push(await dropShadow(objLayer.input, objLayer.left, objLayer.top, Math.round(ow * 0.04), Math.round(oh * 0.025), 14 * K, 0.2));
  }
  layers.push(objLayer);
  await sharp(bg.data, { raw: { width: W, height: H, channels: 4 } }).composite(layers).webp({ quality: 90 }).toFile(outFile);
  return { srcScale: +(ow / cropped.w).toFixed(2), ow, oh, left, top, objH: +(oh / H).toFixed(3), objW: +(ow / W).toFixed(3), bottom: +((top + oh) / H).toFixed(3) };
}

// ---------- bags: shift up, mirror-extend the bottom -------------------------------------------------------------
async function shiftBag(name, outFile) {
  // original PNG; photographs narrower than 1800px are enlarged with Lanczos and lightly sharpened (no new detail is invented)
  let src = sharp(path.join(srcDir, `${name}.png`)); const meta = await src.metadata();
  if (meta.width < 1800) src = src.resize({ width: 1800, kernel: 'lanczos3' }).sharpen({ sigma: 0.8 });
  const img = await rgba(await src.png().toBuffer()); const shift = Math.round(img.h * SHIFT);
  // Rows below the original bottom are new backdrop, not a mirror image: the three-quarter views sit low in the frame, and
  // mirroring repeated the bag's base along the bottom edge (user 2026-10-01: 「包包的商品圖都有破綻」). The floor is continued from
  // the last rows of the photograph — their per-column mean, smoothed sideways — with the same fine luminance grain.
  const band = 24, floor = new Float64Array(img.w * 3);
  for (let x = 0; x < img.w; x++) for (let c = 0; c < 3; c++) { let v = 0; for (let k = 0; k < band; k++) v += img.data[((img.h - 1 - k) * img.w + x) * 4 + c]; floor[x * 3 + c] = v / band; }
  const smooth = new Float64Array(img.w * 3), R = Math.round(img.w * 0.03);
  for (let x = 0; x < img.w; x++) for (let c = 0; c < 3; c++) { let v = 0, n = 0; for (let k = -R; k <= R; k++) { const xx = Math.min(img.w - 1, Math.max(0, x + k)); v += floor[xx * 3 + c]; n++; } smooth[x * 3 + c] = v / n; }
  let seed = 11; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const out = Buffer.alloc(img.w * img.h * 4);
  for (let y = 0; y < img.h; y++) {
    const r = y + shift;
    if (r < img.h) { img.data.copy(out, y * img.w * 4, r * img.w * 4, (r + 1) * img.w * 4); continue; }
    for (let x = 0; x < img.w; x++) { const n = (rnd() + rnd() - 1) * 1.6, o = (y * img.w + x) * 4; for (let c = 0; c < 3; c++) out[o + c] = Math.max(0, Math.min(255, Math.round(smooth[x * 3 + c] + n))); out[o + 3] = 255; }
  }
  await sharp(out, { raw: { width: img.w, height: img.h, channels: 4 } }).webp({ quality: 92 }).toFile(outFile);
  return { w: img.w, h: img.h, shift, source: [meta.width, meta.height] };
}

// ---------- jobs -----------------------------------------------------------------------------------------------------
const giftBoxes = { 891: 'reunion-paper-gift-box', 64: 'reunion-paulownia-gift-box', 954: 'year-of-plenty-gift-box', 1053: 'blossoming-prosperity-gift-box', 104: 'spring-blossoms-gift-box', 692: 'kyoto-gift-box', 970: 'heart-gift-box', 183: 'fruit-infusion-gift-box', 343: 'rose-encounter-gift-box', 196: 'tea-to-share-gift-box', 850: 'spring-dawn-gift-box', 582: 'winter-blossom-gift-box', 960: 'orchid-gift-box', 88: 'purple-butterfly-gift-box', 1072: 'small-moon-tea-gift-box', 994: 'full-moon-tea-gift-box' };
const jewelrySrc = path.resolve(root, '../09-07-charmvilla/output/jewelry-product-photos-2026-09-30/jewelry-four-series-source.png');
const jewelryBoxes = { 'raw-gold-goldfish-earrings': [147, 197, 420, 419], 'diamond-goldfish-earrings': [656, 114, 840, 581], 'twin-goldfish-earrings': [1132, 78, 1318, 765], 'pearl-chain-goldfish-earrings': [236, 1149, 336, 1913] };

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const bg = await backdrop();
  const wall = await backdrop(true);   // for the earrings
  await sharp(bg.data, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 84 }).toFile(path.join(outDir, 'studio-backdrop.webp'));
  const manifest = {}; const report = {};
  const emit = (slug, file, r) => { manifest[slug] = file; report[slug] = r; console.log(slug.padEnd(34), file.padEnd(46), JSON.stringify(r)); };

  // bags
  for (const [id, slug] of [['bag-white-front', 'braided-leather-bag-white'], ['bag-blue-front', 'braided-leather-bag-blue'], ['bag-pink-front', 'braided-leather-bag-pink']]) {
    const file = `studio-${slug}-hd.webp`; emit(slug, file, await shiftBag(id, path.join(outDir, file)));
  }
  // three-quarter views of the bags, shifted the same way, for the product-page gallery (2026-10-01: the gallery shows studio views only)
  const angles = {};
  for (const [id, slug] of [['bag-white-angle', 'braided-leather-bag-white'], ['bag-blue-angle', 'braided-leather-bag-blue'], ['bag-pink-angle', 'braided-leather-bag-pink']]) {
    const file = `studio-${slug}-angle-hd.webp`; angles[slug] = file; console.log(slug.padEnd(34), file.padEnd(46), JSON.stringify(await shiftBag(id, path.join(outDir, file))));
  }
  // jewelry: one shared true scale (the four series were photographed together); pearl chain = 60% of the frame height
  const chainH = jewelryBoxes['pearl-chain-goldfish-earrings'][3] - jewelryBoxes['pearl-chain-goldfish-earrings'][1];
  const scale = (0.60 * H) / chainH;
  for (const [slug, [x0, y0, x1, y1]] of Object.entries(jewelryBoxes)) {
    if (slug === 'raw-gold-goldfish-earrings') continue; // drawn from the brand's vector outline below
    const m = 16; const crop = await sharp(jewelrySrc).extract({ left: x0 - m, top: y0 - m, width: x1 - x0 + 2 * m, height: y1 - y0 + 2 * m }).png().toBuffer();
    const obj = matte(await rgba(crop), [240, 240, 240], 8, 36);
    // Pearl Chain (user 2026-10-01: 「珍珠的部分參考… 光澤要圓潤，重新再出一張」): the matte takes the white pearl's upper left for
    // background, so the pearl alone is a generated one — whole, round, soft lustre after the user's reference — cut through a
    // circle and laid on at the photographed pearl's centre and radius (canvas px, valid for this scale and centred placement).
    // Chain and goldfish stay the brand's photograph. Source: output/pearl-chain-studio-lustre-2026-10-01 in the assets project.
    const pearl = slug === 'pearl-chain-goldfish-earrings' ? { file: path.join(srcDir, 'pearl-lustre-cutout.png'), disc: 139.5, cx: 994.8, cy: 591.2, r: 90.2 } : null;
    const file = `studio-${slug}-${pearl ? 'lustre' : 'wall'}.webp`; emit(slug, file, await compose(wall, obj, { fit: { scale }, anchor: 'centre', centreY: 0.5, shadow: 'drop', overlay: pearl }, path.join(outDir, file)));
  }
  // Raw Gold (user 2026-10-01: 「直接用剛剛給的向量小金魚，算出清單頁的淺色背景照，用霧面金屬呈現」): the outline is the brand's own vector
  // goldfish, the matte gold surface was generated on that exact outline and cut out through it
  // (output/raw-gold-studio-matte-2026-10-01 → assets-src/studio/raw-gold-matte-cutout.png). The photograph's piece is not used:
  // its bevel highlights read as part of the outline. Same true size as before (the diagonal of its box in the photograph).
  {
    const slug = 'raw-gold-goldfish-earrings', obj = await rgba(path.join(srcDir, 'raw-gold-matte-cutout.png'));
    const [bx0, by0, bx1, by1] = jewelryBoxes[slug], s = (Math.hypot(bx1 - bx0, by1 - by0) * scale) / Math.hypot(obj.w, obj.h);
    const file = `studio-${slug}-matte.webp`; emit(slug, file, await compose(wall, obj, { fit: { scale: s }, anchor: 'centre', centreY: 0.5, shadow: 'drop' }, path.join(outDir, file)));
    const close = `studio-${slug}-matte-close.webp`; angles[`${slug}-close`] = close;
    console.log(slug.padEnd(34), close.padEnd(46), JSON.stringify(await compose(wall, obj, { fit: { w: 700, h: 760 }, anchor: 'centre', centreY: 0.5, shadow: 'drop' }, path.join(outDir, close))));
  }
  // official gift-box cut-outs
  // NOTE 2026-10-02: the 18 tea gift boxes (these 16 and the two Christmas editions below) now use generated studio
  // photographs, public/media/site/listing-tea-<slug>.webp (user: 「改用這個商品攝影的角度…立體感跟陰影的自然呈現…商品要居於畫面中央」). Re-running this
  // script would point them back at studio-<slug>-hd.webp in studio-listing.json; restore the listing-tea entries afterwards.
  for (const [id, slug] of Object.entries(giftBoxes)) {
    const hi = path.join(srcDir, `official-${id}.png`); // the official site's 1440px file where one exists
    const obj = defringeWhite(await rgba(fs.existsSync(hi) ? hi : pub(`media/gift-boxes/official-${id}.png`)));
    const file = `studio-${slug}-hd.webp`; emit(slug, file, await compose(bg, obj, { fit: { w: 780, h: 660 }, anchor: 'floor' }, path.join(outDir, file)));
  }
  // transparent craft photos
  for (const [id, slug, fit] of [['CV-0229', 'ginkgo-teaspoon-gift-box', { w: 800, h: 660 }], ['CV-0227', 'wooden-chopsticks', { w: 800, h: 500 }]]) {
    const obj = await rgba(pub(`media/gallery/${id}.webp`));
    const file = `studio-${slug}-hd.webp`; emit(slug, file, await compose(bg, obj, { fit, anchor: 'floor' }, path.join(outDir, file)));
  }
  // flat-ground photos matted: bird on white, dessert stand set on near-white, Christmas lid mock-ups on light grey
  const flat = [
    ['media/gallery/CV-0256.webp', 'bird-chopstick-rest', [255, 255, 255], { w: 500, h: 420 }, null], // small object: ~42% of the frame (user 2026-10-01: 這張商品要小一點)
    ['media/gallery/CV-0121.webp', 'prosperity-stand-gift-box', [246, 247, 249], { w: 820, h: 700 }, null],
    ['media/gallery/CV-0121.webp', 'prosperity-dessert-stand', [246, 247, 249], { w: 700, h: 720 }, { left: 1340, top: 0, width: 1060, height: 1600 }],
    ['media/site/xmas-lid-stocking-mockup-front.webp', 'christmas-edition-stocking', [13, 46], { w: 820, h: 600 }, null],
    ['media/site/xmas-lid-candycane-mockup-front.webp', 'christmas-edition-candy-cane', [13, 46], { w: 820, h: 600 }, null],
  ];
  for (const [rel, slug, thr, fit, region] of flat) {
    let src = sharp(pub(rel)); if (region) src = src.extract(region);
    const img = await rgba(await src.png().toBuffer());
    const [lo, hi] = thr.length === 2 ? thr : [9, 40]; // mock-up renders keep a faint floor reflection: matte them a touch harder
    const obj = matte(img, fitPlate(img), lo, hi);
    const file = `studio-${slug}-hd.webp`; emit(slug, file, await compose(bg, obj, { fit, anchor: 'floor' }, path.join(outDir, file)));
  }
  // keep entries made outside this script (e.g. the generated wooden-coaster-teaspoon listing)
  const manifestPath = path.join(root, 'src/data/studio-listing.json');
  const existing = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  fs.writeFileSync(manifestPath, JSON.stringify({ ...existing, ...manifest }, null, 2) + '\n');
  // dims manifest
  const dimsPath = path.join(root, 'src/data/images.json'); const dims = JSON.parse(fs.readFileSync(dimsPath, 'utf8'));
  for (const file of [...Object.values(manifest), ...Object.values(angles)]) { const m = await sharp(path.join(outDir, file)).metadata(); dims[`/media/site/${file}`] = [m.width, m.height]; }
  dims['/media/site/studio-backdrop.webp'] = [W, H];
  fs.writeFileSync(dimsPath, JSON.stringify(dims, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'docs/qa/2026-09-30-studio-listing.json'), JSON.stringify({ canvas: [W, H], shift: SHIFT, floor: FLOOR, jewelryScale: +scale.toFixed(4), report }, null, 2) + '\n');
}
main().catch((e) => { console.error(e); process.exit(1); });
