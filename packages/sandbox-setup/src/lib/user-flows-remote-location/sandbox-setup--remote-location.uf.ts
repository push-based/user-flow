module.exports = {
  flowOptions: {
    name: 'Sandbox Setup - Remote location'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, collectOptions } = ctx as any;
    const { url } = collectOptions;
    const testUrl = `${url}`;
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
