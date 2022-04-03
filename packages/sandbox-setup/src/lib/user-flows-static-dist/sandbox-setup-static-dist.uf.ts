module.exports = {
  flowOptions: {
    name: 'Sandbox Setup StaticDist'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, collectOptions, page } = ctx as any;
    const { url } = collectOptions;
    const testUrl = `${url}`;
    await flow.navigate(testUrl);

    const btn = '#btn';
    const img = '#img';

    await page.waitForSelector(btn);
    await flow.startTimespan();
    await page.click(btn);
    await page.waitForSelector(img);
    await flow.endTimespan();
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
