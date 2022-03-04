import puppeteer, {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions, Page,
  Product
} from 'puppeteer';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';

export { UserFlowCliConfig } from '../internal/config/model';

export type LaunchOptions = PPTLaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
}
export interface UserFlowOptions {
  name: string;
}
export interface StepOptions {
  stepName: string;
}


export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  baseUrl: string
}
export type UserFlowInteractionsFn = (context: UserFlowContext) => Promise<void>;

export type UserFlowProvider = {
  flowOptions: UserFlowOptions,
  interactions: UserFlowInteractionsFn
  launchOptions?: LaunchOptions,
};


/**
 * This class is used in the user-flow interactions to ensure the context of the flow is available in UFO's
 */
export class Ufo {
  protected page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page
  }
};
