A user flow is a small TypeScript module that describes interactions with a page and marks which parts of them Lighthouse should measure. Think of it as a front-end end-to-end test that records performance data while it runs.

## Anatomy of a flow file

```typescript title="user-flows/basic-navigation.uf.mts"
import { UserFlowInteractionsFn, UserFlowContext, UserFlowProvider } from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    name: 'Navigate to coffee cart',
  });

  // Select coffee

  // Checkout order

  // Submit order
};

export default {
  flowOptions: { name: 'Order Coffee' },
  interactions,
} satisfies UserFlowProvider;
```

The default export is a `UserFlowProvider`:

| Property             | Description                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `flowOptions.name`   | The title of the report.                                                                                         |
| `flowOptions.config` | An optional Lighthouse config for this flow. See [Lighthouse configuration](/docs/cli/lighthouse-configuration). |
| `interactions`       | An async function that receives the context and drives the page.                                                 |
| `launchOptions`      | Optional Puppeteer launch options, for example `headless` or `args`.                                             |

The `UserFlowContext` passed to `interactions` contains:

| Property         | Description                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `page`           | The Puppeteer [`Page`](https://pptr.dev/api/puppeteer.page). Use it to click, type, wait for selectors and so on. |
| `browser`        | The Puppeteer `Browser`, in case you need more than one page.                                                     |
| `flow`           | The Lighthouse `UserFlow`. Every measurement step is started on it.                                               |
| `collectOptions` | The resolved collect options, most importantly `url`.                                                             |

## The three measurement modes

Lighthouse offers three kinds of steps. Each covers a different question and supports a different set of audits.

| Mode                                                                      | Measures                      | Performance | Accessibility | Best practices | SEO       | PWA   |
| ------------------------------------------------------------------------- | ----------------------------- | ----------- | ------------- | -------------- | --------- | ----- |
| ![Navigation](images/user-flow_navigation-icon.png 'icon') **Navigation** | A page load                   | 100% / 30   | 100% / 30     | 100% / 30      | 100% / 30 | ✔ / 7 |
| ![Timespan](images/user-flow_timespan-icon.png 'icon') **Timespan**       | A user interaction over time  | 10 / 10     | ❌            | 7 / 7          | ❌        | ❌    |
| ![Snapshot](images/user-flow_snapshot-icon.png 'icon') **Snapshot**       | The current state of the page | 4 / 4       | 16 / 16       | 5 / 5          | 9 / 9     | ❌    |

The numbers are the audits each mode supports per category, with the share of the category score they cover.

- **Navigation** is the classic Lighthouse run. Use it for cold and warm page loads.
- **Timespan** records everything between `startTimespan` and `endTimespan`. It is the only mode that captures runtime work such as long tasks, layout shifts and network requests triggered by an interaction.
- **Snapshot** audits the DOM as it is right now, without loading or interacting. Use it after an interaction to check accessibility, SEO and best practices of the new state.

The report shows the icon next to each step so you can tell the modes apart at a glance.

![A report with navigation, timespan and snapshot steps](https://user-images.githubusercontent.com/10064416/166849157-f1d799f5-1f05-481b-8234-ec6645827791.PNG)

## Choosing selectors

Decouple test selectors from the selectors used for styling. A data attribute that exists only for tests, such as `[data-test="lcp-img"]`, survives refactorings of markup and CSS. The following attributes are recognised by the [DevTools Recorder](https://developer.chrome.com/blog/new-in-devtools-100/#selector) as well, which keeps recordings and hand-written flows consistent:

`data-testid`, `data-test`, `data-qa`, `data-cy`, `data-test-id`, `data-qa-id`, `data-testing`

## Walkthrough: order a coffee

The following steps build a flow for the [coffee cart demo](https://coffee-cart.netlify.app/) that navigates to the page, selects a coffee, checks out and submits the order.

### 1. Start from the navigation

Run `npx user-flow init` and accept the defaults. You get the rc file and the `basic-navigation.uf.mts` shown above. Run it once with `npx user-flow` to confirm everything works.

### 2. Add the interactions

Fill the placeholder comments with Puppeteer calls:

```typescript title="user-flows/basic-navigation.uf.mts"
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, collectOptions } = ctx;

  await flow.navigate(collectOptions.url, {
    name: 'Navigate to coffee cart',
  });

  // Select coffee
  const cappuccinoItem = '[data-test=Cappucino]';
  await page.waitForSelector(cappuccinoItem);
  await page.click(cappuccinoItem);

  // Checkout order
  const checkoutBtn = '[data-test=checkout]';
  await page.waitForSelector(checkoutBtn);
  await page.click(checkoutBtn);

  const nameInputSelector = '#name';
  await page.waitForSelector(nameInputSelector);
  await page.type(nameInputSelector, 'nina');

  const emailInputSelector = '#email';
  await page.waitForSelector(emailInputSelector);
  await page.type(emailInputSelector, 'nina@gmail.com');

  // Submit order
  const submitBtn = '#submit-payment';
  await page.waitForSelector(submitBtn);
  await page.click(submitBtn);
  const successMsg = '.snackbar.success';
  await page.waitForSelector(successMsg);
};
```

> [!TIP]
> Run with `--dryRun` while you add interactions. Measurements are skipped, so each try takes seconds.

### 3. Measure the interactions with timespans

Wrap each interaction in `startTimespan` and `endTimespan`. Give every timespan a name; it becomes the step title in the report.

```typescript title="user-flows/basic-navigation.uf.mts"
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, collectOptions } = ctx;

  await flow.navigate(collectOptions.url, {
    name: 'Navigate to coffee cart',
  });

  await flow.startTimespan({ name: 'Select coffee' });
  // Select coffee ...
  await flow.endTimespan();

  await flow.startTimespan({ name: 'Checkout order' });
  // Checkout order ...
  await flow.endTimespan();

  await flow.startTimespan({ name: 'Submit order' });
  // Submit order ...
  await flow.endTimespan();
};
```

### 4. Audit the resulting states with snapshots

After each timespan, take a snapshot of the page. Snapshots are cheap and add accessibility and SEO audits for the state the interaction produced.

```typescript title="user-flows/basic-navigation.uf.mts"
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  // ...

  // Select coffee, wrapped in a timespan ...
  await flow.snapshot({ name: 'Coffee selected' });

  // Checkout order, wrapped in a timespan ...
  await flow.snapshot({ name: 'Order checked out' });

  // Submit order, wrapped in a timespan ...
  await flow.snapshot({ name: 'Order submitted' });
};
```

### 5. Run the real measurement

Drop `--dryRun` and run the flow. The report now contains one navigation, three timespans and three snapshots:

```bash
npx user-flow collect
```

## Keep flows maintainable

Once a flow grows beyond a handful of selectors, move selectors and interactions into reusable objects. The [UFO architecture](/docs/user-flows/ufo-architecture) page describes the pattern. If you would rather not write interaction code at all, [replay a DevTools recording](/docs/user-flows/recorder-exports).
