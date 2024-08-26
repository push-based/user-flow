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
    name: 'Navigate to coffee cart',
  });

  // Select coffee

  // Checkout order

  // Submit order

};

export default {
  flowOptions: {name: 'Order Coffee'},
  interactions
} satisfies UserFlowProvider;
