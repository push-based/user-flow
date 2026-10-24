import { Route } from '@angular/router';
import { Home } from './home/home';
import { DocPage } from './docs/doc-page';
import { NotFound } from './not-found';
import { docResolver } from './docs/doc.resolver';

export const appRoutes: Route[] = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'docs/:section/:page',
    component: DocPage,
    resolve: { doc: docResolver },
  },
  { path: 'docs', redirectTo: 'docs/getting-started/introduction' },
  { path: 'not-found', component: NotFound },
  { path: '**', component: NotFound },
];
