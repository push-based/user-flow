import * as path from 'path';
import {persistFlow} from "../../src/lib/commands/collect/utils/user-flow";

import * as LHR9 from '../data/lhr-9.json';
import FlowResult from "lighthouse/types/lhr/flow";
import {EMPTY_SANDBOX_PATH, resetEmptySandbox} from "../fixtures/empty-sandbox";
import {DEFAULT_PERSIST_OUT_PATH} from "../../src/lib/commands/collect/options/outPath.constant";

export class UserFlowReportMock {
  constructor() {}

  getFlowResult(): FlowResult | any {
    return '';
  }

  createFlowResult(): FlowResult | any {
    return LHR9;
  }

  generateReport(): Promise<string> | any{
    return '';
  }
}

const flow = new UserFlowReportMock();

const PERSIST_PATH = path.join(EMPTY_SANDBOX_PATH, DEFAULT_PERSIST_OUT_PATH);

describe('persist flow reports in specified format', () => {

  beforeEach(async () => await resetEmptySandbox())
  afterEach(async () => await resetEmptySandbox())

  it(' does not save any reports if no format is given', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: []}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);

    expect(filenames).toStrictEqual([]);
  });

  it('does not save any reports if only stdout', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: ['stdout']}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);

    expect(filenames).toStrictEqual([]);
  });

  it('saves the report in json format only if its the only format given', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: ['json']}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);
    console.log(PERSIST_PATH)
    expect(filenames).toStrictEqual([PERSIST_PATH + '/flow-name.uf.json']);
  });

  it('saves the report in html format only if its the only format given', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: ['html']}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);
    console.log(PERSIST_PATH)
    expect(filenames).toStrictEqual([PERSIST_PATH + '/flow-name.uf.html']);
  });

  it('saves the report in markdown format only if its the only format given', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: ['md']}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);

    expect(filenames).toStrictEqual([PERSIST_PATH + '/flow-name.uf.md']);
  });

  it('saves the report in the format given excluding stdout', async () => {

    const persistOptions = {outPath: PERSIST_PATH, format: ['md', 'stdout']}
    const filenames = await persistFlow(flow, 'flow-name', persistOptions);

    expect(filenames).toStrictEqual([PERSIST_PATH + '/flow-name.uf.md']);
  });
});
