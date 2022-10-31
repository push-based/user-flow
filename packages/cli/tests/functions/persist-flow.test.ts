import {join} from 'path';
import {readFileSync, readdirSync} from "fs";
import FlowResult from "lighthouse/types/lhr/flow";
import {EMPTY_SANDBOX_PATH, resetEmptySandbox} from "../fixtures/empty-sandbox";
import {DEFAULT_PERSIST_OUT_PATH} from "../../src/lib/commands/collect/options/outPath.constant";
import * as LHR9JSON from '../data/lhr-9.json';
import { persistFlow } from '../../src/lib/commands/collect/utils/user-flow/persist-flow';

const jsonReport = LHR9JSON as unknown as FlowResult;

const path = join(__dirname, '../data/lhr-9.html');
const htmlReport = readFileSync(path, 'utf-8');


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

const PERSIST_PATH = join(EMPTY_SANDBOX_PATH, DEFAULT_PERSIST_OUT_PATH);
const flowName = 'flow-example-name';

function expectPersistedReports(reports: string[], path: string, name: string, format: string[]) {
  const expectedFileNames = format.filter((f) => f !== 'stdout')
    .map(f => `${name}.uf.${f}`) || [];
  const expectedPaths = expectedFileNames.map((f) => join(PERSIST_PATH , f));

  expect(reports.sort()).toEqual(expectedPaths.sort());

  const persistedReports = readdirSync(PERSIST_PATH);
  expect(persistedReports.sort()).toEqual(expectedFileNames.sort());
}

describe('persist flow reports in specified format', () => {

  beforeEach(async () => await resetEmptySandbox())
  afterEach(async () => await resetEmptySandbox())

  it('does not save any reports if no format is given', async () => {
    const format = [];
    const persistOptions = {outPath: PERSIST_PATH, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('does not save any reports if only stdout', async () => {
    const format = ['stdout'];
    const persistOptions = {outPath: PERSIST_PATH, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('saves the report in json format only if its the only format given', async () => {
    const format = ['json'];
    const persistOptions = {outPath: PERSIST_PATH, format}
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('saves the report in html format only if its the only format given', async () => {
    const format = ['html']
    const persistOptions = {outPath: PERSIST_PATH, format}
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('saves the report in markdown format only if its the only format given', async () => {
    const format = ['md'];
    const persistOptions = {outPath: PERSIST_PATH, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('saves the report in the format given excluding stdout', async () => {
    const format = ['md', 'stdout'];
    const persistOptions = {outPath: PERSIST_PATH, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });

  it('saves the report in json, md and html', async () => {
    const format = ['json', 'md', 'html'];
    const persistOptions = {outPath: PERSIST_PATH, format};
    const report = await persistFlow(flow, flowName, persistOptions);

    expectPersistedReports(report, PERSIST_PATH, flowName, format);
  });
});
