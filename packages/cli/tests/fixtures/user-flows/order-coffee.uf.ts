export const ORDER_COFFEE_USERFLOW_NAME = 'order-coffee.uf.ts';
export const ORDER_COFFEE_USERFLOW_CONTENT = `
import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider,
} from '@push-based/user-flow';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  // Select coffee

  // Checkout order

  // Submit order
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: 'Order Coffee' },
  interactions,
};

module.exports = userFlowProvider;
  `;

