import { join } from 'path';
import { readdirSync } from 'fs';
import FlowResult from 'lighthouse/types/lhr/flow-result';
import { UserFlowCliProject, UserFlowCliProjectFactory } from '@push-based/user-flow-cli-testing';
import { getReportContent, INITIATED_PRJ_CFG } from 'test-data';
import { persistFlow } from './persist-flow';
import { ReportFormat } from '../../options/types';
import { PersistFlowOptions } from './types';
import { createReducedReport, toReportName } from '../report/utils';
import UserFlow from 'lighthouse/types/user-flow';
import { UserFlowMock } from '../user-flow/user-flow.mock';


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

const jsonReport = getReportContent('lhr-9.json') as unknown as FlowResult;
const flowFileName = toReportName(url, jsonReport.name, createReducedReport(jsonReport));
const persistFlowOptions: PersistFlowOptions = { outPath: '', format: [], url };
const flow = new UserFlowMock(null as any, { name: jsonReport.name }) as any as UserFlow;

let originalCwd = process.cwd();
const consoleLog = console.log;

describe('persist flow reports in specified format', () => {

  beforeAll(() => {
    process.chdir(INITIATED_PRJ_CFG.root);
    console.log = (...args: any) => void 0;
  })
  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
    outPath = initializedPrj.outputPath();
    persistFlowOptions.outPath = outPath;
    console.log = () => void 0;
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });
  afterAll(() => {
    process.chdir(originalCwd);
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
    const reports = await persistFlow(flow, persistFlowOptions);

    old_expectPersistedReports(reports, outPath, flowFileName, format);
  });

});
