import { UserFlowProvider, UserFlowContext } from './../../../../cli/src/index';

module.exports = {
  flowOptions: {
    name: 'Sandbox Setup UF1'
  },
  interactions: async (ctx: UserFlowContext): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    const testUrl = `${url}`;
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
