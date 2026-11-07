import { DOCUMENT, inject, Injectable } from '@angular/core';
import { ALL_DOC_PAGES } from '../docs/nav';

/** One searchable chunk: a page's intro, or one of its h2/h3 sections. */
export interface SearchEntry {
  path: string;
  section: string;
  page: string;
  heading: string | null;
  fragment: string | null;
  text: string;
}

export interface SnippetPart {
  text: string;
  hit: boolean;
}

export interface SearchResult {
  entry: SearchEntry;
  snippet: SnippetPart[];
}

/**
 * Builds a search index in the browser the first time search opens: every
 * page's Markdown is loaded, rendered and split at its h2 and h3 headings, so
 * a result can link straight to the section it matched. The pages are small,
 * so this takes a moment once and keeps the site free of a build step.
 */
@Injectable({ providedIn: 'root' })
export class SearchIndex {
  private readonly document = inject(DOCUMENT);
  private entries?: Promise<SearchEntry[]>;

  load(): Promise<SearchEntry[]> {
    this.entries ??= this.build();
    return this.entries;
  }

  private async build(): Promise<SearchEntry[]> {
    const { renderMarkdown } = await import('../docs/markdown');
    const baseHref =
      this.document.querySelector('base')?.getAttribute('href') ?? '/';
    const parser = new DOMParser();
    const pages = await Promise.all(
      ALL_DOC_PAGES.map(async (page) => {
        const { html } = renderMarkdown(await page.load(), { baseHref });
        const body = parser.parseFromString(html, 'text/html').body;
        // Code block headers (language label, copy button) and heading anchors are chrome, not content.
        body
          .querySelectorAll('.code-title, .heading-anchor')
          .forEach((el) => el.remove());
        // Keep words in neighbouring cells and list items apart in snippets.
        body
          .querySelectorAll('td, th, li, dt, dd')
          .forEach((el) => el.append(' '));
        const entries: SearchEntry[] = [];
        let current: SearchEntry = {
          path: page.path,
          section: page.section.title,
          page: page.title,
          heading: null,
          fragment: null,
          text: page.description,
        };
        for (const node of Array.from(body.children)) {
          if (node.tagName === 'H2' || node.tagName === 'H3') {
            entries.push(current);
            // A fresh object per section: `current` is already in `entries`.
            current = {
              path: current.path,
              section: current.section,
              page: current.page,
              heading: node.textContent?.trim() ?? '',
              fragment: node.id,
              text: '',
            };
          } else {
            current.text += ' ' + (node.textContent ?? '');
          }
        }
        entries.push(current);
        for (const entry of entries) {
          entry.text = entry.text.replace(/\s+/g, ' ').trim();
        }
        return entries;
      }),
    );
    return pages.flat();
  }
}

/** Ranks entries that contain every word of the query; headings and titles weigh more than body text. */
export function searchEntries(
  entries: SearchEntry[],
  query: string,
  limit = 10,
): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    return [];
  }
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const heading = (entry.heading ?? '').toLowerCase();
    const page = entry.page.toLowerCase();
    const text = entry.text.toLowerCase();
    let score = 0;
    let all = true;
    for (const term of terms) {
      const inHeading = heading.includes(term);
      const inPage = page.includes(term);
      const inText = text.includes(term);
      if (!inHeading && !inPage && !inText) {
        all = false;
        break;
      }
      if (inHeading) score += heading.startsWith(term) ? 14 : 10;
      if (inPage) score += entry.heading ? 4 : 12;
      if (inText) score += Math.min(5, text.split(term).length - 1);
    }
    if (all) {
      scored.push({ entry, score });
    }
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => ({ entry, snippet: snippet(entry.text, terms) }));
}

/** A short excerpt around the first match, split into plain and highlighted parts. */
function snippet(text: string, terms: string[], radius = 70): SnippetPart[] {
  const lower = text.toLowerCase();
  const first = Math.min(
    ...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0),
  );
  const at = Number.isFinite(first) ? first : 0;
  const start = Math.max(0, at - radius / 2);
  const end = Math.min(text.length, at + radius * 1.6);
  const excerpt =
    (start > 0 ? '…' : '') +
    text.slice(start, end).trim() +
    (end < text.length ? '…' : '');
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  );
  return excerpt
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      hit: terms.includes(part.toLowerCase()),
    }));
}
