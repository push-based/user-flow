# @push-based/user-flow
## Runtime performance measurements done right, with Lighthouse user flows!

[![npm](https://img.shields.io/npm/v/%40push-based%2Fuser-flow.svg)](https://www.npmjs.com/package/%40push-based%2Fuser-flow)

---

### This is a library & CLI to organize and run Lighthouse user flows in an organized and scalable way 🛸 with CI automation in place

---

# What is it?

A CLI tool to measure performance continuously and also integrate it into your CI.
It provides lot's of DX features, nice commands with rich arguments and integration with the latest dev tooling. 

# Why to use it?

It will enable you to measure bootstrap as well as runtime performance with minimum effort, 
speed up your performance test development and reduced the needed code and configuration to a minimum. 

![user-flow-code-reduction](https://user-images.githubusercontent.com/10064416/197062344-4c49c73b-beed-4a7e-92f9-c4855e9f436d.PNG)

In addition, it is always up-to-date with the latest Chrome DevTools features.

**Benefits**

- ⚙ [Run it in your CI  ](https://github.com/push-based/user-flow#github-workflow-integration-of-lighthouse-user-flows-in-your-pr)  
- ▶ [Execute ChromeDevTools recorder exports](https://github.com/push-based/user-flow#working-with-devtools-recorder-exports)  
- 🏃‍♀️ Measure Runtime performance
- 🔒 [Performance budgets](https://github.com/push-based/user-flow#performance-budgets)
- 🦮 Zero setup cost
- 🤓 Excellent DX through `--dryRun` and friends 
- 🛸 [Advanced architecture with UFO's](https://github.com/push-based/user-flow#advanced-architecture)
- 🔥 Write tests directly in TypeScript (we compile them live)
- 🧠 Use best practices out of the box
- 🅾 No boilerplate


<img src="https://user-images.githubusercontent.com/10064416/156827417-1e9979a2-83ea-4117-baec-9b7ce81ab811.png" aspecrratio="885∶254" width="400px" height="auto"/>

# Install

Run 
`npm i @push-based/user-flow --save-dev` or `yarn add @push-based/user-flow --dev` 
to install the library.  
  
After that you can run:  
`user-flow --help`or `user-flow --help`  

## Run without install
You can also use `npx` to run it in e.g. the CI setup:
`npx @push-based/user-flow --help`
 
# Quick Start

As the CLI needs a npm project to run in we explain 2 common things, using the package in an existing project and using it in a fresh project.
Both ways require a node and npm project setup to install user-flow and folders to store the reports and test files.

0. have node [v14.X.X](https://nodejs.org/en/download/) installed  
run `node -v` and `npm -v` to check it.  

To start from scratch read [setup an empty project](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/general-cli-features.md)

## Set up and run user flows in an existing npm project 

In this chapter we will learn how to install and configure user flows, as well as create a first example test and see the resulting performance report.  

0. Install:

```bash
npm i @push-based/user-flow --save-dev
```

1. Set up the `.user-flowrc.json` config file

Run 
```
npx @push-based/user-flow init
```  

or if you already installed it,

```
npx user-flow init
```  

in the console and accept the default value for every question.

![Set up user-flow in existing project gif](./docs/images/setup-in-existing-project.gif)

This results in the following file:

_./.user-flowrc.json_
```json
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./user-flows"
  },
  "persist": { "outPath": "./measures", "format": ["html"] }
}
```

2. The CLI automatically creates an example user-flow. (`./user-flows/basic-navigation.uf.ts`) 

It is a simple navigation measurement to start from.

_./basic-navigation.uf.ts_
```typescript
import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

// Your custom interactions with the page 
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  // Navigate to URL
  await flow.navigate(url, {
    stepName: `Navigate to ${url}`,
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee'},
  interactions
};

module.exports = userFlowProvider;
```

3. Run CLI
You can directly run the cli command. The typescript files will get resolved and compiled live. 

`npx user-flow collect` or just `npx user-flow` as collect is the default.

This will execute the user flow and opens the HTML report in the browser:

<img width="960" alt="getting-started-resulting-navigation-report" src="https://user-images.githubusercontent.com/10064416/168185483-c6ca499e-a8a6-40b7-b450-448de8784454.PNG">


For more information on how to write user-flows read in the [Writing user flows for the CLI](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/writing-basic-user-flows.md) section.

Optionally you can pass params to overwrite the values form `.user-flowrc.ts` in the file directly or over the CLI:

```bash
npx user-flow --ufPath=./user-flows-new --outPath=./user-flows-reports --url=https://localhost:4200
```
  
> **🤓 DX Tip:**  
> For a faster development process you can use the `--dryRun` option to skip measurement and perform the interactions only  
> This is a multitude faster e.g. **3s** vs **53s** for a simple 2 step flow with navigation  

# CLI
You can read more about tricks and DX the [general CLI features](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/general-cli-features.md) in our docs. 

## Global Options

| Option                       |  Type     | Default                     |  Description                                                                                               |  
|------------------------------| --------- | --------------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--help`**, **`-h`**       | `boolean` | `undefined`                 | Show help                                                                                                  |  
| **`--version`**              | `boolean` | `undefined`                 | Show version number of cli                                                                                 |  
| **`--rcPath`**, **`-p`**     | `string`  | `./user-flowrc.json`        | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--verbose`**, **`-v`**    | `boolean` | `undefined`                 | Run with verbose logging                                                                                   |  
| **`--interactive`** **`-i`** | `boolean` | `true` (`false` in CI mode) | When false questions are skipped with the values from the suggestions. This is useful for CI integrations. |  

## Commands 

### `*` command

Run the default command over:  
`@npx @push-based/user-flow [options]`  

Description:  
The default command forwards all options to the [`collect`](https://github.com/push-based/user-flow#collect-command) command.

### [`init` command](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/command-init.md)

Run command over:  
`@npx @push-based/user-flow init [options]`  

Description:  
This command helps you to set up a `.user-flowrc.json` and asks for input over CLI prompts.

|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-h`**, **`--generateFlow`**     | `boolean` | n/a                    | Generate basic user-flow file under `ufPath`                                                             |    
| **`-g`**, **`--generateGhWorkflow`** | `boolean` | n/a                    | Generate `user-flow.yml` file under `.github/workflows`                                                             |    

<img width="960" alt="getting-started-resulting-navigation-report" src="https://user-images.githubusercontent.com/10064416/168185483-c6ca499e-a8a6-40b7-b450-448de8784454.PNG">

As a result we get a `.user-flowrc.json` and an example flow if answered with yes.

> **🤓 DX Tip:** 
> Set up user flows in a sub directory:  
> `npx @push-based/user-flow init --rcPath ./path/to/project/.user-flowrc.json`

### [`collect` command](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/command-collect.md)

Run command over:  
`@npx @push-based/user-flow collect [options]`  or `@npx @push-based/user-flow [options]` as it is the default command.  

Description:  
This command executes a set of user-flow definitions against the target URL and saves the output.

|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-t`**, **`--url`**              | `string`  | n/a                    | URL to analyze                                                                                           |  
| **`-u`**, **`--ufPath`**           | `string`  | `./user-flows`         | Path to user-flow file or folder containg user-flow files to run. (`*.uf.ts` or`*.uf.js`)                |  
| **`-c`**, **`--config-path`**      | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  
| **`-b`**, **`--budget-path`**      | `string`  | n/a                    | Path to the lighthouse `budget.json` file                                                                |  
| **`-s`**, **`--serveCommand`**     | `string`  | n/a                    | Runs a npm script to serve the target app. This has to be used in combination with `--awaitServeStdout`  |  
| **`-a`**, **`--awaitServeStdout`** | `string`  | `.user-flowrc` setting | Waits for stdout from the serve command to start collecting user-flows                                   |  
| **`-f`**, **`--format`**           | `string`  | `html`, `json` setting | Format of the creates reports ( `html`, `json`, `md`, `stdout`)                                                                           |  
| **`-o`**, **`--outPath`**          | `string`  | `./measures`           | output folder for the user-flow reports                                                                  |  
| **`-e`**, **`--openReport`**       | `boolean` | `true`                 | Opens browser automatically after the user-flow is captured                                              |  
| **`-d`**, **`--dryRun`**           | `boolean` | `false`                | When true the user-flow test will get executed without measures (for fast development)                   |  

> **💡 Pro Tip:**
> CLI arguments that accept multiple values can be set by using the param multiple times in a row:
>
> As an example we could apply two different formats as output for the `collect` command:
> `npx user-flow collect --format=json --format=md`

## Configuration

The CLI supports the official [user-flow/lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md). 

Details on how to work with configurations can be found in the [configuratin section](./packages/cli/docs/lh-configuraton.md).    


# Writing user flows for the CLI

You can think of user flows as front end e2e tests which measures performance related information during the test.

## [Basic user flows](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/writing-basic-user-flows.md)

Write basic user flows leveraging all 3 measurement modes of lighthouse.


**User flow measurement modes**

| Icon  | Mode       | Measure            | Performance  | Accessibility | Best Practices | SEO       | PWA       |
| ----- | ---------- | ------------------ | ------------ | ------------- | -------------- | --------- | --------- |
| ![user-flow_navigation-icon](https://user-images.githubusercontent.com/10064416/165129388-2f62bb82-4856-456c-a513-ae5607cfe4ea.PNG) | Navigation | Page load          | 100% / 30    | 100% / 30     | 100% / 30      | 100% / 30 | ✔ / 7 |
| ![user-flow_timespan-icon](https://user-images.githubusercontent.com/10064416/165129495-330ddca5-fd8b-4ecc-a839-477302f7f229.PNG) | Timespan   | User Interaction   |  10  / 10    |       ❌      |   7  /  7      |     ❌    |     ❌    |
| ![user-flow_snapshot-icon](https://user-images.githubusercontent.com/10064416/165129696-68302177-6c7d-4aa2-ba3c-564939cde228.PNG) | Snapshot   | Current page state |   4  /  4    |  16  / 16     |   5  /  5      |   9  /  9 |     ❌    |

When you execute and open the user-flow report you will see the measurement modes also visualized there.

[![user-flow--example](https://user-images.githubusercontent.com/10064416/166849157-f1d799f5-1f05-481b-8234-ec6645827791.PNG)](https://github.com/push-based/user-flow/blob/main/packages/cli/README.md)

## [Advanced architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md)

Organizing testing logic is an art. If you don't own that knowledge, the amount of low-level code get's a night mare to maintain in bigger projects...

**This is the reason we introduced UFO's!**
**Organize clutter code 👽 in developer friendly shells 🛸**

![user-flow--advanced-architecture](https://user-images.githubusercontent.com/10064416/208248762-504897a3-3ef5-42dc-8060-70cda0ad682f.PNG)

See [ufo-architecture](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/ufo-architecture.md) for more details.

## [Working with DevTools Recorder exports](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/recorder-exports.md)

Chrome DevTools provides a feature to help with record and export user interactions. 
This can replace any handwritten code and organizes interactions in a JSON structure.
![user-flow--replay-scripts](https://user-images.githubusercontent.com/10064416/208249076-744bc6be-aa03-42f7-b209-c815c2f90ca2.PNG)

This library provides a way to replay and enrich those interactions over the CLI.

See [recorder-exports](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/recorder-exports.md) for more details.

## [Performance Budgets](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/performance-budgets.md)

Implementing performance improvements without breaking something is hard.  
**Even harder is it, to keep it that way. 🔒**

![img-budgets-mode-support](https://user-images.githubusercontent.com/10064416/164581870-3534f8b0-b7c1-4252-9f44-f07febaa7359.PNG)

See [performance-budgets](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/performance-budgets.md) for more details.

## [GitHub workflow integration of lighthouse user flows in your PR](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/github-workflow-integration.md)

With just a few steps you can run your user flows in as a GitHub workflow to enrich your PR's with report summaries as comments.

Automatically create a workflow with:  
`npx user-flow init --generateGhWorkflow`  

![user-flow-gh-action-cover](https://user-images.githubusercontent.com/10064416/216605948-b8fffdda-3459-48c9-975a-75ec95544d30.png)
 
See [github-workflow-integration](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/github-workflow-integration.md) for more details.

## Examples

- [angular-movies](https://github.com/tastejs/angular-movies/tree/main/projects/movies-user-flows/src)

## Resources

- [lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/)
- [Understanding the lighthouse result](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md)
- [lighthouse user flows](https://web.dev/lighthouse-user-flows/)
- [lighthouse user flow recorder](https://developer.chrome.com/docs/devtools/recorder/)
- [lighthouse user flow recorder features](https://m.youtube.com/watch?v=PupwBARjaYU&feature=youtu.be)

---

made with ❤ by [push-based.io](https://www.push-based.io)
