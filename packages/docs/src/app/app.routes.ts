import { Route } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found';

export const appRoutes: Route[] = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    // Loaded on demand: the Markdown renderer and the highlighter are only
    // needed on doc pages, so the landing page ships without them.
    path: 'docs/:section/:page',
    loadChildren: () => import('./docs/docs.routes').then((m) => m.DOCS_ROUTES),
  },
  { path: 'docs', redirectTo: 'docs/getting-started/introduction' },
  { path: 'not-found', component: NotFound },
  { path: '**', component: NotFound },
];
