// Isolated checkout tests: build into .next/test-*, use a loopback Shopify mock, run Node/Chrome suites, stop children.
// No .env.local credentials reach the test servers. Snapshot identities and mock stock never write to Shopify.
// --no-build may reuse builds only when application code and compile-time configuration have not changed.
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { writeFixture } from "./support/fixture.mjs";
import { createMockShopify, STOREFRONT_TOKEN, ADMIN_TOKEN } from "./mock-shopify/server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT = path.join(ROOT, "node_modules/next/dist/bin/next");
const suites = process.argv.includes("e2e") ? ["e2e"] : process.argv.includes("api") ? ["api"] : ["api", "e2e"];
const build = !process.argv.includes("--no-build");
const BUILDS = {
  shopify: { CV_TEST_BUILD: ".next/test-shopify", NEXT_PUBLIC_COMMERCE_MODE: "shopify", NEXT_PUBLIC_ACCOUNTS_OPEN: "true" },
  local: { CV_TEST_BUILD: ".next/test-local", NEXT_PUBLIC_COMMERCE_MODE: "local", NEXT_PUBLIC_ACCOUNTS_OPEN: "true" },
};
// a clean environment: no real Shopify variables from the developer's shell ever reach the test servers
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(SHOPIFY_|NEXT_PUBLIC_|PREORDER_|CV_TEST_|VERCEL)/.test(k)));
// Next loads .env.local even with a filtered process environment. Explicit blanks prevent real credentials/accounts/analytics
// from being reintroduced. The only non-empty test credentials below belong to the loopback mock.
Object.assign(baseEnv, Object.fromEntries(["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_ACCESS_TOKEN", "SHOPIFY_ADMIN_ACCESS_TOKEN", "SHOPIFY_CLIENT_ID", "SHOPIFY_CLIENT_SECRET", "SHOPIFY_CUSTOMER_ACCOUNT_URL", "NEXT_PUBLIC_GA4_MEASUREMENT_ID", "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN"].map(k => [k, ""])));

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
  mock = createMockShopify({ catalog: (await import("./support/fixture.mjs")).readFixture() });
  const mockOrigin = await mock.listen();
  const shopEnv = { SHOPIFY_STORE_DOMAIN: mockOrigin, SHOPIFY_STOREFRONT_ACCESS_TOKEN: STOREFRONT_TOKEN, SHOPIFY_ADMIN_ACCESS_TOKEN: ADMIN_TOKEN };
  if (build) for (const mode of suites.includes("e2e") ? ["shopify", "local"] : ["shopify"]) {
    console.log(`\n▶ building (${mode} mode, ${BUILDS[mode].CV_TEST_BUILD})`);
    await run(process.execPath, [NEXT, "build"], { ...BUILDS[mode], ...(mode === "shopify" ? shopEnv : {}) }, { quiet: true });
  }
  const full = await startNext("full", BUILDS.shopify, shopEnv);
  const bare = await startNext("bare", BUILDS.shopify, {});
  const local = suites.includes("e2e") ? await startNext("local", BUILDS.local, {}) : "";
  console.log(`▶ mock ${mockOrigin} · full ${full} · bare ${bare}${local ? ` · local ${local}` : ""}`);
  for (const suite of suites) {
    const dir = path.join(ROOT, "tests", suite);
    const files = readdirSync(dir).filter((f) => f.endsWith(".test.mjs")).map((f) => path.join("tests", suite, f));
    console.log(`\n▶ ${suite} tests`);
    try { await run(process.execPath, ["--test", "--test-concurrency=1", ...(process.env.TEST_NAME_PATTERN ? [`--test-name-pattern=${process.env.TEST_NAME_PATTERN}`] : []), ...files], { TEST_BASE: full, TEST_BARE_BASE: bare, TEST_LOCAL_BASE: local, MOCK_ORIGIN: mockOrigin }); }
    catch { failed = true; }
  }
} catch (e) {
  failed = true; console.error(e);
} finally {
  for (const c of children) c.kill("SIGTERM");
  await mock?.close();
}
process.exit(failed ? 1 : 0);
