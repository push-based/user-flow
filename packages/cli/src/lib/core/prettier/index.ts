import {
  format as prettier,
  Options as PrettierOptions,
  resolveConfig,
} from 'prettier';
import { SupportedExtname, SupportedParser } from './types';
import { supportedExtname } from './constants';

export function getParserFromExtname(
  extname: SupportedExtname | string
): SupportedParser {
  extname = extname[0] === '.' ? extname.slice(1, extname.length) : extname;

  if (!supportedExtname.includes(extname)) {
    throw new Error(`Extension name ${extname} is not supported.`);
  }

  return (['md', 'ts', 'js', 'yml'].includes(extname)
    ? (
        {
          md: 'markdown',
          ts: 'typescript',
          js: 'javascript',
          yml: 'yaml',
        } as any
      )[extname]
    : extname) as any as SupportedParser;
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
  const prettierConfig = resolveConfig.sync(__dirname);
  return prettier(code, {
    parser,
    ...prettierConfig,
  }).trim();
}
