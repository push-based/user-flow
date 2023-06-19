import {
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider,
} from '@push-based/user-flow';
import { Coffee } from '../ufo/coffee.ufo';
import { CheckoutForm } from '../ufo/checkout.form';
import { formData } from '../data/checkout.data';

// Your custom interactions with the page
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = ctx;
  const {url} = collectOptions;

  const coffeeUfo = new Coffee(ctx);
  const checkoutFormUfo = new CheckoutForm(ctx);

  // Navigate to coffee order site
  await flow.navigate(url, {
    stepName: 'Navigate to coffee cart',
  });

  await flow.startTimespan({stepName: 'Select coffee'});
  // Select coffee
  coffeeUfo.selectCappuccino();
  await flow.endTimespan();
  await flow.snapshot({ stepName: 'Coffee selected' });

  await flow.startTimespan({ stepName: 'Checkout order' });
  // Checkout order
  await checkoutFormUfo.openOrder();
  await checkoutFormUfo.fillCheckoutForm(formData);
  await flow.endTimespan();
  await flow.snapshot({ stepName: 'Order checked out' });

  await flow.startTimespan({ stepName: 'Submit order' });
  // Submit order
  await checkoutFormUfo.submitOrder();
  await flow.endTimespan();
  await flow.snapshot({ stepName: 'Order submitted' });
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: {name: 'Order Coffee'},
  interactions,
};

module.exports = userFlowProvider;
