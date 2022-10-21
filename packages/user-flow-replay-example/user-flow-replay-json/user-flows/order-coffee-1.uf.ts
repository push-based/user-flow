import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, page, browser } = ctx;

  await flow.startTimespan({ stepName: 'Checkout order' });
  
  //... Interactions

  await flow.endTimespan();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Order Coffee 1" },
  interactions,
};

module.exports = userFlowProvider;