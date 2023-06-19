import {
  createUserFlowRunner,
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';
import {UserFlow as LhUserFlow} from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {browser, page, flow} = ctx;
  const lhFlow: LhUserFlow = flow;

  const path = './recordings/order-coffee-2.replay.json';
  const runner = await createUserFlowRunner(path, {browser, page, lhFlow});
  await runner.run();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee 2'},
  interactions,
};

module.exports = userFlowProvider;
