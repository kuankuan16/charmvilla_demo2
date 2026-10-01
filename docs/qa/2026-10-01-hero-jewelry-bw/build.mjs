// Black-and-white version of the homepage jewellery slide (user 2026-10-01: 「首頁這張改黑白照試試看」). 0 credits.
// Source: public/media/gallery/CV-0380.webp (pearl chain goldfish earring, profile light). Luminance mix weighted to green
// (skin keeps its modelling, the grey-blue wall goes mid grey), a gentle S-curve that holds the cream collar below white,
// and fine grain to sit beside the two black-and-white dancer photographs.
import sharp from "sharp"; import fs from "node:fs"; import crypto from "node:crypto";
{
  const src = "public/media/gallery/CV-0380.webp", out = "public/media/hero/pearl-earring-profile-bw.webp";
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height, g = Buffer.alloc(n);
  const curve = new Uint8Array(256);
  for (let v = 0; v < 256; v++) { const x = v / 255; const s = x * x * (3 - 2 * x); const y = x + (s - x) * 0.45; curve[v] = Math.round(255 * Math.min(1, y * 0.985)); }   // S-curve at 45%, whites held at 251
  let seed = 20261001; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < n; i++) {
    const l = 0.28 * data[i * 3] + 0.62 * data[i * 3 + 1] + 0.10 * data[i * 3 + 2];
    const grain = (rnd() + rnd() - 1) * 3.2;
    g[i] = Math.max(0, Math.min(255, Math.round(curve[Math.round(l)] + grain)));
  }
  await sharp(g, { raw: { width: info.width, height: info.height, channels: 1 } }).toColourspace("b-w").webp({ quality: 86 }).toFile(out);
  const m = await sharp(out).metadata(); const st = await sharp(out).stats();
  const sha = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
  const rec = { source: src, sourceSha256: sha(src), output: out, outputSha256: sha(out), width: m.width, height: m.height, channels: m.channels, bytes: fs.statSync(out).size, mean: Math.round(st.channels[0].mean), max: st.channels[0].max, min: st.channels[0].min };
  fs.writeFileSync("docs/qa/2026-10-01-hero-jewelry-bw/build.json", JSON.stringify(rec, null, 1)); console.log(rec);
  await sharp(out).resize(900).jpeg({ quality: 82 }).toFile("docs/qa/2026-10-01-hero-jewelry-bw/preview.jpg");
}
