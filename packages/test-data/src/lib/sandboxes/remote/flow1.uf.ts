export const REMOTE_USERFLOW_NAME = 'remote-sandbox-setup.uf.ts';
export const REMOTE_USERFLOW_TITLE = REMOTE_USERFLOW_NAME.slice(0, -6);
export const REMOTE_USERFLOW_CONTENT = `
  module.exports = {
  flowOptions: {
    name: '${REMOTE_USERFLOW_TITLE}'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    const testUrl = '\'+url+'\';
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
`;
