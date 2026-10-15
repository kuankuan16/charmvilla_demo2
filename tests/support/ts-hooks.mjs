// Node module hooks so test scripts can import the site's TypeScript data (src/data/*.ts) directly with Node 24's type
// stripping: resolves the "@/…" path alias, extensionless relative imports (→ .ts/.tsx) and JSON imports.
// Used only by tests/support/catalog.mjs (registered from tests/support/register-ts.mjs). Nothing here is part of the site build.
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");
const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };

export async function resolve(specifier, context, next) {
  let url = null;
  if (specifier.startsWith("@/")) url = pathToFileURL(path.join(SRC, specifier.slice(2))).href;
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) url = new URL(specifier, context.parentURL).href;
  if (url) {
    const base = fileURLToPath(url);
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
      if (!isFile(candidate)) continue;
      const json = candidate.endsWith(".json");
      return { url: pathToFileURL(candidate).href, shortCircuit: true, ...(json ? { importAttributes: { type: "json" } } : {}) };
    }
  }
  return next(specifier, context);
}
