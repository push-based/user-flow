export default {
  flowOptions: {
    name: 'DUMMY FLOW'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    await flow.navigate(url);
  },
};
