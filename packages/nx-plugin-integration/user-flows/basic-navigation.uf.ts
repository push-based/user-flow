import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const {page, flow, browser, collectOptions} = ctx;
  const {url} = collectOptions;

  // Navigate to coffee order site
  await flow.navigate(url, {
    stepName: '🧭 Navigate to Home',
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Basic navigation to test nx-plugin integration'},
  interactions
};

module.exports = userFlowProvider;
