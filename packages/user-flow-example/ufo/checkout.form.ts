import {Ufo} from '../../cli/src/lib/ufo';
import {
  checkoutBtnSelector,
  emailInputSelector,
  nameInputSelector,
  snackBarSelector,
  submitBtnSelector,
} from '../fixtures/checkout.fixture';

export class CheckoutForm extends Ufo {
  async openOrder(): Promise<void> {
    await this.page.waitForSelector(checkoutBtnSelector);
    await this.page.click(checkoutBtnSelector);
  }

  async fillCheckoutForm(formData: {
    name: string;
    email: string;
  }): Promise<void> {
    const {name, email} = formData;

    await this.page.waitForSelector(nameInputSelector);
    await this.page.type(nameInputSelector, name);

    await this.page.waitForSelector(emailInputSelector);
    await this.page.type(emailInputSelector, email);
  }

  async submitOrder(): Promise<void> {
    await this.page.click(submitBtnSelector);
    await this.page.waitForSelector(submitBtnSelector);
    await this.page.waitForSelector(snackBarSelector);
  }
}
