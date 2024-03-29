export const BASIC_NAVIGATION_USERFLOW_NAME = 'basic-navigation.uf.ts';
export const BASIC_NAVIGATION_USERFLOW_CONTENT = `
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
  flowOptions: { name: 'order-coffee' },
  interactions,
};

module.exports = userFlowProvider;
  `;

