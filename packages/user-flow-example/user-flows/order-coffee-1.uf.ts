import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<void> => {
  const { flow, collectOptions } = ctx;
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
