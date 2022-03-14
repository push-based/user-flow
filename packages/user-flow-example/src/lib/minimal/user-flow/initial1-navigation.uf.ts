module.exports = {
  flowOptions: {
    name: 'Initial1 Navigation'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, collectOptions } = ctx as any;
    const { url } = collectOptions;

    const testUrl = `${url}`;

    await flow.navigate(testUrl);

  }
};
