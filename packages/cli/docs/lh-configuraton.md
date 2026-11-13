# Lighthouse configuration

## General

User flow wraps [lighthouse](https://www.npmjs.com/package/lighthouse) and executes actions against chromium while measuring.
Lighthouse itself can get configured over a json object where any detail regards settings, audits and postprocessing can be placed.

The official docs on [how to configure lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md) are located in their repository's docs.
The [default lighthouse config](https://github.com/GoogleChrome/lighthouse/blob/946075bb7f0858861067d161a414bdccc0a19007/core/config/constants.js#L92) can be found in their repository's source.
 
Unless configured otherwise, the CLI starts lighthouse with its default configuration.

### Where configuration can live

Each flow gets its Lighthouse config from at most two sources: one **global** config shared by every flow, and the **flow** config in the flow file.

| Level  | Place                                       | Applies to                |
| ------ | ------------------------------------------- | ------------------------- |
| Global | `--configPath` on the command line          | Every flow in this run    |
| Global | `collect.configPath` in `.user-flowrc.json` | Every flow in the project |
| Global | `collect.config` in `.user-flowrc.json`     | Every flow in the project |
| Flow   | `flowOptions.config` in a `*.uf.mts` file   | That one flow             |

There is only ever one global config. `--configPath` on the command line replaces `collect.configPath` from the rc file. A path and an inline config can't be mixed, though: if the rc file has `collect.config` and you pass `--configPath`, the run stops with `configPath and config can't be used together`.

### How the configs are combined

For each flow, user-flow builds a single config and passes it to Lighthouse's `startFlow`. It gets there in four steps.

1. The flow config is laid over the global config. `settings` are merged key by key, and the flow wins when both set the same key. Every other top-level key, such as `audits`, `categories` or `artifacts`, is taken whole from the flow config if it has one, and from the global config otherwise. They are not combined, so flow `audits` replace the global `audits`.
2. If the result has no `extends`, user-flow adds `extends: 'lighthouse:default'`. Without it, a config that only sets `settings` would run no audits at all. Configs that define their own artifacts are the exception, see [Complete configs](#complete-configs).
3. Lighthouse resolves `extends` by merging the config into its default config. Artifacts are matched by `id`, audits and category `auditRefs` are added to the default ones, and `settings` override the default settings. An array inside `settings`, such as `onlyCategories`, replaces the default array instead of extending it. A config without `extends` is used exactly as written.
4. `flowOptions.flags` and the options passed to a step override `settings` for that step. Step options, as in `flow.navigate(url, { onlyCategories: ['performance'] })`, win over `flowOptions.flags`.

For a single setting, the order from lowest to highest priority is:

Lighthouse default → global config → flow config → `flowOptions.flags` → step options

#### Example

**.user-flowrc.json (collect.config)**
```json
{
  "settings": {
    "formFactor": "mobile",
    "onlyCategories": ["performance", "accessibility"]
  },
  "audits": ["my-global-audit"]
}
```

**user-flows/checkout.uf.mts (flowOptions.config)**
```typescript
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

### Complete configs

Some configs bring every artifact, audit and category they need and are written to run without the default config. Configs exported by Lighthouse plugin packages are a common case. If user-flow added `extends` to one of them, Lighthouse would merge its artifacts with the default ones, and that fails when both describe the same artifact differently.

user-flow therefore treats a flow config with `artifacts` and no `extends` as complete. For a complete config it:

- does not add `extends`, so Lighthouse runs the config as written, the same as `startFlow(page, { config })`;
- takes only `settings` from the global config, and ignores a global `extends`, `audits` or `categories` for this flow.

**user-flows/soft-navigation.uf.mts**
```typescript
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

### Where to put the config

Custom configurations can be provided over a external `.json` file using `--configPath <path/to/config.json>`.  
This option is also available in the `.user-flowrc.json` file under the `collect.configPath` property.

It is also possible to provide the configurations directly as `JSON` object in the `.user-flowrc.json` file under the `collect.config` property.

The `configPath` property is handy when all parameters should exist as CLI params only.

### Configuration option short-hands

As the configuration object can get quite big lighthouse provides a couple of short-hands to directly configure specific parts over a flag.  
The user-flow CLI ports perts of this behavior.

Those options can be used similar to the general configurations globally as well as locally.

## Options

**RC properties**  

Used in the rc.json file directly.  

|  Option                         |  Type     | Default                | Description                                                                                              |  
| ------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`collect.configPath`**        | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  
| **`collect.config`**            | `object`  | n/a                    | The lighthouse configuration as `JSON` object                                                            |

**CLI params**  

Used in the console as `user-flow collect <param>`.  

|  Option                         |  Type     | Default                | Description                                                                                              |  
| ------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-c`**, **`--configPath`**    | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  

### Configuration over RC properties 

#### collect.configPath property

|  Property                       |  Type     | Default                |   
| ------------------------------- | --------- | ---------------------- |  
| **`collect.configPath`**        | `string`  | n/a                    |   

**Usage:**   
```json
{
  "collect": {
    "configPath": "./config.json",
    # ...  
  },
  # ...
}
```  

**Description:**  
If a lighthouse configuration exists as separate file you can use the `collect.configPath` to use it.
The path is, same as all other paths, relative to the execution context of the CLI.  

If possible configuration file looks like this:  

**./config.json**  
```json
{
 "extends": "lighthouse:default",
   "settings": {
     "onlyAudits": [
       "first-meaningful-paint",
       "speed-index",
       "interactive"
     ]
   }
}
```

The usage of it in the rc file looks like this:  

**./.user-flowrc.json**  
```json
{
  "collect": {
    "configPath": "./config.json",
    # ...  
  },
  # ...
}
```

#### collect.config property

|  Property                       |  Type     | Default                |   
| ------------------------------- | --------- | ---------------------- |  
| **`collect.config`**            | `object`  | n/a                    |   

**Usage:**   
```json
{
  "collect": {
    "config": {
      "extends": "lighthouse:default",
      "settings": {
        "onlyAudits": [
          "first-meaningful-paint",
          "speed-index",
          "interactive"
        ]
      }
    },
    # ...  
  },
  # ...
}
```  

**Description:**  

You can directly use a lighthouse config object in the rc file by placing it under the `collect.config` property.

**./.user-flowrc.json**  
```json
{
  "collect": {
    "config": {
        "extends": "lighthouse:default",
        "settings": {
          "onlyAudits": [
            "first-meaningful-paint",
            "speed-index",
            "interactive"
          ]
        }
    },
    # ...  
  },
  # ...
}
```

### Lighthouse configuration over the CLI params 

#### configPath  

See [CLI collect command - configPath](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/command-collect.md#configpath)  

---

made with ❤ by [push-based.io](https://www.push-based.io)
