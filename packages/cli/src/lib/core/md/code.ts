import { NEW_LINE } from './constants.js';

/**
 * ```{format}
 *   {code}
 * ```
 * or with inline set to `true`
 * `{code}`
 */
export function code(content: string, cfg: {format: string}): string {
  if(cfg?.format === 'inline') {
    return `\`${content}\``;
  }
  const format = cfg?.format || 'javascript';
  return `
\`\`\`${format}${NEW_LINE}
${content}
\`\`\` ${NEW_LINE}
${NEW_LINE}`;
}
