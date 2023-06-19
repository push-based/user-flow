import {
  createUserFlowRunner,
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';
// @TODO refactor when v10 update lands
import { UserFlow as LhUserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, page, browser } = ctx;
  const lhFlow: LhUserFlow = flow;

  await flow.startTimespan({ stepName: 'Checkout order' });
  // Use the create function to instanciate a the user-flow runner.
  const path = './recordings/order-coffee-1.replay.json';
  const runner = await createUserFlowRunner(path, { page, browser, lhFlow });
  await runner.run();
  await flow.endTimespan();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: 'Order Coffee 1' },
  interactions,
};

module.exports = userFlowProvider;
