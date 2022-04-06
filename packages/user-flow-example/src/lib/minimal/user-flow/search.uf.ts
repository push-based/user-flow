const searchFormSelector = 'form[data-uf="q-form"]';
const searchInputSelector = 'input[data-uf="q"]';
const resultSelector = (idx: number): string => `*[data-uf="movie-${idx}"]`;

const searchQuery = "pocahontas";
const searchSubmitKeys = ['Enter'];

module.exports = {
  flowOptions: {
    name: 'Search for pocahontas movies'
  },
  interactions: async (ctx: any): Promise<any> => {
    const { flow, page, collectOptions } = ctx;
    const { url } = collectOptions;

    const testUrl = `${url}`;

    await flow.navigate(testUrl);

    await page.waitForSelector(searchFormSelector);
    await flow.startTimespan();
    await page.click(searchFormSelector);
    await page.focus(searchInputSelector);
    await page.keyboard.type(searchQuery, {delay: 25});
    await page.keyboard.press(searchSubmitKeys[0] as any);
    await page.waitForSelector(resultSelector(0));
    await flow.endTimespan();

  }
};
