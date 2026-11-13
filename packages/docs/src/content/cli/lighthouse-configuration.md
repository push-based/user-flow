user-flow wraps [Lighthouse](https://www.npmjs.com/package/lighthouse) and runs it with its default configuration. Lighthouse itself is configured through a JSON object that controls settings, audits and post-processing. The official [configuration guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md) describes every property; the [default config](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js) shows what you start from.

## Where configuration can live

Each flow gets its Lighthouse config from at most two sources: one **global** config shared by every flow, and the **flow** config in the flow file.

| Level  | Place                                       | Applies to                |
| ------ | ------------------------------------------- | ------------------------- |
| Global | `--configPath` on the command line          | Every flow in this run    |
| Global | `collect.configPath` in `.user-flowrc.json` | Every flow in the project |
| Global | `collect.config` in `.user-flowrc.json`     | Every flow in the project |
| Flow   | `flowOptions.config` in a `*.uf.mts` file   | That one flow             |

There is only ever one global config. `--configPath` on the command line replaces `collect.configPath` from the rc file. A path and an inline config can't be mixed, though: if the rc file has `collect.config` and you pass `--configPath`, the run stops with `configPath and config can't be used together`.

## How the configs are combined

For each flow, user-flow builds a single config and passes it to Lighthouse's `startFlow`. It gets there in four steps.

1. The flow config is laid over the global config. `settings` are merged key by key, and the flow wins when both set the same key. Every other top-level key, such as `audits`, `categories` or `artifacts`, is taken whole from the flow config if it has one, and from the global config otherwise. They are not combined, so flow `audits` replace the global `audits`.
2. If the result has no `extends`, user-flow adds `extends: 'lighthouse:default'`. Without it, a config that only sets `settings` would run no audits at all. Configs that define their own artifacts are the exception, see [Complete configs](#complete-configs).
3. Lighthouse resolves `extends` by merging the config into its default config. Artifacts are matched by `id`, audits and category `auditRefs` are added to the default ones, and `settings` override the default settings. An array inside `settings`, such as `onlyCategories`, replaces the default array instead of extending it. A config without `extends` is used exactly as written.
4. `flowOptions.flags` and the options passed to a step override `settings` for that step. Step options, as in `flow.navigate(url, { onlyCategories: ['performance'] })`, win over `flowOptions.flags`.

For a single setting, the order from lowest to highest priority is:

Lighthouse default → global config → flow config → `flowOptions.flags` → step options

### Example

```json title=".user-flowrc.json (collect.config)"
{
  "settings": {
    "formFactor": "mobile",
    "onlyCategories": ["performance", "accessibility"]
  },
  "audits": ["my-global-audit"]
}
```

```typescript title="user-flows/checkout.uf.mts (flowOptions.config)"
config: {
  settings: { formFactor: 'desktop' },
  audits: ['my-flow-audit'],
}
```

For the checkout flow, Lighthouse receives:

```json
{
  "extends": "lighthouse:default",
  "settings": {
    "formFactor": "desktop",
    "onlyCategories": ["performance", "accessibility"]
  },
  "audits": ["my-flow-audit"]
}
```

`formFactor` comes from the flow and `onlyCategories` from the global config. `my-global-audit` is gone because the flow sets its own `audits`. Lighthouse then runs `my-flow-audit` next to its default audits.

## Complete configs

Some configs bring every artifact, audit and category they need and are written to run without the default config. Configs exported by Lighthouse plugin packages are a common case. If user-flow added `extends` to one of them, Lighthouse would merge its artifacts with the default ones, and that fails when both describe the same artifact differently.

user-flow therefore treats a flow config with `artifacts` and no `extends` as complete. For a complete config it:

- does not add `extends`, so Lighthouse runs the config as written, the same as `startFlow(page, { config })`;
- takes only `settings` from the global config, and ignores a global `extends`, `audits` or `categories` for this flow.

```typescript title="user-flows/soft-navigation.uf.mts"
import { softNavigationConfig } from '@push-based/lighthouse-soft-navigation';

export default {
  flowOptions: { name: 'Soft navigation', config: softNavigationConfig() },
  interactions: async ({ flow, collectOptions: { url } }) => {
    await flow.navigate(url);
  },
};
```

> [!IMPORTANT]
> To add your own artifacts on top of the default config, set `extends: 'lighthouse:default'` yourself. Without it the config counts as complete, and the report only contains the audits it lists. Lighthouse treats a config without `extends` the same way.

## Option reference

Properties in the rc file:

| Property             | Type     | Description                                                         |
| -------------------- | -------- | ------------------------------------------------------------------- |
| `collect.configPath` | `string` | Path to a Lighthouse `config.json`, relative to where the CLI runs. |
| `collect.config`     | `object` | A Lighthouse configuration object inlined into the rc file.         |

Command line parameter:

| Option         | Alias | Type     | Description                         |
| -------------- | ----- | -------- | ----------------------------------- |
| `--configPath` | `-c`  | `string` | Path to a Lighthouse `config.json`. |

## Reference a config file

Keep the Lighthouse config in its own file when it is long or shared between projects:

```json title="lh-config.json"
{
  "extends": "lighthouse:default",
  "settings": {
    "onlyAudits": ["first-meaningful-paint", "speed-index", "interactive"]
  }
}
```

```json title=".user-flowrc.json"
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./user-flows",
    "configPath": "./lh-config.json"
  },
  "persist": { "outPath": "./measures", "format": ["html"] }
}
```

The same file can be passed per run:

```bash
npx user-flow collect --configPath ./lh-config.json
```

## Inline the config

Small configurations can go straight into the rc file under `collect.config`:

```json title=".user-flowrc.json"
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./user-flows",
    "config": {
      "extends": "lighthouse:default",
      "settings": {
        "onlyAudits": ["first-meaningful-paint", "speed-index", "interactive"]
      }
    }
  },
  "persist": { "outPath": "./measures", "format": ["html"] }
}
```

## Configure a single flow

`flowOptions` accepts a `config` property with the same shape. It applies to that flow only and is combined with the global configuration as described in [How the configs are combined](#how-the-configs-are-combined):

```typescript title="user-flows/checkout.uf.mts"
import { UserFlowProvider } from '@push-based/user-flow';

export default {
  flowOptions: {
    name: 'Checkout',
    config: {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance'],
      },
    },
  },
  interactions: async ({ flow, collectOptions }) => {
    await flow.navigate(collectOptions.url);
  },
} satisfies UserFlowProvider;
```

> [!NOTE]
> Lighthouse offers several command line shorthands, such as `--only-categories`, as shortcuts for common settings. The user-flow CLI ports parts of that behaviour; everything else is available through the config object shown above.
