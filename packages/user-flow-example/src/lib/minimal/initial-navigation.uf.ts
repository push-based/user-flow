module.exports = {
  flowOptions: {
    name: 'Initial Navigation'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, page, collectOptions } = ctx;
    const { url } = collectOptions;

    const testUrl = `${url}`;

    await flow.navigate(testUrl);
  }
};
