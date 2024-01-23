
// Your custom interactions with the page
import { UserFlowContext, UserFlowInteractionsFn, UserFlowProvider } from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<void> => {
  const { flow, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    stepName: `Navigate to ${url}`,
  });

  // ℹ Tip:
  // Read more about the other measurement modes here:
  // https://github.com/push-based/user-flow/blob/main/packages/cli/docs/writing-basic-user-flows.md

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Basic Navigation Example'},
  interactions
};

export default userFlowProvider;
