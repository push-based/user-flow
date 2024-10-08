import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Prettier, { Options as PrettierOptions } from 'prettier';
import { SupportedExtname, SupportedParser } from './types.js';
import { supportedExtname } from './constants.js';

export function getParserFromExtname(extname: SupportedExtname | string): SupportedParser {
  extname = extname[0] === '.' ? extname.slice(1, extname.length) : extname;

  if (!supportedExtname.includes(extname)) {
    throw new Error(`Extension name ${extname} is not supported.`);
  }

  return (['md', 'ts', 'mts', 'js', 'yml'].includes(extname) ? ({
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
export async function formatCode(
  code: string,
  parser: PrettierOptions['parser'] = 'typescript'
) {
  const prettierConfig = await Prettier.resolveConfig(dirname(fileURLToPath(import.meta.url)));
  const content = await Prettier.format(code, { parser, ...prettierConfig })
  return content.trim();
}
