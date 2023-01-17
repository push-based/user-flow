import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  // Navigate to coffee order site
  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee in CI'},
  interactions
};

module.exports = userFlowProvider;
