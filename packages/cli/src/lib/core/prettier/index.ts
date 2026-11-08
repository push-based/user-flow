import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig, Options as PrettierOptions } from 'prettier';
import { SupportedExtname, SupportedParser } from './types.js';
import { supportedExtname } from './constants.js';

export function getParserFromExtname(extname: SupportedExtname | string): SupportedParser {
  extname = extname[0] === '.' ? extname.slice(1, extname.length) : extname;

  if (!supportedExtname.includes(extname)) {
    throw new Error(`Extension name ${extname} is not supported.`);
  }

  const parserByExtname: Record<string, string> = {
    md: 'markdown',
    ts: 'typescript',
    js: 'javascript',
    yml: 'yaml'
  };
  return (['md', 'ts', 'mts', 'js', 'yml'].includes(extname) ? parserByExtname[extname] : extname) as SupportedParser;
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
  const prettierConfig = await resolveConfig(dirname(fileURLToPath(import.meta.url)));
  const content = await format(code, { parser, ...prettierConfig })
  return content.trim();
}
