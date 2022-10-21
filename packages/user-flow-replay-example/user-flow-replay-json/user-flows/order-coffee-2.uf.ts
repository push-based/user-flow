import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
  createUserFlowRunner
} from '@push-based/user-flow';


const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {

  const { flow, page, browser } = ctx;

  await flow.startTimespan({ stepName: 'Checkout order' });
  const runner = await createUserFlowRunner('./recordings/order-coffee-1.replay.json', ctx);
  await runner.run();
  await flow.endTimespan();

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Order Coffee 2" },
  interactions,
};

module.exports = userFlowProvider;