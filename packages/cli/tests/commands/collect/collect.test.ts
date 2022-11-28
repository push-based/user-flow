import * as path from 'path';
import { join } from 'path';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectCollectCreatesHtmlReport,
  expectCollectCreatesJsonReport,
  expectCollectCreatesMdReport,
  expectCollectNoLogsFromMockInStdout,
  expectCollectNotToCreateAReport
} from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { REMOTE_RC_JSON, REMOTE_RC_NAME } from '../../fixtures/rc-files/remote-url';
import { STATIC_RC_JSON, STATIC_RC_NAME } from '../../fixtures/rc-files/static-app';
import { ORDER_COFFEE_USERFLOW_CONTENT, ORDER_COFFEE_USERFLOW_NAME } from '../../fixtures/user-flows/order-coffee.uf';

const setupStaticPrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    [STATIC_RC_NAME]: STATIC_RC_JSON
  },
  create: {
    [join(STATIC_RC_JSON.collect.ufPath, ORDER_COFFEE_USERFLOW_NAME)]: ORDER_COFFEE_USERFLOW_CONTENT
  }
};
let setupStaticPrj: UserFlowCliProject;
const setupRemotePrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    // @TODO as we bootstrap sequential we could use the default rc name and reduce the params in the tests
    [REMOTE_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [join(REMOTE_RC_JSON.collect.ufPath, ORDER_COFFEE_USERFLOW_NAME)]: ORDER_COFFEE_USERFLOW_CONTENT
  }
};
let setupRemotePrj: UserFlowCliProject;


const uf1Name = 'Sandbox Setup UF1';
const uf1OutPathJson = path.join(
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  'sandbox-setup-uf1.uf.json'
);
const uf1OutPathMd = path.join(
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  'sandbox-setup-uf1.uf.md'
);

const ufStaticName = 'Sandbox Setup StaticDist';
const uf1OutPathHtml = path.join(
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  'sandbox-setup-uf1.uf.html'
);

describe('collect command in setup sandbox with a static served app', () => {

  beforeEach(async () => {
    if (!setupStaticPrj) {
      setupStaticPrj = await UserFlowCliProjectFactory.create(setupStaticPrjCfg);
    }
    await setupStaticPrj.setup();
  });
  afterEach(async () => await setupStaticPrj.teardown());

  it('should load ufPath and execute the user-flow with verbose=false and save the report', async () => {
    const { exitCode, stdout, stderr } = await setupStaticPrj.$collect({
      rcPath: SETUP_SANDBOX_STATIC_RC_NAME,
      ufPath: SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath,
      verbose: false
    });

    expect(stderr).toBe('');
    expectCollectNoLogsFromMockInStdout(
      stdout,
      ufStaticName,
      SETUP_SANDBOX_STATIC_RC_JSON
    );
    expect(exitCode).toBe(0);

    expectCollectNotToCreateAReport(uf1OutPathHtml);
  }, 120_000);
});
describe('collect command in setup sandbox with a remote served app', () => {

  beforeEach(async () => {
    if (!setupRemotePrj) {
      setupRemotePrj = await UserFlowCliProjectFactory.create(setupRemotePrjCfg);
    }
    await setupRemotePrj.setup();
  });
  afterEach(async () => await setupRemotePrj.teardown());


  it('should load ufPath, execute the user-flow on a remote URL and save the results as a HTML file', async () => {
    const { exitCode, stderr } = await setupRemotePrj.$collect({
      rcPath: REMOTE_RC_NAME,
      dryRun: false,
      format: ['html']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCreatesHtmlReport(uf1OutPathHtml, uf1Name);
  }, 90_000);

  it('should load ufPath, execute the user-flow on a remote URL and save the results as a JSON file', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({ rcPath: REMOTE_RC_NAME });
    expect(stderr).toBe('');
    // expect(stdout).toBe('');
    // expectCollectLogsFromMockInStdout(stdout, uf1Name, SETUP_SANDBOX_REMOTE_RC_JSON);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCreatesJsonReport(uf1OutPathJson, uf1Name);
  }, 90_000);

  it('should load ufPath, execute the user-flow on a remote URL and save the results as a Markdown file', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({
      rcPath: REMOTE_RC_NAME,
      dryRun: false, format: ['md']
    });

    //expect(stdout).toBe('')
    expect(stderr).toBe('');
    // expectCollectLogsFromMockInStdout(stdout, uf1Name, SETUP_SANDBOX_REMOTE_RC_JSON);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCreatesMdReport(uf1OutPathMd, uf1Name);
  }, 90_000);

});
