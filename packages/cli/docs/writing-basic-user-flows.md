# Writing basic user flows

## Selector suggestions

When writing tests it is a god practice to decouple your selector needed for the test from the actual code used to style your application. 
A good way to do this is using the data attribute and attribute selectors e.g. `[data-test]="lcp-img"`.

The following selectors are suggested to align with the official [user flow recorder feature](https://developer.chrome.com/blog/new-in-devtools-100/#selector):
- data-testid
- data-test
- data-qa
- data-cy
- data-test-id
- data-qa-id
- data-testing

## User flow measurement modes

| Icon  | Mode       | Measure            | Performance  | Accessibility | Best Practices | SEO       | PWA       |
| ----- | ---------- | ------------------ | ------------ | ------------- | -------------- | --------- | --------- |
| ![user-flow_navigation-icon](https://user-images.githubusercontent.com/10064416/165129388-2f62bb82-4856-456c-a513-ae5607cfe4ea.PNG) | Navigation | Page load          | 100% / 30    | 100% / 30     | 100% / 30      | 100% / 30 | ✔ / 7 |
| ![user-flow_timespan-icon](https://user-images.githubusercontent.com/10064416/165129495-330ddca5-fd8b-4ecc-a839-477302f7f229.PNG) | Timespan   | User Interaction   |  10  / 10    |       ❌      |   7  /  7      |     ❌    |     ❌    |
| ![user-flow_snapshot-icon](https://user-images.githubusercontent.com/10064416/165129696-68302177-6c7d-4aa2-ba3c-564939cde228.PNG) | Snapshot   | Current page state |   4  /  4    |  16  / 16     |   5  /  5      |   9  /  9 |     ❌    |


## Setup and navigation

**Example measure - Order Coffee**  

In the following steps we will implement the a user flow measurement for the following interactions:
- Navigate to page
- Select coffee
- Checkout order
- Submit order

1. Setup the `.user-flowrc.json` config file

Run `npx @push-based/user-flow init` in the console and accept the default value for every question.

This results in the following file:

**./.user-flowrc.json**
```json
{
    "collect": {
        // URL to analyze
        "url": "https://coffee-cart.netlify.app/",
        // Path to user flows from root directory
        "ufPath": "./"
    },
    "persist": {
        // Output path for the reports from root directory
        "outPath": "./"
    }
}
```

2. Create a `order-coffee.uf.ts` file.

**./order-coffee.uf.ts**
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

  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  // Select coffee

  // Checkout order

  // Submit order

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee'},
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

## Using the `timespan` measurement mode

Timespan measures are limited in the number of audits, but give us the opportunity to measure runtime changes in the page. 

Let's start by filling in our interaction logic:

1. Copy and paste the new lines into your flow.

**./order-coffee.uf.ts**
```typescript
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  // ... 
  
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
  await page.click(submitBtn);
  await page.waitForSelector(submitBtn);
  const successMsg = '.snackbar.success';
  await page.waitForSelector(successMsg);
  
};

// ...
```

2. Wrap the sections interesting for a timespan measure with `await flow.startTimespan({ stepName: 'Select coffee' });` and `await flow.stopTimespan();`.

**./order-coffee.uf.ts**
```typescript
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  // ...
  
  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  await flow.startTimespan({ stepName: 'Select coffee' });
  // Select coffee
  // ...
  await flow.endTimespan();

  await flow.startTimespan({ stepName: 'Checkout order' });
  // Checkout order
  // ...
  await flow.endTimespan();

  await flow.startTimespan({ stepName: 'Submit order' });
  // Submit order
  // ...
  await flow.endTimespan();
};

// ...
```

## Use snapshot measures

2. Wrap the sections interesting for a snapshot measure with `await flow.snapshot({ stepName: 'step name' });`.

**./order-coffee.uf.ts**
```typescript
// Your custom interactions with the page 
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {

  // Select coffee
  //  endTimespan here ...
  
  await flow.snapshot({ stepName: 'Coffee selected' });

  // Checkout order
  //  endTimespan here ...
  
  await flow.snapshot({ stepName: 'Order checked out' });

  // Submit order
  //  endTimespan here ...
  
  await flow.snapshot({ stepName: 'Order submitted' });
};

// ...
```
