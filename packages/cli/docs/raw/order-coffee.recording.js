const puppeteer = require('puppeteer'); // v13.0.0 or later

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const timeout = 5000;
  page.setDefaultTimeout(timeout);

  async function waitForSelectors(selectors, frame, options) {
    for (const selector of selectors) {
      try {
        return await waitForSelector(selector, frame, options);
      } catch (err) {
        console.error(err);
      }
    }
    throw new Error(
      'Could not find element for selectors: ' + JSON.stringify(selectors)
    );
  }

  async function scrollIntoViewIfNeeded(element, timeout) {
    await waitForConnected(element, timeout);
    const isInViewport = await element.isIntersectingViewport({threshold: 0});
    if (isInViewport) {
      return;
    }
    await element.evaluate((element) => {
      element.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'auto',
      });
    });
    await waitForInViewport(element, timeout);
  }

  async function waitForConnected(element, timeout) {
    await waitForFunction(async () => {
      return await element.getProperty('isConnected');
    }, timeout);
  }

  async function waitForInViewport(element, timeout) {
    await waitForFunction(async () => {
      return await element.isIntersectingViewport({threshold: 0});
    }, timeout);
  }

  async function waitForSelector(selector, frame, options) {
    if (!Array.isArray(selector)) {
      selector = [selector];
    }
    if (!selector.length) {
      throw new Error('Empty selector provided to waitForSelector');
    }
    let element = null;
    for (let i = 0; i < selector.length; i++) {
      const part = selector[i];
      if (element) {
        element = await element.waitForSelector(part, options);
      } else {
        element = await frame.waitForSelector(part, options);
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('>>'));
      }
      if (i < selector.length - 1) {
        element = (
          await element.evaluateHandle((el) =>
            el.shadowRoot ? el.shadowRoot : el
          )
        ).asElement();
      }
    }
    if (!element) {
      throw new Error('Could not find element: ' + selector.join('|'));
    }
    return element;
  }

  async function waitForElement(step, frame, timeout) {
    const count = step.count || 1;
    const operator = step.operator || '>=';
    const comp = {
      '==': (a, b) => a === b,
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
    };
    const compFn = comp[operator];
    await waitForFunction(async () => {
      const elements = await querySelectorsAll(step.selectors, frame);
      return compFn(elements.length, count);
    }, timeout);
  }

  async function querySelectorsAll(selectors, frame) {
    for (const selector of selectors) {
      const result = await querySelectorAll(selector, frame);
      if (result.length) {
        return result;
      }
    }
    return [];
  }

  async function querySelectorAll(selector, frame) {
    if (!Array.isArray(selector)) {
      selector = [selector];
    }
    if (!selector.length) {
      throw new Error('Empty selector provided to querySelectorAll');
    }
    let elements = [];
    for (let i = 0; i < selector.length; i++) {
      const part = selector[i];
      if (i === 0) {
        elements = await frame.$$(part);
      } else {
        const tmpElements = elements;
        elements = [];
        for (const el of tmpElements) {
          elements.push(...(await el.$$(part)));
        }
      }
      if (elements.length === 0) {
        return [];
      }
      if (i < selector.length - 1) {
        const tmpElements = [];
        for (const el of elements) {
          const newEl = (
            await el.evaluateHandle((el) =>
              el.shadowRoot ? el.shadowRoot : el
            )
          ).asElement();
          if (newEl) {
            tmpElements.push(newEl);
          }
        }
        elements = tmpElements;
      }
    }
    return elements;
  }

  async function waitForFunction(fn, timeout) {
    let isActive = true;
    setTimeout(() => {
      isActive = false;
    }, timeout);
    while (isActive) {
      const result = await fn();
      if (result) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Timed out');
  }

  {
    const targetPage = page;
    await targetPage.setViewport({width: 1077, height: 975});
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    await targetPage.goto('https://coffee-cart.netlify.app/');
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Cappucino'], ['[data-test=Cappucino]']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    await element.click({
      offset: {x: 190.90185546875, y: 159.6608657836914},
    });
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Proceed to checkout'], ['[data-test=checkout]']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    await element.click({offset: {x: 103.1875, y: 18.796875}});
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Name'], ['#name']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    await element.click({offset: {x: 122.515625, y: 23.921875}});
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Name'], ['#name']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    const type = await element.evaluate((el) => el.type);
    if (
      [
        'textarea',
        'select-one',
        'text',
        'url',
        'tel',
        'search',
        'password',
        'number',
        'email',
      ].includes(type)
    ) {
      await element.type('nina');
    } else {
      await element.focus();
      await element.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', {bubbles: true}));
        el.dispatchEvent(new Event('change', {bubbles: true}));
      }, 'nina');
    }
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Email'], ['#email']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    await element.click({offset: {x: 124.5, y: 17.234375}});
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Email'], ['#email']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    const type = await element.evaluate((el) => el.type);
    if (
      [
        'textarea',
        'select-one',
        'text',
        'url',
        'tel',
        'search',
        'password',
        'number',
        'email',
      ].includes(type)
    ) {
      await element.type('nina@gmail.com');
    } else {
      await element.focus();
      await element.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', {bubbles: true}));
        el.dispatchEvent(new Event('change', {bubbles: true}));
      }, 'nina@gmail.com');
    }
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Submit'], ['#submit-payment']],
      targetPage,
      {timeout, visible: true}
    );
    await scrollIntoViewIfNeeded(element, timeout);
    await element.click({offset: {x: 21.859375, y: 26.859375}});
  }
  {
    const targetPage = page;
    let frame = targetPage.mainFrame();
    await waitForElement(
      {
        type: 'waitForElement',
        selectors: [
          [
            'aria/Thanks for your purchase. Please check your email for payment.',
          ],
          ['#app > div.snackbar.success'],
        ],
        frame: [],
        target: 'main',
      },
      frame,
      timeout
    );
  }

  await browser.close();
})();
