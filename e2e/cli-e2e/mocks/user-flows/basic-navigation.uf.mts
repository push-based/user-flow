// @ts-ignore // This is a mock file!
import { UserFlowContext, UserFlowInteractionsFn, UserFlowProvider } from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    name: `Navigate to ${url}`,
  });

  // ℹ Tip:
  // Read more about the other measurement modes here:
  // https://github.com/push-based/user-flow/blob/main/packages/cli/docs/writing-basic-user-flows.md

};

export default {
  flowOptions: {name: 'Basic Navigation Example'},
  interactions,
  launchOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
} satisfies UserFlowProvider;
