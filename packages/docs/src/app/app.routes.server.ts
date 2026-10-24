import { RenderMode, ServerRoute } from '@angular/ssr';
import { ALL_DOC_PAGES } from './docs/nav';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'docs/:section/:page',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ALL_DOC_PAGES.map((page) => ({
        section: page.section.slug,
        page: page.slug,
      }));
    },
  },
  {
    path: 'docs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
