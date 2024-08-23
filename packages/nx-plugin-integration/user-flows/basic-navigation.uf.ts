import {UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<void> => {
  const { flow, browser, collectOptions} = ctx;
  const { url} = collectOptions;

  await flow.navigate(url, {
    stepName: '🧭 Navigate to Home',
  });
};

export default {
  flowOptions: {name: 'Basic Navigation Example'},
  interactions
} satisfies UserFlowProvider;
