import { Page } from 'puppeteer';
import { UserFlowContext } from '..';

/**
 * This class is used in the user-flow interactions to ensure the context of the flow is available in UFO's
 */
export class Ufo {
  protected page: Page;

  constructor({ page }: UserFlowContext) {
    this.page = page;
  }
}
