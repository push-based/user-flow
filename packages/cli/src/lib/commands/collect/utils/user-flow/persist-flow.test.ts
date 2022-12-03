import { join } from 'path';
import { readdirSync } from 'fs';
import FlowResult from 'lighthouse/types/lhr/flow';
import { persistFlow } from './persist-flow';
import { ReportFormat } from '../../options/types';
import { UserFlowCliProject, UserFlowCliProjectFactory } from '../../../../../../tests/user-flow-cli-project';
import { INITIATED_PRJ_CFG } from '../../../../../../tests/fixtures/sandbox/initiated';
import { getReportContent } from '../../../../../../test-data/raw-reports';

const jsonReport = getReportContent('lhr-9.json') as unknown as FlowResult;
const htmlReport = getReportContent('lhr-9.html') as string;

// @TODO merge into user-flow.mock in src folder
export class UserFlowReportMock {
  constructor() {}

  createFlowResult(): Promise<FlowResult> {
    return Promise.resolve(jsonReport);
  }

  generateReport(): Promise<string>{
    return Promise.resolve(htmlReport);
  }
}

const flow = new UserFlowReportMock();

function expectPersistedReports(reports: string[], path: string, name: string, format: ReportFormat[]) {
  const expectedFileNames = format.filter((f) => f !== 'stdout')
    .map(f => `${name}.${f}`) || [];
  const expectedPaths = expectedFileNames.map((f) => join(path , f));

  expect(reports.sort()).toEqual(expectedPaths.sort());

  const persistedReports = readdirSync(path);
  expect(persistedReports.sort()).toEqual(expectedFileNames.sort());
}


let initializedPrj: UserFlowCliProject;
let outPath;
const flowName = 'flow-example-name';

describe('persist flow reports in specified format', () => {

  beforeEach(async () => {
    if(!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
    outPath = initializedPrj.outputPath();
  })
  afterEach(async () => {
    await initializedPrj.teardown();
  })

  it('does not save any reports if no format is given', async () => {
    const format: ReportFormat[] = [];
    const persistOptions = {outPath, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('does not save any reports if only stdout', async () => {
    const format: ReportFormat[] = ['stdout'];
    const persistOptions = {outPath, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('saves the report in json format only if its the only format given', async () => {
    const format: ReportFormat[] = ['json'];
    const persistOptions = {outPath, format}
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('saves the report in html format only if its the only format given', async () => {
    const format: ReportFormat[] = ['html']
    const persistOptions = {outPath, format}
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('saves the report in markdown format only if its the only format given', async () => {
    const format: ReportFormat[] = ['md'];
    const persistOptions = {outPath, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('saves the report in the format given excluding stdout', async () => {
    const format: ReportFormat[] = ['md', 'stdout'];
    const persistOptions = {outPath, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });

  it('saves the report in json, md and html', async () => {
    const format: ReportFormat[] = ['json', 'md', 'html'];
    const persistOptions = {outPath, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, outPath, flowName, format);
  });
});
