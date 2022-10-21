import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
  createUserFlowRunner
} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {

  const path = './recordings/order-coffee-2.replay.json';
  const runner = await createUserFlowRunner(path, ctx);
  await runner.run();
  
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Order Coffee 2" },
  interactions,
};

module.exports = userFlowProvider;