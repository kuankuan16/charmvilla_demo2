// Resolve this project's extensionless TypeScript imports for Node 24's built-in test runner.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'node:path';
const src = fileURLToPath(new URL('../../src/', import.meta.url));
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) specifier = pathToFileURL(resolvePath(src, specifier.slice(2))).href;
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (specifier.startsWith('.') || specifier.startsWith('file:')) {
        const candidate = new URL(`${specifier}.ts`, context.parentURL);
        if (existsSync(candidate)) return nextResolve(candidate.href, context);
      }
      throw error;
    }
  },
});
