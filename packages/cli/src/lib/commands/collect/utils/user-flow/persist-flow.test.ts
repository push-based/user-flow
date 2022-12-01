import { join } from 'path';
import { persistFlow } from './persist-flow';
import { ReportFormat } from '../../options/types';
import {
  PRJ_BASE_RC_JSON,
  UserFlowCliProject,
  UserFlowCliProjectConfig,
  UserFlowCliProjectFactory
} from '../../../../../../user-flow-testing';
import { INITIATED_PRJ_CFG } from '../../../../../../test-data/initialized-prj';
import { DEFAULT_RC_NAME } from '../../../../constants';
import { expectPersistedReports } from '../../../../../../user-flow-testing/expect';
import { UserFlowReportMock } from '../../../../../../user-flow-testing/user-flow.mock';

const flow = new UserFlowReportMock();

let initializedPrj: UserFlowCliProject;
let initializedPrjCfg = (format: ReportFormat[], flowName: string) => ({
  ...INITIATED_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: {
      ...PRJ_BASE_RC_JSON,
      persist: {
        ...PRJ_BASE_RC_JSON.persist,
        format
      }
    }
  },
  create: {
    [join(PRJ_BASE_RC_JSON.collect.ufPath, flowName)]: ''
  }
} as UserFlowCliProjectConfig);

const flowName = 'lhr-9.uf.ts';
const flowTitle = 'lhr-9';

describe('persist flow reports in specified format', () => {

  it('does not save any reports if no format is given', async () => {
    const format: ReportFormat[] = [];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('does not save any reports if only stdout', async () => {
    const format: ReportFormat[] = ['stdout'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('saves the report in json format only if its the only format given', async () => {
    const format: ReportFormat[] = ['json'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('saves the report in html format only if its the only format given', async () => {
    const format: ReportFormat[] = ['html'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('saves the report in markdown format only if its the only format given', async () => {
    const format: ReportFormat[] = ['md'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('saves the report in the format given excluding stdout', async () => {
    const format: ReportFormat[] = ['md', 'stdout'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });

  it('saves the report in json, md and html', async () => {
    const format: ReportFormat[] = ['json', 'md', 'html'];
    initializedPrj = await UserFlowCliProjectFactory.create(initializedPrjCfg(format, flowName));
    await initializedPrj.setup();
    const reportNames = await persistFlow(flow, flowTitle, initializedPrj.readRcJson().persist);
    expectPersistedReports(initializedPrj, reportNames);
    await initializedPrj.teardown();
  });
});
