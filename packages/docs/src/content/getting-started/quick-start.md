This walkthrough takes you from an installed CLI to an opened Lighthouse report. It uses the public [coffee cart demo](https://coffee-cart.netlify.app/) as the target so you can follow along without an application of your own.

## 1. Create the configuration

Run the `init` command and accept the default answer for every question:

```terminal
$ npx user-flow init
? What is the URL to run the user flows for? › https://coffee-cart.netlify.app/
? Folder of the user flows? › ./user-flows
? What is the format of user-flow reports? (use ⬇/⬆ to navigate, and SPACE key to select) › HTML
? What is the directory to store results in? › ./measures
? Setup user flow › true
setup user-flow for basic navigation in ./user-flows successfully
user-flow CLI is set up now! 🎉
To execute a user flow run `npx user-flow` or `npx user-flow collect`
```

The prompts write a `.user-flowrc.json` to the current folder:

```json title=".user-flowrc.json"
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./user-flows"
  },
  "persist": {
    "outPath": "./measures",
    "format": ["html"]
  }
}
```

- `collect.url` is the page the browser opens first.
- `collect.ufPath` is the folder (or a single file) with your flows.
- `persist.outPath` is where reports are written.
- `persist.format` lists the report formats to produce.

> [!TIP]
> Keep user flows in a subfolder of a larger project by pointing `init` at a different rc file:
> `npx user-flow init --rcPath ./path/to/project/.user-flowrc.json`

## 2. Look at the generated flow

When you confirm the "generate a flow" prompt, `init` creates `user-flows/basic-navigation.uf.mts`. It is the smallest useful flow: open the URL and measure the page load.

```typescript title="user-flows/basic-navigation.uf.mts"
import { UserFlowInteractionsFn, UserFlowContext, UserFlowProvider } from '@push-based/user-flow';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  // Navigate to URL
  await flow.navigate(url, {
    name: `Navigate to ${url}`,
  });
};

export default {
  flowOptions: { name: 'Order Coffee' },
  interactions,
} satisfies UserFlowProvider;
```

A flow file exports a `UserFlowProvider` with two parts:

- `flowOptions` names the flow. The name becomes the report title.
- `interactions` receives a context with the Puppeteer `page` and `browser`, the Lighthouse `flow` and the resolved `collectOptions`. Every `flow.*` call adds a step to the report.

## 3. Run it

`collect` is the default command, so both of these do the same thing:

```bash
npx user-flow collect
# or simply
npx user-flow
```

The TypeScript file is compiled on the fly. Chrome starts, Lighthouse measures the navigation, the HTML report lands in `./measures` and opens in your browser.

![The resulting Lighthouse report for the navigation step](images/getting-started-resulting-navigation-report.png)

## 4. Override settings from the command line

Any rc value can be overridden per run. This is how the same flow targets a local dev server:

```bash
npx user-flow --ufPath=./user-flows-new --outPath=./user-flows-reports --url=http://localhost:4200
```

> [!TIP]
> While you are writing interactions, add `--dryRun`. The CLI performs the interactions but skips the measurements, which turns a 53-second run into roughly 3 seconds for a simple two-step flow.

## Next steps

<!-- cards -->

- [Basic user flows](/docs/user-flows/basics): Add interactions and the other measurement modes.
- [init command](/docs/cli/init): The full option list for creating and updating the rc file.
- [collect command](/docs/cli/collect): The full option list for running flows and writing reports.
- [GitHub workflow](/docs/integrations/github-workflow): Put the flow into your pipeline and get a report on every pull request.
