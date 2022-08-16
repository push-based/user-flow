import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product,
} from 'puppeteer';

import * as Config from 'lighthouse/types/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  collectOptions: { url: string };
};

export type StepOptions = {
  stepName: string;
} & {
  /*page: Page,*/ config?: Config.default.Json /*configContext?: LH.Config.FRContext*/;
};

export type UserFlowInteractionsFn = (
  context: UserFlowContext
) => Promise<void>;

export type UserFlowOptions = {
  name: string;
} & {
  // throttling
  /*page: Page,*/ config?: Config.default.Json /*configContext?: LH.Config.FRContext*/;
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

export type CliReport = {
  name: string;
  steps: FlowStep[];
}

export type FlowStep = {
  name: string;
  type: 'navigation' | 'timespan' | 'snapshot';
  results: {
    Performance?: number | FractionResults;
    Accessibility?: number | FractionResults;
    'Best Practices'?: number | FractionResults;
    SEO?: number | FractionResults;
    PWA?: number | FractionResults;
  };
}

export type FractionResults = {
  numPassed: number;
  numPassableAudits: number;
  numInformative: number;
  totalWeight: number;
}