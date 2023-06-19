import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider,} from '@push-based/';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  // Select coffee
  const cappuccinoItem = '.cup:nth-child(1)';
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

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: 'Order Coffee' },
  interactions,
};

module.exports = userFlowProvider;
