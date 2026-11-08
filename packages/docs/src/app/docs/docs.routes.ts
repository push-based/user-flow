import { Route } from '@angular/router';
import { DocPage } from './doc-page';
import { docResolver } from './doc.resolver';

/** The doc page route, loaded on demand from `app.routes.ts`. */
export const DOCS_ROUTES: Route[] = [
  { path: '', component: DocPage, resolve: { doc: docResolver } },
];
