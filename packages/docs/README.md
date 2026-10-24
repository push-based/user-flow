# user-flow docs

The documentation site for `@push-based/user-flow`, built with Angular and prerendered to static HTML for GitHub Pages.

## Develop

```bash
npx nx serve docs
```

Opens a dev server with hot reload on http://localhost:4300.

## Build

```bash
npx nx build docs
```

Produces a fully prerendered site in `dist/packages/docs/browser` with `/user-flow/` as base href, ready for GitHub Pages. Use `--configuration=development` for a build with `/` as base href.

## Write content

Pages are Markdown files under `src/content/<section>/<page>.md`. Register a page in `src/app/docs/nav.ts` to give it a route, a title and a description; the sidebar, the start page, prerendering and the previous/next links all derive from that list.

Markdown extras:

- Fenced code blocks are highlighted. Add a file name with ` ```json title=".user-flowrc.json" `.
- `> [!TIP]`, `> [!NOTE]`, `> [!IMPORTANT]` and `> [!WARNING]` block quotes render as callouts.
- Links that start with `/docs/` are in-app links and are rewritten for the base href.
- Images live in `public/images` and are referenced as `images/<file>`.

## Deploy

`.github/workflows/docs.yml` builds and deploys the site on every push to `main` that touches the docs. The repository's Pages source must be set to "GitHub Actions".
