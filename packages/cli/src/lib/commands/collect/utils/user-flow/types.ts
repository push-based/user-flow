import {
  Browser,
  LaunchOptions as PPTLaunchOptions,
  Page,
  SupportedBrowser
} from 'puppeteer';

import { Config, UserFlow } from 'lighthouse';

export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  collectOptions: { url: string };
};

export type StepOptions = {
  name: string;
} & {
  /*page: Page,*/ config?: Config /*configContext?: LH.Config.FRContext*/;
};

export type UserFlowInteractionsFn = (
  context: UserFlowContext
) => Promise<void>;

export type UserFlowOptions = {
  name: string;
  config?: Config
};

// @TODO
// LH setting -> check what can be configured,
// narrow down to smallest possible -> LH will overwrite ppt
// Note: BrowserConnectOptions and BrowserLaunchArgumentOptions were removed in Puppeteer v24
// All options are now consolidated in LaunchOptions
export type LaunchOptions = PPTLaunchOptions & {
  defaultBrowser?: SupportedBrowser;
  extraPrefsFirefox?: Record<string, unknown>;
};

export type UserFlowProvider = {
  flowOptions: UserFlowOptions;
  interactions: UserFlowInteractionsFn;
  launchOptions?: LaunchOptions;
};
