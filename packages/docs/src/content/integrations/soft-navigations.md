A soft navigation is a route change that updates the URL and the content without loading a new document, like a single page app does on a link click. Stock Lighthouse can't measure one as a navigation step: it waits for a page load that never comes and fails with `NO_FCP`.

[`@push-based/lighthouse-soft-navigation`](https://push-based.github.io/lighthouse-soft-navigation/) is a Lighthouse config that measures it as a navigation step, from the click, with FCP, LCP and a Performance score. Pass it as the config of a flow, and its soft navigation steps show up in every user-flow report next to page loads, timespans and snapshots.

This page covers the user-flow setup. How soft navigation steps are recognised and measured, and their limits, are in the [lighthouse-soft-navigation docs](https://push-based.github.io/lighthouse-soft-navigation/).

> [!IMPORTANT]
> Requires user-flow 0.21.6 or newer. Older versions add `extends: 'lighthouse:default'` to the config, so the first step fails with `TypeError: Expected object but got string`. They also run Chrome 148, where a soft navigation step loses TBT, TTI and its Performance score.

## Installation

```bash tab="npm"
npm install --save-dev @push-based/user-flow @push-based/lighthouse-soft-navigation
```

```bash tab="yarn"
yarn add --dev @push-based/user-flow @push-based/lighthouse-soft-navigation
```

```bash tab="pnpm"
pnpm add -D @push-based/user-flow @push-based/lighthouse-soft-navigation
```

The gatherers of the package extend the stock gatherers of the Lighthouse they import, so user-flow and the package have to share one copy of Lighthouse. Both depend on `lighthouse@^13.6.0`, so it is installed once. `npm ls lighthouse` shows a single version.

## Flow file

```typescript title="user-flows/checkout.uf.mts"
import { softNavigationConfig } from '@push-based/lighthouse-soft-navigation';
import type { UserFlowProvider } from '@push-based/user-flow';

const observed = { throttlingMethod: 'devtools' } as const;

export default {
  flowOptions: { name: 'Checkout', config: softNavigationConfig() },
  interactions: async ({ flow, page, collectOptions }) => {
    // A page load, measured by stock Lighthouse.
    await flow.navigate(collectOptions.url);

    // A soft navigation.
    await flow.navigate(async () => {
      await page.click('a.product-link');
    }, observed);

    // The same with startNavigation/endNavigation.
    await flow.startNavigation(observed);
    await page.click('a.checkout-link');
    await flow.endNavigation();
  },
} satisfies UserFlowProvider;
```

```sh
npx user-flow collect --url https://example.com --ufPath ./user-flows
```

- The config goes in `flowOptions.config`. `collect.config` and `collect.configPath` in `.user-flowrc.json` and `--configPath` take JSON, which can't hold the gatherer and audit classes of the package.
- A soft navigation step is a navigation step whose interaction stays in the document. See [Soft navigation steps](https://push-based.github.io/lighthouse-soft-navigation/docs/guides/steps).
- A soft navigation step passes `throttlingMethod: 'devtools'` or `'provided'`, since simulated throttling needs a document request. See [Throttling](https://push-based.github.io/lighthouse-soft-navigation/docs/guides/throttling).

## Settings

`softNavigationConfig()` returns a [complete config](/docs/cli/lighthouse-configuration#complete-configs), so user-flow runs it as written and only takes `settings` from the project. Settings for every flow go in `collect.config` of `.user-flowrc.json`, or in the file passed with `--configPath`:

```json title=".user-flowrc.json"
{
  "collect": {
    "config": {
      "settings": {
        "throttlingMethod": "devtools",
        "onlyCategories": ["performance"]
      }
    }
  }
}
```

With `throttlingMethod` set for the project, the steps don't need to pass it. Page loads then run with DevTools throttling too; [Throttling](https://push-based.github.io/lighthouse-soft-navigation/docs/guides/throttling#for-the-whole-flow) explains the trade-off.

Settings for one flow go in its config, through `softNavigationConfig`. They take precedence over the settings of the project:

```typescript
config: softNavigationConfig({
  extends: 'lighthouse:default',
  settings: { onlyCategories: ['performance'] },
}),
```

## Recordings

A Chrome DevTools recording replayed with `createUserFlowRunner` measures a soft navigation with `startNavigation` and `endNavigation` steps. The throttling method goes in `stepOptions`:

```json title="products.replay.json"
{
  "title": "Open a product",
  "steps": [
    {
      "type": "startNavigation",
      "stepOptions": { "throttlingMethod": "devtools" }
    },
    {
      "type": "click",
      "selectors": [["a.product-link"]],
      "offsetX": 5,
      "offsetY": 5
    },
    { "type": "endNavigation" }
  ]
}
```

See [DevTools Recorder exports](/docs/user-flows/recorder-exports) for replaying recordings.

## Reports

A soft navigation step is a navigation step, so the HTML, JSON and Markdown reports show it like a page load: gather mode `navigation`, with a Performance score. The `soft-navigation` audit tells the two apart. See [Reading the results](https://push-based.github.io/lighthouse-soft-navigation/docs/guides/results).

## Dry runs

`--dryRun` fails for a flow that navigates with a callback or calls `startNavigation`, which every soft navigation does. The dry run stand-in doesn't support either yet; see [#355](https://github.com/push-based/user-flow/issues/355).
