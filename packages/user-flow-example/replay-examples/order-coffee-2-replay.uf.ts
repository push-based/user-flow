import {createUserFlowRunner, UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {

  const path = './recordings/order-coffee-2.replay.json';
  const runner = await createUserFlowRunner(path, ctx);
  await runner.run();

};

export default {
  flowOptions: { name: "Order Coffee 1" },
  interactions,
} satisfies UserFlowProvider;
