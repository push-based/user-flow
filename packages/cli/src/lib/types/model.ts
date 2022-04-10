import {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions as PPTLaunchOptions, Page,
  Product
} from 'puppeteer';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import * as Config from 'lighthouse/types/config';
import { UserFlowRcConfig } from '../internal/config/model';

import FlowResult from 'lighthouse/types/lhr/flow';
import { logVerbose } from '../core/loggin';

export { UserFlowRcConfig } from '../internal/config/model';

export type LaunchOptions = PPTLaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
  product?: Product;
  extraPrefsFirefox?: Record<string, unknown>;
}

export type UserFlowOptions = {
  name: string;
} & { page: import('puppeteer').Page, config?: Config.default.Json, /*configContext?: LH.Config.FRContext*/ }

/**
 * used inside of `UserFlowInteractionsFn`
 */
export interface StepOptions {
  stepName: string;
}

export type UserFlowContext = {
  browser: Browser;
  page: Page;
  flow: UserFlow;
  collectOptions: { url: string }
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

  constructor({ page }: UserFlowContext) {
    this.page = page;
  }
};


/**
 * @TODO this is very flakey ATM and needs investigation
 */
export class UserFlowMock {

  protected page: Page;

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return this.page.goto(requestor);
  }

  constructor(page: Page, { name }: UserFlowOptions) {
    this.page = page;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#startTimespan: ${stepName}`);
    return Promise.resolve();
  }

  async endTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#endTimespan: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#snapshot: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @return {LH.FlowResult}
   */
  getFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return {} as FlowResult;
  }

  /**
   * @return {Promise<string>}
   */
  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve('');
  }

}

