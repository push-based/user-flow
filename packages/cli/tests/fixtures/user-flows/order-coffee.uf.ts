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

export const SETUP_1_USERFLOW_NAME = 'sandbox-setup-1.uf.ts';
export const SETUP_1_USERFLOW_CONTENT = `
  module.exports = {
  flowOptions: {
    name: 'Sandbox Setup UF1'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    const testUrl = '\'+url+'\';
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
`;
