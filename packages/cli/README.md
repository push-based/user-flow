# @push-based/user-flow

---

[![@user-flow-logo](https://user-images.githubusercontent.com/10064416/156827417-1e9979a2-83ea-4117-baec-9b7ce81ab811.png)](https://github.com/push-based/user-flow/blob/main/packages/cli/README.md)


### This is a small library to organize and run lighthouse user flow scripts in an organized and scalable way with CI automation in place 🛸

---

**Benefits**

- ☑ Zero setup cost
- ☑ No boiler plate
- ☑ Write tests directly in TypeScript (we compile them live)
- ☑ Use best practices out of the box
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

1. Setup `.user-flowrc.json`;

`npx @push-based/user-flow init`

This results in the following file:

**./.user-flowrc.json**
```json
{
  // Path to user flows from root directory
  "ufPath": "./",
  // Output path for the reports from root directory
  "outPath": "./",
  // URL to analyze
  "targetUrl": "https://localhost"
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

`npx @push-based/user-flow --targetUrl=https://localhost:4200`

Optionally you can pass params to overwrite the values form `.user-flowrc.ts`

`npx @push-based/user-flow --ufPath=./user-flows --outPath=./user-flows-reports --targetUrl=https://localhost:4200` to build the library.

# [Advanced Architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md)

Organizing testing logic in an art. If you don't own that knowledge, the amount of low-level code get's a night mare to maintain in bigger projects...

**This is the reason we introduced UFO's!**
**Organize clutter code 👽 in developer friendly shells 🛸**

**See [ufo-architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md) for more details.**

# CLI

## Global Options

|  Option                     |  Type     | Default     |  Description                                                                                               |  
| --------------------------- | --------- | ----------- |----------------------------------------------------------------------------------------------------------- |  
| **`--help`**                | `boolean` | `undefined` | Show help                                                                                                  |  
| **`--version`**             | `boolean` | `undefined` | Show version number                                                                                        |  
| **`--cfgPath`**, **`-p`**   | `boolean` | `undefined` | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--verbose`**, **`-v`**   | `boolean` | `undefined` | Run with verbose logging                                                                                   |  
| **`--interactive`**         | `boolean` | `undefined` | When false questions are skipped with the values from the suggestions. This is useful for CI integrations. |  

## Commands 

### `init` command

Run command over:  
`@npx @push-based/user-flow init`  

Description:  
This command helps you to setup a `.user-flowrc.json` and fill it over CLI prompts.

### `capture` command

Run command over:  
`@npx @push-based/user-flow capture <options>`  

Description:  
This command executes a set of user-flow definitions against the target URL and saves the output.

|  Option                     |  Type     | Default     |  Description                                                                                               |  
| --------------------------- | --------- | ----------- |----------------------------------------------------------------------------------------------------------- |  
| **`--targetUrl`**, **`-t`** | `boolean` | `undefined` | URL to analyze                                                                                             |  
| **`--ufPath`**, **`-f`**    | `boolean` | `undefined` | folder containing user-flow files to run. (`*.uf.ts` or`*.uf.js`)                                          |  
| **`--outPath`**, **`-o`**   | `boolean` | `undefined` | output folder for the user-flow reports                                                                    |  
| **`--open`**, **`-e`**      | `boolean` | `undefined` | Opens browser automatically after the user-flow is captured                                                |  
