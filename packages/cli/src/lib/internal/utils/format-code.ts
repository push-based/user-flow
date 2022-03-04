import { format as prettier, Options as PrettierOptions, resolveConfig } from 'prettier';

export function formatCode(
  code: string,
  parser: PrettierOptions['parser'] = 'typescript'
) {
  const prettierConfig = resolveConfig.sync(__dirname);
  return prettier(code, {
    parser,
    ...prettierConfig
  }).trim();
}
