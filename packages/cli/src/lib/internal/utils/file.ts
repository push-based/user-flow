import { join, dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

/**
 * Ensures the file exists before reading it
 */
export function readFile(path: string) {
  if (existsSync(path)) {
    return readFileSync(path, 'utf-8');
  }
  return '';
}

/**
 * Ensures the folder exists before writing it
 */
export function writeFile(path: string, data: any) {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir)
  }
  return writeFileSync(path, data);
}


export function resolveAnyFile<T>(path: string): T {
  // start path from cwd
  path = join(process.cwd(), path);
  let file;

  // 🔥 Live compilation of TypeScript files
  if (path.endsWith('.ts')) {
    // Register TS compiler lazily
    // tsNode needs the compilerOptions.module resolution to be 'commonjs',
    // so that imports in the `.uf.ts` files work.
    require('ts-node').register({
      "compilerOptions": {
        "module": "commonjs"
      }
    });
  }
  file = require(path);

  // If the user provides a configuration in TS file
  // then there are 2 cases for exporing an object. The first one is:
  // `module.exports = { ... }`. And the second one is:
  // `export default { ... }`. The ESM format is compiled into:
  // `{ default: { ... } }`
  const exports = file.default || file;
  return exports;
}


/**
 * Upper or camelCase to lowercase hyphenated
 */
export function toFileName(s: string): string {
  return s
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[ _]/g, '-')
    .replace(/[/\\]/g, '-');
}


