import { Page } from 'puppeteer';
import { logVerbose } from '../../../../core/loggin';
import FlowResult from 'lighthouse/types/lhr/flow';
import { StepOptions, UserFlowOptions } from './types';

const dummyFlowResult: (cfg: UserFlowOptions) => FlowResult = (cfg: UserFlowOptions): FlowResult => {
  const config = cfg?.config || { };
  logVerbose('dummy config used:', config)
  const report = {
    name: cfg.name,
    steps: [
      {
        name: 'Navigation report (127.0.0.1/)',
        lhr: {
          fetchTime: new Date().toISOString(),
          configSettings: config,
          audits: {
            // "performance-budget": {},
            // "timing-budget": {}
          }
        } as any
      }
    ]
  };
  if (config) {
    report.steps[0].lhr.configSettings = config;
  }

  const budgets = config?.settings?.budgets;
  if (budgets) {
    report.steps[0].lhr.configSettings.budgets = budgets;
    report.steps[0].lhr.audits['performance-budget'] = {};
    report.steps[0].lhr.audits['timing-budget'] = {};
  }

  return report;
};

const dummyFlowReport: (cfg: UserFlowOptions) => string = (cfg: UserFlowOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, minimum-scale=1"
/>
<title>Lighthouse Flow Report</title>
<style></style>
<script>
${JSON.stringify(dummyFlowResult(cfg))}
</script>
</head>
<body></body>
`;

/**
 * @TODO this is very flakey ATM and needs investigation
 */
export class UserFlowMock {

  protected cfg: UserFlowOptions = {} as any;
  protected name: string = '';
  protected page: Page;

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return this.page.goto(requestor);
  }

  constructor(page: Page, cfg: UserFlowOptions) {
    this.page = page;
    this.cfg = cfg;
    this.name = cfg.name;
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
    return dummyFlowResult(this.cfg);
  }

  createFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  /**
   * @return {Promise<string>}
   */
  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}

export class UserFlowReportMock {
  protected cfg: UserFlowOptions = {} as any;

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return Promise.resolve();
  }

  constructor(cfg: UserFlowOptions) {
    this.cfg = cfg;
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
    return dummyFlowResult(this.cfg);
  }

  createFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  /**
   * @return {Promise<string>}
   */
  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}
