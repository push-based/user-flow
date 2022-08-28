
// Your custom interactions with the page
import { UserFlowContext, UserFlowInteractionsFn, UserFlowProvider } from '../../..';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  // ℹ Tip:
  // Read more about the other measurement modes here:
  // https://github.com/push-based/user-flow/blob/main/packages/cli/docs/writing-basic-user-flows.md

  // Select coffee

  // Checkout order

  // Submit order

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee'},
  interactions
};

module.exports = userFlowProvider;
