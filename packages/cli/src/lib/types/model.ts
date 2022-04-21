import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product
} from 'puppeteer';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { RcJson } from '../internal/config/model';
import Budget from 'lighthouse/types/lhr/budget';
import { UserFlowOptions } from '../internal/utils/user-flow/types';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export { RcJson } from '../internal/config/model';

export type LaunchOptions = PPTLaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
}

export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  collectOptions: { url: string }
}
export type UserFlowInteractionsFn = (context: UserFlowContext) => Promise<void>;

/**
 * budgets: path to budgets file
 */
type UserFlowCLIOptions = {
  config: {
    settings: {
      budgets: string | SharedFlagsSettings['budgets']
    }
  }
} &  UserFlowOptions;
export type UserFlowProvider = {
  flowOptions: UserFlowOptions | UserFlowCLIOptions,
  interactions: UserFlowInteractionsFn
  launchOptions?: LaunchOptions,
};

/**
 * This class is used in the user-flow interactions to ensure the context of the flow is available in UFO's
 */
export class Ufo {
  protected page: Page;

  constructor({ page }: UserFlowContext) {
    this.page = page;
  }
};


