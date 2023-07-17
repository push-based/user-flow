import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';
import {LH_NAVIGATION_BUDGETS_NAME} from 'test-data';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const {flow, collectOptions} = ctx;
  const {url} = collectOptions;

  await flow.navigate(url, {
    stepName: '🧭 Navigate to Home'+LH_NAVIGATION_BUDGETS_NAME,
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'nx-plugin integration test'},
  interactions
};

module.exports = userFlowProvider;
