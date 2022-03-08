// Setup UserFlow options
const flowOptions = {
  name: 'Initial Navigation',
};

// Your custom interactions with the page
const interactions = async (ctx: any): Promise<any> => {
  const { flow, page, browser, collectOptions } = ctx;
  const { url, ufPath } = collectOptions;

  const testUrl = `${url}`;

  const sideMenuBtnSelector = '*[data-uf]="main-btn"';
  const firstMovieListImg = '*[data-uf]="movie-0"';

  await flow.navigate(testUrl);
/*
  await flow.startTimespan({
    stepName: 'Navigate to list page',
  });

  await page.waitForSelector(sideMenuBtnSelector);
  await page.click(sideMenuBtnSelector);
  await page.waitForSelector(firstMovieListImg);

  await flow.endTimespan();
*/
  return Promise.resolve();
};

const userFlowProvider = {
  flowOptions,
  interactions,
  launchOptions: {
    headless: false
  }
};

module.exports = userFlowProvider;
