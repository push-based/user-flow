import { Page } from 'puppeteer';
import { logVerbose } from '../../../../core/loggin';
import UFR from 'lighthouse/types/lhr/flow-result';
import { StepOptions, UserFlowOptions } from './types';
import { UserFlow } from 'lighthouse/core/user-flow';
import * as LH from 'lighthouse/types/lh';
import { getReportContent } from '../../../../../../../test-data/src/lib/raw-reports';
import FlowResult from 'lighthouse/types/lhr/flow-result';

const jsonReport = getReportContent('lhr-9.json') as unknown as FlowResult;
const htmlReport = getReportContent('lhr-9.html') as string;


const dummyFlowResult: (cfg?: UserFlowOptions) => UFR = (cfg?: UserFlowOptions): UFR => {
  const config = cfg?.config || {};
  logVerbose('dummy config used:', config);
  const report = {
    name: cfg?.name || 'name-missing',
    steps: jsonReport.steps.map(s => {
      if(s.lhr.gatherMode === 'navigation') {
        s.lhr.configSettings = cfg as any
      }
      return s;
    })
  };

  const budgets = config?.settings?.budgets;
  if (budgets) {
    report.steps[0].lhr.configSettings.budgets = budgets;
  }

  return report as any;
};

const dummyFlowReport: (cfg: UserFlowOptions | undefined) => string = (cfg?: UserFlowOptions) => `
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

  protected cfg: LH.UserFlow.Options | undefined = {} as any;
  protected name: string = '';
  protected page: Page;

  async navigate(requestor: any, flags?: LH.UserFlow.StepFlags | undefined): Promise<any> {
    logVerbose(`flow#navigate: ${flags?.name || requestor}`);
    return this.page.goto(requestor);
  }
  startNavigation(stepOptions?: LH.UserFlow.StepFlags | undefined): Promise<void> {
    logVerbose(`flow#startNavigation: ${stepOptions?.name}`);
    return Promise.resolve()
  }
  currentNavigation: { continueAndAwaitResult: () => Promise<void>; } | undefined;
  endNavigation(): Promise<void> {
    logVerbose(`flow#navigateEnd`);
    return Promise.resolve()
  }
  currentTimespan: { timespan: { endTimespanGather(): Promise<LH.Gatherer.FRGatherResult>; }; flags: LH.UserFlow.StepFlags | undefined; } | undefined;
  createArtifactsJson(): LH.UserFlow.FlowArtifacts {
    throw new Error('Method not implemented.');
  }


  constructor(page: Page, flags?: LH.UserFlow.Options | undefined) {
    //super(page, flags);
    this.page = page;
    this.cfg = flags;
    this.name = flags?.name || 'name-missing';
  }


  async startTimespan(flags?: LH.UserFlow.StepFlags | undefined): Promise<void> {
    logVerbose(`flow#startTimespan: ${flags?.name}`);
    return Promise.resolve();
  }

  async endTimespan(flags?: LH.UserFlow.StepFlags | undefined): Promise<void> {
    logVerbose(`flow#endTimespan: ${flags?.name}`);
    return Promise.resolve();
  }

  async snapshot(flags?: LH.UserFlow.StepFlags | undefined): Promise<void> {
    logVerbose(`flow#snapshot: ${flags?.name}`);
    return Promise.resolve();
  }


  getFlowResult(): UFR {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  createFlowResult() {
    logVerbose(`flow#getFlowResult`);
    return Promise.resolve(dummyFlowResult(this.cfg));
  }


  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}

export class UserFlowReportMock {
  protected cfg: UserFlowOptions = {} as any;

  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return Promise.resolve();
  }

  constructor(cfg: UserFlowOptions) {
    this.cfg = cfg;
  }

  async startTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#startTimespan: ${stepName}`);
    return Promise.resolve();
  }

  async endTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#endTimespan: ${stepName}`);
    return Promise.resolve();
  }

  async snapshot({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#snapshot: ${stepName}`);
    return Promise.resolve();
  }

  getFlowResult(): UFR {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  createFlowResult(): UFR {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}
