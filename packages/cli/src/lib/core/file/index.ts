import { dirname } from 'node:path';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync, mkdirSync, lstatSync } from 'node:fs';

import { register } from 'ts-node';

import { logVerbose } from '../loggin/index.js';
import { getParserFromExtname, formatCode } from '../prettier/index.js';
import { ReadFileConfig } from '../../commands/collect/utils/replay/types.js';
import { ExtToOutPut, ResolveFileResult } from './types.js';

export {toFileName} from './to-file-name.js';

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
  const {fail, ext} = { fail: false, ...cfg } as T;
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
export async function writeFile(filePath: string, data: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    logVerbose(`Created dir ${dir} to save ${filePath}`);
    mkdirSync(dir);
  }

  const ext = filePath.split('.').pop() || '';
  const formattedData = formatCode(data, getParserFromExtname(ext));
  // @TODO implement a check that saves the file only if the content is different => git noise
  return writeFileSync(filePath, await formattedData);
}

export function resolveAnyFile<T>(path: string): ResolveFileResult<T> {
  if (path.endsWith('.ts')) {
    register({
      esm: true,
      transpileOnly: true,
      compilerOptions: {
        target: 'esnext',
        module: 'nodenext',
        strict: false
      }
    });
  }
  const file = createRequire(import.meta.url)(path);
  const exports = file.default || file;
  return { exports, path };
}
