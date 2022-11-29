export const STATIC_USERFLOW_NAME = 'static-sandbox-setup.uf.ts';
export const STATIC_USERFLOW_TITLE = STATIC_USERFLOW_NAME.slice(0, -6);
export const STATIC_USERFLOW_CONTENT = `
module.exports = {
  flowOptions: {
    name: 'Sandbox Setup StaticDist',
    config: {
      settings: {
        budgets: undefined
      }
    }
  },
  interactions: async (ctx: any): Promise<void> => {
    const { flow, collectOptions, page } = ctx as any;
    const { url } = collectOptions;
    const testUrl = url;

    // # Navigation
    await flow.navigate(testUrl);

    // # Timespan
    const btn = '#btn';
    const img = '#img';

    await page.waitForSelector(btn);

    // record timespan
    await flow.startTimespan();

    // relevant interactions
    await page.click(btn);
    await page.waitForSelector(img);

    await flow.endTimespan();

    // # Snapshot
    await flow.snapshot();

  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: false
  }
};
`;
