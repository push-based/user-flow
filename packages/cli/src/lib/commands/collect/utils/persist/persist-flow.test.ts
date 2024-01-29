import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';

import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';

import { getReportContent } from 'test-data';
import { persistFlow } from './persist-flow.js';
import { ReportFormat } from '../../options/types.js';
import { PersistFlowOptions } from './types.js';
import { UserFlow } from 'lighthouse';
import { REPORT_FORMAT } from '../../../init/constants.js';
import { fileURLToPath } from 'node:url';

const jsonReport = getReportContent('lhr-9.json') as unknown as any;
const htmlReport = getReportContent('lhr-9.html') as string;

// @TODO merge into user-flow.mock in src folder
export class UserFlowReportMock {
  protected name: string = '';

  constructor(options: { name: string }) {
    this.name = options.name;
  }

  createFlowResult(): Promise<any> {
    return Promise.resolve(jsonReport);
  }

  generateReport(): Promise<string> {
    return Promise.resolve(htmlReport);
  }
}

/**
 * @deprecated
 * use expectPersistedReports from expect.ts instead
 * To do so we have to bootstrap the cli within it block with different formats
 * @param persistedReportPaths
 * @param outPath
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

const url = 'test.url';
const flowName = `flow-example-name`;
const outPath = './persist-measures-test-output';
const flow = new UserFlowReportMock({ name: flowName }) as any as UserFlow;
const _dirname = dirname(fileURLToPath(import.meta.url));
const pathToRepoRoot = join(_dirname, Array(8).fill('..').join('/'));
const testResultsDir = join(pathToRepoRoot, outPath);
const basePersistOptions: PersistFlowOptions = { outPath, format: [], url }


describe('persist flow reports in specified format', () => {

  afterEach(() => {
    if (!existsSync(testResultsDir)) return;
    rmSync(testResultsDir, { recursive: true });
  })

  // @TODO Make a test to insure correct log is generated
  it('does not save any reports if no format is given', async () => {
    const report = await persistFlow(flow, basePersistOptions);
    expect(report.length).toBe(0);
  });

  // @TODO Make a test to insure correct log is generated
  it('does not save any reports if only stdout', async () => {
    const persistFlowOptions: PersistFlowOptions = { ...basePersistOptions, format: [REPORT_FORMAT.Stdout] };
    const report = await persistFlow(flow, persistFlowOptions);
    expect(report.length).toBe(0);
  });

  it('saves the report in json format only if its the only format given', async () => {
    const persistFlowOptions: PersistFlowOptions = { ...basePersistOptions, format: [REPORT_FORMAT.JSON] };
    const report = await persistFlow(flow, persistFlowOptions);
    expect(report.length).toBe(1);
    expect(report.at(0)?.endsWith('.json')).toBe(true);
    const reportPath = join(pathToRepoRoot, report.at(0)!);
    expect(existsSync(reportPath)).toBe(true);
    expect(readFileSync(reportPath,{encoding: 'utf-8'})).toMatchSnapshot();
  });


  it('saves the report in html format only if its the only format given', async () => {
    const persistFlowOptions: PersistFlowOptions = { ...basePersistOptions, format: [REPORT_FORMAT.HTML] };
    const report = await persistFlow(flow, persistFlowOptions);
    expect(report.length).toBe(1);
    expect(report.at(0)?.endsWith(REPORT_FORMAT.HTML)).toBe(true);
    const reportPath = join(pathToRepoRoot, report.at(0)!);
    expect(existsSync(reportPath)).toBe(true);
    expect(readFileSync(reportPath,{encoding: 'utf-8'})).toMatchSnapshot();
  });

  it('saves the report in markdown format only if its the only format given', async () => {
    const persistFlowOptions: PersistFlowOptions = { ...basePersistOptions, format: [REPORT_FORMAT.Markdown] };
    const report = await persistFlow(flow, persistFlowOptions);
    expect(report.length).toBe(1);
    expect(report.at(0)?.endsWith(REPORT_FORMAT.Markdown)).toBe(true);
    const reportPath = join(pathToRepoRoot, report.at(0)!);
    expect(existsSync(reportPath)).toBe(true);
    const reportData = readFileSync(reportPath,{encoding: 'utf-8'})
    expect(reportData.replace(/\*\*.*?\*\*/g, '**DATE_PLACEHOLDER**')).toMatchSnapshot();
  });

  it('saves the report in the format given excluding stdout', async () => {
    const persistFlowOptions: PersistFlowOptions = {
      ...basePersistOptions,
      format: [REPORT_FORMAT.Markdown, REPORT_FORMAT.Stdout]
    };
    const report = await persistFlow(flow, persistFlowOptions);
    expect(report.length).toBe(1);
    expect(report.at(0)?.endsWith(REPORT_FORMAT.Markdown)).toBe(true);
    const reportPath = join(pathToRepoRoot, report.at(0)!);
    expect(existsSync(reportPath)).toBe(true);
    const reportData = readFileSync(reportPath,{encoding: 'utf-8'})
    expect(reportData.replace(/\*\*.*?\*\*/g, '**DATE_PLACEHOLDER**')).toMatchSnapshot();
  });

  it('saves the report in json, md and html', async () => {
    const persistFlowOptions: PersistFlowOptions = {
      ...basePersistOptions,
      format: [
        REPORT_FORMAT.Markdown,
        REPORT_FORMAT.JSON,
        REPORT_FORMAT.HTML
      ]
    };
    const reports = await persistFlow(flow, persistFlowOptions);
    expect(reports.length).toBe(3);
  });

});
