import { join, dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { logVerbose } from './loggin';
import { getParserFromExtname, formatCode } from './prettier';


type IsDefined<T extends {} | undefined = undefined,
  K extends keyof T | undefined = undefined,
  > = T extends undefined ? false :
  K extends undefined ? true : K extends keyof T ? true : false;

/*
type ExtToOutPut<CFG extends ReadFileConfig | undefined = undefined> = IsDefined<CFG> extends CFG ?
  IsDefined<CFG>['ext'] extends string ? IsDefined<CFG>['ext'] extends 'json' ? {} : never;

 */
type ExtToOutPut<CFG extends ReadFileConfig, R = undefined> =
// if cfg not given
  IsDefined<CFG, 'ext'> extends false ? string :
    // if ext prop present but undefined
    CFG['ext'] extends undefined ? string :
      // if ext prop present
      CFG['ext'] extends 'json' ? R extends undefined ? {} :
        // if type given
        R extends undefined ? {} : R :
        // else
        string;
/*
type undef = IsDefined;
type r = IsDefined;
type t = IsDefined<undef>;
type u = IsDefined<{ext: undefined}>;
type l = IsDefined<{ext: string}>;
type v = IsDefined<{po: string}, 'po'>;
// type p = IsDefined<{po: string}, 'o'>; // errors
// type i = ExtToOutPut; // error
type a = ExtToOutPut<{}>; // string
type b = ExtToOutPut<{ext: 'json'}>;  // {}
type d = ExtToOutPut<{ext: 'json'}, number>;  // number
// type f = ExtToOutPut<{ext: 234}>;  // errors
// type h = ExtToOutPut<{ext: 'sda'}>; // errors
*/

export type ReadFileConfig = { fail?: boolean, ext?: 'json' };

/**
 * Ensures the file exists before reading it
 */
export function readFile<R = undefined>(path: string, cfg?: ReadFileConfig): ExtToOutPut<ReadFileConfig, R> {
  cfg = { fail: false, ...(cfg as ReadFileConfig || {}) };
  const errorStr = `${path} does not exist.`;
  let textContent = undefined;
  if (existsSync(path)) {
    textContent = readFileSync(path, 'utf-8');

    if (cfg?.ext === 'json') {
      return JSON.parse(textContent) as ExtToOutPut<ReadFileConfig, R>;
    }

    return textContent as ExtToOutPut<ReadFileConfig, R>;
  } else {
    if (cfg.fail) {
      throw new Error(errorStr);
    }
    logVerbose(errorStr);
  }

  return '' as ExtToOutPut<ReadFileConfig, R>;
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
  // start path from cwd
  path = join(process.cwd(), path);

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
  // then there are 2 cases for exporing an object. The first one is:
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
