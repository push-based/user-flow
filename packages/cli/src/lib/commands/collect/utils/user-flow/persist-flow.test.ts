import { join } from 'path';
import { readdirSync } from 'fs';
import FlowResult from 'lighthouse/types/lhr/flow';
import { persistFlow } from './persist-flow';
import { ReportFormat } from '../../options/types';
import { UserFlowCliProject, UserFlowCliProjectFactory } from '@push-based/user-flow-cli-testing';
import { getReportContent, INITIATED_PRJ_CFG } from 'test-data';
import { PersistFlowOptions } from './types';
import { dateToIsoLikeString, toReportName } from './utils';

const jsonReport = getReportContent('lhr-9.json') as unknown as FlowResult;
const htmlReport = getReportContent('lhr-9.html') as string;

// @TODO merge into user-flow.mock in src folder
export class UserFlowReportMock {
  protected name: string = '';
  constructor(options: {name: string}) {
    this.name = options.name;
  }

  createFlowResult(): Promise<FlowResult> {
    return Promise.resolve(jsonReport);
  }

  generateReport(): Promise<string> {
    return Promise.resolve(htmlReport);
  }
}

/**
 * @deprecated
 * use expectPersistedReports from expect.ts instead
 * To do so we have to bootstrap the cli within the it block with different formats
 * @param persistedReportPaths
 * @param path
 * @param name
 * @param formats
 */
function old_expectPersistedReports(persistedReportPaths: string[], outPath: string, name: string, formats: ReportFormat[]) {
 // const formatChecker = /(\.json|\.html\.md)*$/g;
  const fileNamesToPersist = formats.filter((f) => f !== 'stdout')
    .map(f => `${name}.${f}`) || [];
  const reportPathsToPersist = fileNamesToPersist.map((f) => join(outPath, f))

  expect(persistedReportPaths.sort()).toEqual(reportPathsToPersist.sort());

  const expectedReportPaths = readdirSync(outPath)
  expect(expectedReportPaths.sort()).toEqual(fileNamesToPersist.sort());
}

let initializedPrj: UserFlowCliProject;
let outPath;
const url = 'test.url';
const isoStartDate = dateToIsoLikeString(new Date());
const flowName = `flow-example-name`;
const flowFileName = toReportName(url, flowName, jsonReport.steps[0].lhr.fetchTime);
const persistFlowOptions: PersistFlowOptions = { outPath: '', format: [], url };
const flow = new UserFlowReportMock({name: flowName});

let originalCwd = process.cwd();
const consoleLog = console.log;

describe('persist flow reports in specified format', () => {


  beforeAll(() => {
    console.log = (...args: any) => void 0;
  })
  beforeEach(async () => {
    process.chdir(INITIATED_PRJ_CFG.root);
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
    outPath = initializedPrj.outputPath();
    persistFlowOptions.outPath = outPath;
  });
  afterEach(async () => {
 //   await initializedPrj.teardown();
    process.chdir(originalCwd);
  });
  afterAll(() => {
    console.log = consoleLog;
  })

  it('does not save any reports if no format is given', async () => {
    const format: ReportFormat[] = [];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('does not save any reports if only stdout', async () => {
    const format: ReportFormat[] = ['stdout'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('saves the report in json format only if its the only format given', async () => {
    const format: ReportFormat[] = ['json'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);
    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('saves the report in html format only if its the only format given', async () => {
    const format: ReportFormat[] = ['html'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('saves the report in markdown format only if its the only format given', async () => {
    const format: ReportFormat[] = ['md'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('saves the report in the format given excluding stdout', async () => {
    const format: ReportFormat[] = ['md', 'stdout'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

  it('saves the report in json, md and html', async () => {
    const format: ReportFormat[] = ['json', 'md', 'html'];
    persistFlowOptions.format = format;
    const report = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(report, outPath, flowFileName, format);
  });

});
