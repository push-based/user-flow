import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  // Navigate to coffee order site
  await flow.navigate(url, {
    name: '🧭 Navigate to coffee cart',
  });

  await flow.startTimespan({ name: '☕ Select coffee' });

  // Select coffee
  const cappuccinoItem = '.cup:nth-child(1)';
  await page.waitForSelector(cappuccinoItem);
  await page.click(cappuccinoItem);

  await flow.endTimespan();

  await flow.snapshot({ name: '✔ Coffee selected' });


  await flow.startTimespan({ name: '🛒 Checkout order' });

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

  await flow.endTimespan();

  await flow.snapshot({ name: '🧾 Order checked out' });

  await flow.startTimespan({ name: '💌 Submit order' });

  // Submit order
  const submitBtn = '#submit-payment';
  await page.click(submitBtn);
  await page.waitForSelector(submitBtn);
  const successMsg = '.snackbar.success';
  await page.waitForSelector(successMsg);

  await flow.endTimespan();

  await flow.snapshot({ name: '📧 Order submitted' });

  // Navigate to github info site
  await flow.navigate(url+'github', {
    name: '🧭 Navigate to github'
  });
};

export default {
  flowOptions: { name: '☕ Order Coffee ☕' },
  interactions,
} satisfies UserFlowProvider;
