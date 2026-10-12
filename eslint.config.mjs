import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code keeps complete nested worktrees (including generated .next output) here.
    // They are independent checkouts and must not be linted as part of this root project.
    ".claude/**",
    "docs/research/**/source/**",
  ]),
]);

export default eslintConfig;
