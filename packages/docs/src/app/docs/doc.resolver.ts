import { ResolveFn, Router } from '@angular/router';
import { DOCUMENT, inject } from '@angular/core';
import { ALL_DOC_PAGES, FlatDocPage, findDocPage } from './nav';
import { renderMarkdown, TocEntry } from './markdown';

export interface ResolvedDoc {
  page: FlatDocPage;
  html: string;
  toc: TocEntry[];
  /** Estimated reading time, rounded up to whole minutes. */
  readingMinutes: number;
  previous?: FlatDocPage;
  next?: FlatDocPage;
}

export const docResolver: ResolveFn<ResolvedDoc> = async (route) => {
  const page = findDocPage(route.params['section'], route.params['page']);
  if (!page) {
    const router = inject(Router);
    router.navigate(['/not-found'], { skipLocationChange: true });
    throw new Error(`Unknown documentation page: ${route.url.join('/')}`);
  }
  const baseHref =
    inject(DOCUMENT).querySelector('base')?.getAttribute('href') ?? '/';
  const source = await page.load();
  const { html, toc } = renderMarkdown(source, { baseHref });
  const index = ALL_DOC_PAGES.indexOf(page);
  return {
    page,
    html,
    toc,
    readingMinutes: readingMinutes(source),
    previous: ALL_DOC_PAGES[index - 1],
    next: ALL_DOC_PAGES[index + 1],
  };
};

/** Prose reads at about 220 words a minute; code is skimmed, at about a third of that per line. */
export function readingMinutes(markdown: string): number {
  let codeLines = 0;
  const prose = markdown.replace(/```[\s\S]*?```/g, (block) => {
    codeLines += block.split('\n').length - 2;
    return ' ';
  });
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220 + codeLines / 60));
}
