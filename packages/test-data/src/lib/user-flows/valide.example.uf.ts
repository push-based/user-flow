export const VALIDE_EXAMPLE_USERFLOW_NAME = 'valide.example.uf.ts';
export const VALIDE_EXAMPLE_USERFLOW_TITLE = VALIDE_EXAMPLE_USERFLOW_NAME.slice(0, -3);
export const VALIDE_EXAMPLE_USERFLOW_CONTENT = `
export default {
  flowOptions: {
    name: '${VALIDE_EXAMPLE_USERFLOW_TITLE}'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    const testUrl = url;
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
`;
