import { dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { logVerbose } from '../loggin';
import { getParserFromExtname, formatCode } from '../prettier';
import { ReadFileConfig } from '../../../commands/collect/utils/replay/types';
import { ExtToOutPut } from './types';

/**
 * Ensures the file exists before reading it
 */
export function readFile<R = undefined, T extends ReadFileConfig = {}>(path: string, cfg?: T): ExtToOutPut<T, R> {
  cfg = { fail: false, ...cfg } as T;
  const errorStr = `${path} does not exist.`;
  let textContent: string = '';
  if (existsSync(path)) {
    textContent = readFileSync(path, 'utf-8');
    const jsonRecording = JSON.parse(textContent) as ExtToOutPut<T, R>;

    if (cfg === undefined) {
      return jsonRecording as ExtToOutPut<T, R>;
    }

    if (cfg?.ext === 'json') {
      return jsonRecording as ExtToOutPut<T, R>;
    }

    return textContent as ExtToOutPut<T, R>;
  } else {
    if (cfg.fail) {
      throw new Error(errorStr);
    }
    logVerbose(errorStr);
  }

  return '' as ExtToOutPut<T, R>;
}


/**
 * Ensures the folder exists before writing it
 */
export function writeFile(filePath: string, data: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    logVerbose(`Created dir ${dir} to save ${filePath}`);
    mkdirSync(dir);
  }

  const ext = filePath.split('.').pop() || '';
  const formattedData = formatCode(data, getParserFromExtname(ext));
  // @TODO implement a check that saves the file only if the content is different => git noise
  return writeFileSync(filePath, formattedData);
}

export function resolveAnyFile<T>(path: string): { exports: T; path: string } {
  // 🔥 Live compilation of TypeScript files
  if (path.endsWith('.ts')) {
    // Register TS compiler lazily
    // tsNode needs the compilerOptions.module resolution to be 'commonjs',
    // so that imports in the `*.uf.ts` files work.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('ts-node').register({
      transpileOnly: true,
      compilerOptions: {
        module: 'commonjs',
        strict: false
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const file = require(path);

  // If the user provides a configuration in TS file
  // then there are 2 cases for exporting an object. The first one is:
  // `module.exports = { ... }`. And the second one is:
  // `export default { ... }`. The ESM format is compiled into:
  // `{ default: { ... } }`
  const exports = file.default || file;
  return { exports, path };
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
