# @push-based/user-flow
## Runtime performance measurements done right, with lighthouse user flows!

[![npm](https://img.shields.io/npm/v/%40push-based%2Fuser-flow.svg)](https://www.npmjs.com/package/%40push-based%2Fuser-flow)

---

[![@user-flow-logo](https://user-images.githubusercontent.com/10064416/156827417-1e9979a2-83ea-4117-baec-9b7ce81ab811.png)](https://github.com/push-based/user-flow/blob/main/packages/cli/README.md)

### This is a library & CLI to organize and run lighthouse user flows in an organized and scalable way 🛸 with CI automation in place

---

**Benefits**

- ⚙ Run it in your CI  
- 🏃‍♀️ Measure Runtime performance
- 🔒 Performance budgets
- 🦮 Zero setup cost
- 🤓 Excellent DX through `--dryRun` and friends 
- 🛸 Advanced architecture with UFO's
- 🔥 Write tests directly in TypeScript (we compile them live)
- 🧠 Use best practices out of the box
- 🅾 No boiler plate

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

// Your custom interactions with the page 
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

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
  flowOptions: {name: 'Category to Detail Navigation - Cold'},
  interactions
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

# CLI

## Prompts and interaction

We provide general interaction through the keyboard or `stdin` directly for testing and other crazy hacks.

### Multiselect choices

 These key combinations can be used on _multiple_ choice prompts.For more details see [enquirer - multiselect](https://github.com/enquirer/enquirer/blob/master/docs/prompts/multiselect.md)

 | **command**       | **description**                                                                                                      |
 | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
 | <kbd>space</kbd>  | Toggle the currently selected choice when `options.multiple` is true.                                                |
 | <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
 | <kbd>a</kbd>      | Toggle all choices to be enabled or disabled.                                                                        |
 | <kbd>i</kbd>      | Invert the current selection of choices.                                                                             |
 | <kbd>g</kbd>      | Toggle the current choice group.                                                                                     |
 


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
The default command forwards all options to the [`collect`](https://github.com/push-based/user-flow/edit/main/packages/cli/README.md#collect-command).

### `init` command

Run command over:  
`@npx @push-based/user-flow init [options]`  

Description:  
This command helps you to setup a `.user-flowrc.json` and fill it over CLI prompts.

> **🤓 DX Tip:** 
> Setup user flows in a sub directory:  
> `npx @push-based/user-flow init --rcPath ./path/to/project/.user-flowrc.json`

### `collect` command

Run command over:  
`@npx @push-based/user-flow collect [options]`  or `@npx @push-based/user-flow [options]` as it is the default command.  

Description:  
This command executes a set of user-flow definitions against the target URL and saves the output.

|  Option                            |  Type     | Default                |  Description                                                                                               |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--url`**, **`-t`**              | `string`  | n/a                    | URL to analyze                                                                                             |  
| **`--ufPath`**, **`-u`**           | `string`  | `./user-flows`         | folder containing user-flow files to run. (`*.uf.ts` or`*.uf.js`)                                          |  
| **`--outPath`**, **`-o`**          | `string`  | `./measures`           | output folder for the user-flow reports                                                                    |  
| **`--serveCommand`**, **`-s`**     | `string`  | n/a                    | Runs a npm script to serve the target app. This has to be used in combination with `--awaitServeStdout`    |  
| **`--awaitServeStdout`**, **`-a`** | `string`  | `.user-flowrc` setting | Waits for stdout from the serve command to start collecting user-flows                                     |  
| **`--format`**, **`-f`**           | `string`  | `html`, `json` setting | Format of the creates reports                                                                              |  
| **`--open`**, **`-e`**             | `boolean` | `true`                 | Opens browser automatically after the user-flow is captured                                                |  
| **`--budget-path`**, **`-b`**      | `string`  | `./budget.json`        | Path to the lighthouse `budget.json` file                                                                  |  

## Report Formats and Viewer

You can either export the report as `HTML` or `JSON` format. The html file can be opened in any browser.

Use the `.user-flowrc.json` propertiy `persist.format` and give an array as value. e.g. `['html']` or `['html', 'json']`.

You can also use use the CLI option `--format` to choose a format.  

- single format: `@push-based/user-flow collect --format html`  
- multiple formats: `@push-based/user-flow collect --format html --format json`  

> **🤓 DX Tip:**  
> For a faster development process you can use the `--open` or `-e` option to automatically open the report in the browser.
> The CLI will serve either the HTML report or opens the lighthouse report viewer if only a JSON format is available and displays it there.
> e.g. `@push-based/user-flow collect --open`   

The json file can be drag & dropped into the [lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/). 
This format is very good for programmatic processing and foundation for most of the features of this lib. 

![Lighthouse Viewer - File drop area](https://user-images.githubusercontent.com/10064416/162604365-31b4a9c9-c7cb-4654-a605-cecaeb2fb54f.PNG)

## Configuration

The CLI supports the official [user-flow/lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md). 


# Writing user flows

You can think of user flows as front ent e2e tests which measures performance related information during the test.

## Flow Measurement Modes

> Info:
> Lighthouse audits rely on gatherers. Every gatherer has a `gatherMode` which is one of `navigation`, `timespan`, `snapshot`. 
> This can help to get a list of audits possible per mode

## Selector suggestions

When writing tests it is a god practice to decouple your selector needed for the test from the actual code used to style your application. 
A good way to do this is using the data attribute and attribute selectors e.g. `[data-test]="clp-img"`.

The following selectors are suggested to align with the official [user flow recorder feature](https://developer.chrome.com/blog/new-in-devtools-100/#selector):
- data-testid
- data-test
- data-qa
- data-cy
- data-test-id
- data-qa-id
- data-testing

## [Advanced Architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md)

Organizing testing logic is an art. If you don't own that knowledge, the amount of low-level code get's a night mare to maintain in bigger projects...

**This is the reason we introduced UFO's!**
**Organize clutter code 👽 in developer friendly shells 🛸**

See [ufo-architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md) for more details.

## [Performance Budgets](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/performance-budgets.md)

Implementing performance improvements without breaking something is hard.  
**Even harder is it, to keep it that way. 🔒**

![img-budgets-mode-support](https://user-images.githubusercontent.com/10064416/164581870-3534f8b0-b7c1-4252-9f44-f07febaa7359.PNG)

See [performance-budgets](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/performance-budgets.md) for more details.


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

## Examples

- [angular-movies](https://github.com/tastejs/angular-movies/tree/main/projects/movies-user-flows/src)

## Resources

-  [lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/)
-  [Understanding the lighthouse result](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md)

made with ❤ by [push-based.io](https://www.push-based.io)
