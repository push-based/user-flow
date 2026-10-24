import { ResolveFn, Router } from '@angular/router';
import { DOCUMENT, inject } from '@angular/core';
import { ALL_DOC_PAGES, FlatDocPage, findDocPage } from './nav';
import { renderMarkdown, TocEntry } from './markdown';

export interface ResolvedDoc {
  page: FlatDocPage;
  html: string;
  toc: TocEntry[];
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
    previous: ALL_DOC_PAGES[index - 1],
    next: ALL_DOC_PAGES[index + 1],
  };
};
