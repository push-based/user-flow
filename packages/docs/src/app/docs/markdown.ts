import { Marked, Token, Tokens } from 'marked';
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

/** Label shown in a code block's header when it has no title. */
const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Terminal',
  sh: 'Terminal',
  shell: 'Terminal',
};

const COPY_BUTTON =
  '<button class="code-copy" type="button" aria-label="Copy code" title="Copy">' +
  '<svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>' +
  '<svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' +
  '<span class="code-copy-label" aria-hidden="true">Copied</span>' +
  '</button>';

const CALLOUTS: Record<string, string> = {
  TIP: 'Tip',
  NOTE: 'Note',
  WARNING: 'Warning',
  IMPORTANT: 'Important',
};

/** Consecutive fenced blocks with a `tab="…"` attribute, shown as one tabbed block. */
interface CodeTabsToken {
  type: 'codeTabs';
  raw: string;
  tabs: Tokens.Code[];
}

const tabName = (token: Token) =>
  token.type === 'code'
    ? ((token as Tokens.Code).lang ?? '').match(/\btab="([^"]+)"/)?.[1]
    : undefined;

/**
 * Folds runs of tab-marked code blocks into one `codeTabs` token, at every
 * level, so tabs also work inside list items.
 */
function groupCodeTabs(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!tabName(token)) {
      for (const key of ['tokens', 'items'] as const) {
        const children = (token as { [k: string]: unknown })[key];
        if (Array.isArray(children)) {
          (token as { [k: string]: unknown })[key] = groupCodeTabs(
            children as Token[],
          );
        }
      }
      out.push(token);
      continue;
    }
    const tabs = [token as Tokens.Code];
    let j = i + 1;
    while (j < tokens.length) {
      if (tokens[j].type === 'space') {
        j++;
      } else if (tabName(tokens[j])) {
        tabs.push(tokens[j] as Tokens.Code);
        j++;
      } else {
        break;
      }
    }
    // Keep trailing whitespace tokens: they separate the group from what follows.
    while (j > i + 1 && tokens[j - 1].type === 'space') {
      j--;
    }
    out.push({ type: 'codeTabs', raw: '', tabs } as unknown as Token);
    i = j - 1;
  }
  return out;
}

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

/** The highlighted `<pre>` for a fenced block, plus its language and title. */
function codeBody({ text, lang }: Tokens.Code) {
  const [language, ...meta] = (lang ?? '').trim().split(/\s+/);
  const title = meta.join(' ').match(/title="?([^"]+)"?/)?.[1];
  const known = language && hljs.getLanguage(language);
  const body = known
    ? hljs.highlight(text, { language }).value
    : escapeHtml(text);
  return {
    title,
    label: title ?? LANGUAGE_LABELS[language] ?? '',
    pre: `<div class="code-scroll"><pre><code class="hljs language-${escapeHtml(language || 'text')}">${body}</code></pre></div>`,
  };
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
  let tabGroups = 0;

  const marked = new Marked({
    gfm: true,
    extensions: [
      {
        name: 'codeTabs',
        level: 'block',
        // Tokens of this type only come from groupCodeTabs, never from the lexer.
        tokenizer: () => undefined,
        renderer(token) {
          const { tabs } = token as unknown as CodeTabsToken;
          const group = ++tabGroups;
          const names = tabs.map((tab) => tabName(tab) ?? '');
          const buttons = names
            .map(
              (name, i) =>
                `<button class="code-tab" type="button" role="tab" id="tab-${group}-${i}" aria-controls="tabpanel-${group}-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${escapeHtml(name)}">${escapeHtml(name)}</button>`,
            )
            .join('');
          const panels = tabs
            .map(
              (tab, i) =>
                `<div class="code-tabpanel" role="tabpanel" id="tabpanel-${group}-${i}" aria-labelledby="tab-${group}-${i}" data-tab="${escapeHtml(names[i])}"${i === 0 ? '' : ' hidden'}>${codeBody(tab).pre}</div>`,
            )
            .join('');
          return `<figure class="code-block code-tabs"><div class="code-title"><div class="code-tablist" role="tablist" aria-label="Choose a variant">${buttons}<span class="code-tab-indicator" aria-hidden="true"></span></div>${COPY_BUTTON}</div>${panels}</figure>\n`;
        },
      },
    ],
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
      code(token: Tokens.Code) {
        const { title, label, pre } = codeBody(token);
        const header = `<div class="code-title"><span>${escapeHtml(label)}</span>${COPY_BUTTON}</div>`;
        return `<figure class="code-block${title ? ' has-title' : ''}">${header}${pre}</figure>\n`;
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
        const labels = header.map((c) =>
          this.parser.parseInline(c.tokens).replace(/<[^>]+>/g, ''),
        );
        const cell = (c: Tokens.TableCell, tag: 'th' | 'td', index: number) => {
          const attrs = [
            c.align ? `style="text-align:${c.align}"` : '',
            tag === 'td'
              ? `data-label="${escapeHtml(labels[index] ?? '')}"`
              : '',
          ]
            .filter(Boolean)
            .join(' ');
          return `<${tag}${attrs ? ' ' + attrs : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        };
        const head = `<tr>${header.map((c, i) => cell(c, 'th', i)).join('')}</tr>`;
        const body = rows
          .map((r) => `<tr>${r.map((c, i) => cell(c, 'td', i)).join('')}</tr>`)
          .join('');
        return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
      image({ href, title, text }: Tokens.Image) {
        // A title of "icon" marks small inline images, such as the measurement mode icons.
        const icon = title === 'icon';
        const attrs = [
          `src="${href}"`,
          `alt="${escapeHtml(text)}"`,
          icon ? 'class="img-icon" width="20" height="20"' : '',
          !icon && title ? `title="${escapeHtml(title)}"` : '',
          'loading="lazy"',
        ]
          .filter(Boolean)
          .join(' ');
        return `<img ${attrs}>`;
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

  const tokens = groupCodeTabs(marked.lexer(source));
  const html = marked.parser(tokens);
  return { html, toc };
}
