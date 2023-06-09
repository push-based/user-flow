import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const {page, flow, browser, collectOptions} = ctx;
  const {url} = collectOptions;

  await flow.navigate(url, {
    stepName: '🧭 Navigate to Home',
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'nx-plugin integration test'},
  interactions
};

module.exports = userFlowProvider;
