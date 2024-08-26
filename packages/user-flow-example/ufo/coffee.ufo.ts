import {Ufo} from '@push-based/user-flow';

import {cappuccinoSelector} from '../fixtures/coffee.fixture';

export class Coffee extends Ufo {

  async selectCappuccino() {
    await this.selectCoffee(cappuccinoSelector);
  }

  async selectCoffee(itemSelector: string) {
    await this.page.waitForSelector(itemSelector);
    await this.page.click(itemSelector);
  }

}
