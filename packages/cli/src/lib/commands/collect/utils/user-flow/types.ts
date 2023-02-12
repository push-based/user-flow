import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product
} from 'puppeteer';

import LhConfig from 'lighthouse/types/config';
import LhUserFlow from 'lighthouse/types/user-flow';


export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: LhUserFlow;
  collectOptions: { url: string };
};

export type StepOptions = {
  stepName: string;
} & {
  /*page: Page,*/ config?: LhConfig /*configContext?: LH.Config.FRContext*/;
};

export type UserFlowInteractionsFn = (
  context: UserFlowContext
) => Promise<void>;


export type UserFlowOptions = LhUserFlow.Options;

// @TODO
// LH setting -> check what can be configured,
// narrow down to smallest possible -> LH will overwrite ppt
export type LaunchOptions = PPTLaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
};


export type UserFlowProvider = {
  flowOptions: UserFlowOptions;
  interactions: UserFlowInteractionsFn;
  launchOptions?: LaunchOptions;
};

