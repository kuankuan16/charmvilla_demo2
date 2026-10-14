// Checkout test runner: npm run test:api | test:e2e | test (both).
//   1. writes the test fixture (fake variant GIDs + prices from the site catalogue) to tests/.generated/
//   2. builds the site in shopify mode into .next/test-shopify (and, for e2e, in local mode into .next/test-local), reading the
//      fixture map instead of src/data/shopify-map.json (next.config.ts, CV_TEST_*; never on Vercel)
//   3. starts the mock Shopify (tests/mock-shopify/server.mjs) and `next start` servers on free ports:
//        full  — shopify mode, Storefront + Admin pointed at the mock
//        bare  — the same build with no Shopify variables (the "not configured" answers)
//        local — the local-mode build (e2e only)
//   4. runs node --test on tests/api or tests/e2e, then stops everything.
// Flags: --no-build reuses the last test builds (only after a run on the same code).
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { writeFixture, MAP_FILE } from "./support/fixture.mjs";
import { createMockShopify, STOREFRONT_TOKEN, ADMIN_TOKEN } from "./mock-shopify/server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT = path.join(ROOT, "node_modules/next/dist/bin/next");
const suites = process.argv.includes("e2e") ? ["e2e"] : process.argv.includes("api") ? ["api"] : ["api", "e2e"];
const build = !process.argv.includes("--no-build");
const BUILDS = {
  shopify: { CV_TEST_BUILD: ".next/test-shopify", CV_TEST_SHOPIFY_MAP: `./${path.relative(ROOT, MAP_FILE)}`, NEXT_PUBLIC_COMMERCE_MODE: "shopify", NEXT_PUBLIC_ACCOUNTS_OPEN: "true" },
  local: { CV_TEST_BUILD: ".next/test-local", CV_TEST_SHOPIFY_MAP: `./${path.relative(ROOT, MAP_FILE)}`, NEXT_PUBLIC_COMMERCE_MODE: "local", NEXT_PUBLIC_ACCOUNTS_OPEN: "true" },
};
// a clean environment: no real Shopify variables from the developer's shell ever reach the test servers
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(SHOPIFY_|NEXT_PUBLIC_|PREORDER_|CV_TEST_|VERCEL)/.test(k)));

const children = [];
const run = (cmd, args, env, { quiet = false } = {}) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { cwd: ROOT, env: { ...baseEnv, ...env }, stdio: quiet ? ["ignore", "pipe", "pipe"] : "inherit" });
  let out = ""; if (quiet) { child.stdout.on("data", (d) => (out += d)); child.stderr.on("data", (d) => (out += d)); }
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}\n${out.slice(-4000)}`))));
});
const freePort = () => new Promise((resolve) => { const s = net.createServer(); s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => resolve(port)); }); });
async function startNext(name, buildEnv, env) {
  const port = await freePort();
  const child = spawn(process.execPath, [NEXT, "start", "-p", String(port), "-H", "127.0.0.1"], { cwd: ROOT, env: { ...baseEnv, ...buildEnv, ...env, NODE_ENV: "production" }, stdio: ["ignore", "pipe", "pipe"] });
  children.push(child);
  let log = ""; child.stdout.on("data", (d) => (log += d)); child.stderr.on("data", (d) => { log += d; if (process.env.TEST_VERBOSE) process.stderr.write(`[${name}] ${d}`); });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`${name} server exited:\n${log}`);
    try { const r = await fetch(`${base}/api/cart`); if (r.status < 500) return base; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`${name} server did not start:\n${log}`);
}

let mock;
let failed = false;
try {
  await writeFixture();
  if (build) for (const mode of suites.includes("e2e") ? ["shopify", "local"] : ["shopify"]) {
    console.log(`\n▶ building (${mode} mode, ${BUILDS[mode].CV_TEST_BUILD})`);
    await run(process.execPath, [NEXT, "build"], BUILDS[mode], { quiet: true });
  }
  mock = createMockShopify({ catalog: (await import("./support/fixture.mjs")).readFixture() });
  const mockOrigin = await mock.listen();
  const shopEnv = { SHOPIFY_STORE_DOMAIN: mockOrigin, SHOPIFY_STOREFRONT_ACCESS_TOKEN: STOREFRONT_TOKEN, SHOPIFY_ADMIN_ACCESS_TOKEN: ADMIN_TOKEN, PREORDER_CACHE_MS: "0", PREORDER_COUNT_SINCE: "2026-01-01" };
  const full = await startNext("full", BUILDS.shopify, shopEnv);
  const bare = await startNext("bare", BUILDS.shopify, {});
  const local = suites.includes("e2e") ? await startNext("local", BUILDS.local, {}) : "";
  console.log(`▶ mock ${mockOrigin} · full ${full} · bare ${bare}${local ? ` · local ${local}` : ""}`);
  for (const suite of suites) {
    const dir = path.join(ROOT, "tests", suite);
    const files = readdirSync(dir).filter((f) => f.endsWith(".test.mjs")).map((f) => path.join("tests", suite, f));
    console.log(`\n▶ ${suite} tests`);
    try { await run(process.execPath, ["--test", "--test-concurrency=1", ...files], { TEST_BASE: full, TEST_BARE_BASE: bare, TEST_LOCAL_BASE: local, MOCK_ORIGIN: mockOrigin }); }
    catch { failed = true; }
  }
} catch (e) {
  failed = true; console.error(e);
} finally {
  for (const c of children) c.kill("SIGTERM");
  await mock?.close();
}
process.exit(failed ? 1 : 0);
