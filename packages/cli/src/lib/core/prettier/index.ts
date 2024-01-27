import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig, Options } from 'prettier';

import { SupportedExtname, SupportedParser } from './types.js';
import { supportedExtname } from './constants.js';

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

export async function formatCode(code: string, parser: Options['parser'] = 'typescript'): Promise<string> {
  const prettierConfig = await resolveConfig(dirname(fileURLToPath(import.meta.url)));
  const formatedCode = await format(code, { parser, ...prettierConfig })
  return formatedCode.trim();
}
