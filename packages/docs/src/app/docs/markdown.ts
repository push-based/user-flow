import { Marked, Tokens } from 'marked';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('jsonc', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('text', plaintext);

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocEntry[];
}

export interface RenderOptions {
  /** The document base href, so absolute in-app links work below a sub path. */
  baseHref?: string;
}

const CALLOUTS: Record<string, string> = {
  TIP: 'Tip',
  NOTE: 'Note',
  WARNING: 'Warning',
  IMPORTANT: 'Important',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renders a Markdown document to HTML with highlighted code blocks,
 * anchored headings, GitHub-style callouts and a table of contents.
 */
export function renderMarkdown(
  source: string,
  options: RenderOptions = {},
): RenderedMarkdown {
  const baseHref = (options.baseHref ?? '/').replace(/\/$/, '');
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(inner);
        let suffix = 1;
        while (usedIds.has(id)) {
          id = `${slugify(inner)}-${++suffix}`;
        }
        usedIds.add(id);
        if (depth === 2 || depth === 3) {
          toc.push({ id, text: inner.replace(/<[^>]+>/g, ''), level: depth });
        }
        const anchor =
          depth > 1
            ? `<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>`
            : '';
        return `<h${depth} id="${id}">${inner}${anchor}</h${depth}>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        const [language, ...meta] = (lang ?? '').trim().split(/\s+/);
        const title = meta.join(' ').match(/title="?([^"]+)"?/)?.[1];
        const known = language && hljs.getLanguage(language);
        const body = known
          ? hljs.highlight(text, { language }).value
          : escapeHtml(text);
        const header = title
          ? `<div class="code-title"><span>${escapeHtml(title)}</span></div>`
          : '';
        return `<figure class="code-block${title ? ' has-title' : ''}">${header}<pre><code class="hljs language-${escapeHtml(language || 'text')}">${body}</code></pre></figure>\n`;
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        const inner = this.parser.parse(tokens);
        const match = inner.match(
          /^<p>\[!(TIP|NOTE|WARNING|IMPORTANT)\]\s*(?:<br>)?\s*/,
        );
        if (!match) {
          return `<blockquote>${inner}</blockquote>\n`;
        }
        const kind = match[1];
        const rest = inner.slice(match[0].length);
        const body = rest.startsWith('</p>') ? rest.slice(4) : `<p>${rest}`;
        return `<aside class="callout callout-${kind.toLowerCase()}"><p class="callout-title">${CALLOUTS[kind]}</p>${body}</aside>\n`;
      },
      table({ header, rows }: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: 'th' | 'td') =>
          `<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        const head = `<tr>${header.map((c) => cell(c, 'th')).join('')}</tr>`;
        const body = rows
          .map((r) => `<tr>${r.map((c) => cell(c, 'td')).join('')}</tr>`)
          .join('');
        return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const internal = href.startsWith('/');
        const attrs = [
          `href="${internal ? baseHref + href : href}"`,
          internal ? `data-internal="${href}"` : '',
          title ? `title="${escapeHtml(title)}"` : '',
          external ? 'target="_blank" rel="noopener noreferrer"' : '',
        ]
          .filter(Boolean)
          .join(' ');
        return `<a ${attrs}>${inner}</a>`;
      },
    },
  });

  const html = marked.parse(source) as string;
  return { html, toc };
}
