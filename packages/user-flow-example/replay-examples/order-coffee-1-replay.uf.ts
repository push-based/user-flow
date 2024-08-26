import {createUserFlowRunner, UserFlowContext, UserFlowInteractionsFn, UserFlowProvider} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {

  const {flow} = ctx;


  await flow.startTimespan({name: 'Checkout order'});
  // Use the create function to instanciate a the user-flow runner.
  const path = './recordings/order-coffee-1.replay.json';
  const runner = await createUserFlowRunner( path, ctx);
  await runner.run();
  await flow.endTimespan();

};

export default {
  flowOptions: { name: "Order Coffee 1" },
  interactions,
} satisfies UserFlowProvider;
