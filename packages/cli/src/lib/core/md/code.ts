import { NEW_LINE } from './constants';

/**
 * ```{format}
 *   {code}
 * ```
 * or with inline set to `true`
 * `{code}`
 */
export function code(code: string, cfg: {format: string, inline: boolean}): string {
  if(cfg?.inline) {
    return `\`${code}\``;
  }
  const format = cfg?.format || 'javascript';
  return `
\`\`\`${format}${NEW_LINE}
${code}
\`\`\` ${NEW_LINE}
${NEW_LINE}`;
}
