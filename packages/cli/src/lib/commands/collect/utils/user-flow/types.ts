import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product
} from 'puppeteer';

import * as Config from 'lighthouse/types/config';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  collectOptions: { url: string }
}

export interface StepOptions {
  stepName: string;
}

export type UserFlowInteractionsFn = (context: UserFlowContext) => Promise<void>;


export type UserFlowOptions = {
  name: string;
} & { /*page: Page,*/ config?: Config.default.Json, /*configContext?: LH.Config.FRContext*/ }

export type LaunchOptions = PPTLaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
}

/**
 * budgets: path to budgets file
 */
type UserFlowRcOptions = {
  config: {
    settings: {
      budgets: string | SharedFlagsSettings['budgets']
    }
  }
} & UserFlowOptions;

export type UserFlowProvider = {
  flowOptions: UserFlowOptions | UserFlowRcOptions,
  interactions: UserFlowInteractionsFn
  launchOptions?: LaunchOptions,
};
