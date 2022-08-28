import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions,
  Page,
  Product
} from 'puppeteer';

import * as Config from 'lighthouse/types/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';
import { PickOne } from '../../../../core/utils/types';
import FlowResult from 'lighthouse/types/lhr/flow';


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

export type ReducedReport = {
  name: string;
  steps: ReducedFlowStep[];
}


type UfrSlice = PickOne<FlowResult>;
type LhrSlice = PickOne<FlowResult.Step['lhr']>;
/**
 * Plucks key value from oroginal LH report
 * @example
 *
 * const t: GatherModeSlice = {gatherMode: 'navigation'};
 * const f1: GatherModeSlice = {gatherddMode: 'navigation'};
 * const f2: GatherModeSlice = {gatherMode: 'navigationddddd'};
 */
type LhrGatherModeSlice = LhrSlice & { gatherMode: FlowResult.Step['lhr']['gatherMode'] };
type UfrNameSlice = UfrSlice & { name: string };


/**
 * This type is the result of `calculateCategoryFraction` https://github.com/GoogleChrome/lighthouse/blob/master/core/util.cjs#L540.
 * As there is no typing present ATM we maintain our own.
 */
export type FractionResults = {
  numPassed: number;
  numPassableAudits: number;
  numInformative: number;
  totalWeight: number;
}

export type ReducedFlowStepResult = Record<string, number | FractionResults>;

export type ReducedFlowStep = UfrNameSlice & LhrGatherModeSlice &
  {
    results: ReducedFlowStepResult;
  };

