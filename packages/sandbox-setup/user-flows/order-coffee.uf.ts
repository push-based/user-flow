import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider,
} from "@push-based/user-flow";

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { page, flow, browser, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    stepName: "Navigate everything page",
  });

};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Login" },
  interactions,
};

module.exports = userFlowProvider;
