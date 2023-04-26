import prettier, { Options as PrettierOptions } from 'prettier';
import { SupportedExtname, SupportedParser } from './types.js';
import { supportedExtname } from './constants.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function getParserFromExtname(extname: SupportedExtname | string): SupportedParser {
  extname = extname[0] === '.' ? extname.slice(1, extname.length) : extname;

  if (!supportedExtname.includes(extname)) {
    throw new Error(`Extension name ${extname} is not supported.`);
  }

  return (['md', 'ts', 'js', 'yml'].includes(extname) ? ({
    md: 'markdown',
    ts: 'typescript',
    js: 'javascript',
    yml: 'yaml'
  } as any)[extname] : extname) as any as SupportedParser;
}

/**
 * Code formatter that uses prettier under the hood
 *
 * @param code
 * @param parser
 */


export function formatCode(
  code: string,
  parser: PrettierOptions['parser'] = 'typescript'
) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const prettierConfig = prettier.resolveConfig.sync(__dirname);
  return prettier.format(code, {
    parser,
    ...prettierConfig
  }).trim();
}
