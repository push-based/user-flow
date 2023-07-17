import {dirname} from 'path';
import {existsSync, readFileSync, writeFileSync, mkdirSync, lstatSync} from 'fs';
import {logVerbose} from '../loggin';
import {getParserFromExtname, formatCode} from '../prettier';
import {ReadFileConfig} from '../../commands/collect/utils/replay/types';
import {ExtToOutPut, ResolveFileResult} from './types';
import * as process from "process";

export {toFileName} from './to-file-name';

/*
type _a = Not<undefined, undefined>;
type _b = Not<number, undefined>;
type _c = Not<undefined, number>;
*/
type Not<T, R> = R extends T ? never : R;

/*
// type a1 = ReadFileOutput<{ ext: 'json' }>;  // any
type a2 = ReadFileOutput<{ ext: 'json' }, undefined>;  // {}
type a3 = ReadFileOutput<{ ext: 'json' }, number>;  // number
*/
type ReadFileOutput<CFG extends {}, OVERWRITE extends unknown> =
// if OVERWRITE type is given return it
  Not<OVERWRITE, undefined> extends never ? ExtToOutPut<CFG> : OVERWRITE;

function jsonParse<T extends unknown>(str: any): T {
  return JSON.parse(str) as T;
}

/*
const w = readFile('path') // string
const x = readFile('path', {}) // string
const y = readFile('path', {ext: 'json'}) // {}
const z = readFile<{ n: number }>('path', {ext: 'json'}) // {n: number}
*/

/**
 * Ensures the file exists before reading it
 */
export function readFile<R extends any = undefined, T extends ReadFileConfig = {}>(path: string, cfg?: T) {
  const {fail, ext} = {fail: false, ...cfg} as T;
  type RETURN = ReadFileOutput<T, R>;

  if (!existsSync(path)) {
    const errorStr = `${path} does not exist.`;
    if (!fail) {
      logVerbose(errorStr);
      return '' as RETURN;
    }
    throw new Error(errorStr);
  }
  if (lstatSync(path).isDirectory()) {
    throw new Error(`${path} is a directory but needs to be a file.`);
  }

  const fileContent = readFileSync(path, 'utf-8');
  return ext === 'json' ? jsonParse<RETURN>(fileContent) : fileContent as RETURN;
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

export function resolveAnyFile<T>(cfg: { path: string, tsConfigExtendPath?: string }): ResolveFileResult<T> {
  // 🔥 Live compilation of TypeScript files
  if (cfg.path.endsWith('.ts')) {
    let tsConfig: any = undefined;
    logVerbose(`cwd: ${process.cwd()}`);
    logVerbose(`tsConfigExtendPath: ${cfg.tsConfigExtendPath}`);
    if (cfg.tsConfigExtendPath) {
      if (existsSync(cfg.tsConfigExtendPath)) {
        logVerbose(`${cfg.tsConfigExtendPath} is used as "extends" to load ${cfg.path}`)
        tsConfig = cfg.tsConfigExtendPath;
      } else {
        throw new Error(`tsConfigPath ${cfg.tsConfigExtendPath} is provided but does not exist!`);
      }
    }
    // Register TS compiler lazily
    // tsNode needs the compilerOptions.module resolution to be 'commonjs',
    // so that imports in the `*.uf.ts` files work.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
   // require('ts-node').register(tsConfig);

    const { register } = require('@swc-node/register/register');
    register(tsConfig)

  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const file = require(cfg.path);

  // If the user provides a configuration in TS file
  // then there are 2 cases for exporting an object. The first one is:
  // `module.exports = { ... }`. And the second one is:
  // `export default { ... }`. The ESM format is compiled into:
  // `{ default: { ... } }`
  const exports = file.default || file;
  return { exports, path: cfg.path };
}

