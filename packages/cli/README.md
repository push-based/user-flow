# @push-based/user-flow
#### Lighthouse user flows done right!
---

[![@user-flow-logo](https://user-images.githubusercontent.com/10064416/156827417-1e9979a2-83ea-4117-baec-9b7ce81ab811.png)](https://github.com/push-based/user-flow/blob/main/packages/cli/README.md)

### This is a library & CLI to organize and run lighthouse user flows in an organized and scalable way 🛸 with CI automation in place

---

**Benefits**

- ☑ Zero setup cost
- ☑ No boiler plate
- ☑ Write tests directly in TypeScript (we compile them live)
- ☑ Use best practices out of the box
- ☑ Excellent DX through `--dryRun` options 
- ☑ Advanced architecture with UFO's 🛸
- ☑ Run it in your CI  

![user-flow--example](https://user-images.githubusercontent.com/10064416/156825271-a6257002-714c-4016-a300-738cbcdb366f.png)


# Install

Run 
`npm i @push-based/user-flow --save-dev`  or `yarn i @push-based/user-flow --dev` 
to install the library.  
  
After that you can run:  
`user-flow --help`or `user-flow --help`  

## Run without install
You can also use `npx` to run it in e.g. the CI setup:
`npx @push-based/user-flow --help`

# Quick Start

0. For basic information have a look at the following links:
- [lighthouse user flows](https://web.dev/lighthouse-user-flows/)
- [lighthouse user flow recorder](https://developer.chrome.com/docs/devtools/recorder/)


1. Setup the `.user-flowrc.json` config file

`npx @push-based/user-flow init`

This results in the following file:

**./.user-flowrc.json**
```json
{
    "collect": {
        // URL to analyze
        "url": "https://localhost",
        // Path to user flows from root directory
        "ufPath": "./"
    },
    "persist": {
        // Output path for the reports from root directory
        "outPath": "./"
    }
}
```

2. Create a `my-user-flow.uf.ts` file.

**./my-user-flow.uf.ts**
```typescript
import {
  LaunchOptions,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

// Optional overright lounch settings of puppeteer
const launchOptions: LaunchOptions = {
  headless: true
};

// Setup UserFlow options
const flowOptions: UserFlowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

// Your custom interactions with the page 
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, baseUrl } = ctx;
  const url = `${baseUrl}/list`;

  const sideMenuBtnSelector = '#main-side-bar div.header-wrapper .hamburger-btn';
  const firstMovieListImg = '.ui-movie-list img.movie-img-1';
  
  await flow.startTimespan({
    stepName: 'Navigate to list page',
  });

  await page.waitForSelector(sideMenuBtnSelector);
  await page.click(sideMenuBtnSelector);
  await page.waitForSelector(firstMovieListImg);

  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
  launchOptions
};

module.exports = userFlowProvider;
```


3. Run cli
You can directly run the cli command. The typescript files will get resolved and compiled live. 

`npx @push-based/user-flow --url=https://localhost:4200`

Optionally you can pass params to overwrite the values form `.user-flowrc.ts`

`npx @push-based/user-flow --ufPath=./user-flows --outPath=./user-flows-reports --url=https://localhost:4200`  
  
  
> **🤓 DX Tip:**  
> For a faster development process you can use the `--dryRun` option to skip measurement and perform the interactions only  
> This is a multitude faster e.g. **3s** vs **53s** for a simple 2 step flow with navigation  

# [Advanced Architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md)

Organizing testing logic in an art. If you don't own that knowledge, the amount of low-level code get's a night mare to maintain in bigger projects...

**This is the reason we introduced UFO's!**
**Organize clutter code 👽 in developer friendly shells 🛸**

**See [ufo-architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md) for more details.**

# CLI

## Global Options

|  Option                     |  Type     | Default                     |  Description                                                                                               |  
| --------------------------- | --------- | --------------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--help`**                | `boolean` | `undefined`                 | Show help                                                                                                  |  
| **`--version`**             | `boolean` | `undefined`                 | Show version number of cli                                                                                 |  
| **`--cfgPath`**, **`-p`**   | `string`  | `./user-flowrc.json`        | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--verbose`**, **`-v`**   | `boolean` | `undefined`                 | Run with verbose logging                                                                                   |  
| **`--interactive`**         | `boolean` | `true` (`false` in CI mode) | When false questions are skipped with the values from the suggestions. This is useful for CI integrations. |  
| **`--dryRun`**              | `boolean` | `false`                     | When true the user-flow test will get executed without measures (for fast development)                     |  

## Commands 

### `*` command

Run the default command over:  
`@npx @push-based/user-flow [options]`  

Description:  
The default command forwards all options to the [`capture`]().

### `init` command

Run command over:  
`@npx @push-based/user-flow init [options]`  

Description:  
This command helps you to setup a `.user-flowrc.json` and fill it over CLI prompts.

### `collect` command

Run command over:  
`@npx @push-based/user-flow collect [options]`  or `@npx @push-based/user-flow [options]` as it is the default command.  

Description:  
This command executes a set of user-flow definitions against the target URL and saves the output.

|  Option                     |  Type     | Default               |  Description                                                                                               |  
| --------------------------- | --------- | --------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--url`**, **`-t`**       | `string`  | `user-flowrc` setting | URL to analyze                                                                                             |  
| **`--ufPath`**, **`-f`**    | `string`  | `user-flowrc` setting | folder containing user-flow files to run. (`*.uf.ts` or`*.uf.js`)                                          |  
| **`--outPath`**, **`-o`**   | `string`  | `user-flowrc` setting | output folder for the user-flow reports                                                                    |  
| **`--open`**, **`-e`**      | `boolean` | `true`                | Opens browser automatically after the user-flow is captured                                                |  


## Debugging

`@push-based/user-flow` ships with small helpers for logging and debugging.

### `logVerbose`

A function that logs the passed string only if the CIL options `--verbose` or `-v`is true. 

**Usage**

```typescript
import { logVerbose } from "@push-based/user-flow";
// ...

logVerbose('test');
```

`npx @push-based/user-flow` logs nothing  
`npx @push-based/user-flow --verbose` logs "test"
