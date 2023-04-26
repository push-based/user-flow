import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product
} from 'puppeteer';

import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings.js';


export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: any;
  collectOptions: { url: string };
};

export type StepOptions = {
  stepName: string;
} & {
  /*page: Page,*/ config?: any /*configContext?: LH.Config.FRContext*/;
};

export type UserFlowInteractionsFn = (
  context: UserFlowContext
) => Promise<void>;

export type UserFlowOptions = {
  name: string;
} & {
  // throttling
  /*page: Page,*/ config?: any /*configContext?: LH.Config.FRContext*/;
};

// @TODO
// LH setting -> check what can be configured,
// narrow down to smallest possible -> LH will overwrite ppt
export type LaunchOptions = PPTLaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
};

/**
 * budgets: path to budgets file
 */
type UserFlowRcOptions = {
  config: {
    settings: {
      budgets: string | SharedFlagsSettings['budgets'];
    };
  };
} & UserFlowOptions;

export type UserFlowProvider = {
  flowOptions: UserFlowOptions | UserFlowRcOptions;
  interactions: UserFlowInteractionsFn;
  launchOptions?: LaunchOptions;
};

