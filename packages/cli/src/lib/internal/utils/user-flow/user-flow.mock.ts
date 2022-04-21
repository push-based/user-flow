import { Page } from 'puppeteer';
import { logVerbose } from '../../../core/loggin';
import FlowResult from 'lighthouse/types/lhr/flow';
import { StepOptions, UserFlowOptions } from './types';

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
