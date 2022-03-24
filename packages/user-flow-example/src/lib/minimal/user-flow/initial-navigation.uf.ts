module.exports = {
  flowOptions: {
    name: 'Initial Navigation'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, page, collectOptions } = ctx as any;
    const { url } = collectOptions;

    const testUrl = `${url}`;

    const sideMenuBtnSelector = '*[data-uf="menu-btn"]';
    const animDurationStandard = 300;
    const topRatedListBtn = '*[data-uf="menu-cat-topRated"]';
    const firstMovieListImg = '*[data-uf="movie-0"]';

    await flow.navigate(testUrl);

    await flow.startTimespan({ stepName: 'Navigate to top rated' });

    await page.waitForSelector(sideMenuBtnSelector);
    await page.click(sideMenuBtnSelector);
    await page.waitForTimeout(animDurationStandard);
    await page.waitForSelector(topRatedListBtn);
    await page.click(topRatedListBtn);
    await page.waitForSelector(firstMovieListImg);
    await flow.endTimespan();
  }
};
