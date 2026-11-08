user-flow wraps [Lighthouse](https://www.npmjs.com/package/lighthouse) and runs it with its default configuration. Lighthouse itself is configured through a JSON object that controls settings, audits and post-processing. The official [configuration guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md) describes every property; the [default config](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js) shows what you start from.

## Where configuration can live

The CLI accepts the same configuration at three levels of granularity. More specific levels win over more general ones.

| Level  | Place                                                           | Applies to                                    |
| ------ | --------------------------------------------------------------- | --------------------------------------------- |
| Global | `collect.configPath` or `collect.config` in `.user-flowrc.json` | Every flow in the project                     |
| Global | `--configPath` on the command line                              | Every flow in this run, overrides the rc file |
| Local  | `flowOptions.config` in a `*.uf.mts` file                       | That one flow only                            |

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

`flowOptions` accepts a `config` property with the same shape. It applies to that flow only and overrides the global configuration:

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
