// Setup UserFlow options
const flowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

// Your custom interactions with the page
const interactions = async (ctx: any): Promise<any> => {
  const { page, flow, baseUrl } = ctx;
  const url = `${baseUrl}/list`;

  const sideMenuBtnSelector = '#main-side-bar div.header-wrapper .hamburger-btn';
  const firstMovieListImg = '.ui-movie-list img.movie-img-1';

  await flow.startTimespan({
    stepName: 'Navigate to list page',
  });

  await page.waitForSelector(sideMenuBtnSelector);
  await page.click(sideMenuBtnSelector);
  await page.waitForSelector(firstMovieListImg);

  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider = {
  flowOptions,
  interactions
};

module.exports = userFlowProvider;
