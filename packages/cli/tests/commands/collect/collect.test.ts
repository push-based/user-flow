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
  expectCollectCommandCreatesJsonReport,
  expectCollectCommandCreatesMdReport,
  expectCollectCommandNotToCreateReport,
  expectCollectCommandToCreateHtmlReport,
  expectCollectCommandNotToCreateLogsFromMockInStdout
} from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import {
  REMOTE_HTML_REPORT_NAME,
  REMOTE_JSON_REPORT_NAME,
  REMOTE_MD_REPORT_NAME,
  REMOTE_RC_JSON,
  REMOTE_RC_NAME,
  REMOTE_USERFLOW_PATH
} from '../../fixtures/rc-files/remote-url';
import {
  STATIC_HTML_REPORT_NAME,
  STATIC_JSON_REPORT_NAME,
  STATIC_RC_JSON,
  STATIC_RC_NAME
} from '../../fixtures/rc-files/static-app';
import { STATIC_USERFLOW_CONTENT, STATIC_USERFLOW_NAME } from '../../fixtures/user-flows/static-sandbox-setup.uf';
import { REMOTE_USERFLOW_CONTENT, REMOTE_USERFLOW_TITLE } from '../../fixtures/user-flows/remote-sandbox-setup.uf';

const setupStaticPrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    [STATIC_RC_NAME]: STATIC_RC_JSON
  },
  create: {
    [join(STATIC_RC_JSON.collect.ufPath, STATIC_USERFLOW_NAME)]: STATIC_USERFLOW_CONTENT
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
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  }
};
let setupRemotePrj: UserFlowCliProject;

const ufStaticName = 'Sandbox Setup StaticDist';

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
      verbose: false
    });

    expect(stderr).toBe('');
    // @TODO refactor to new helper
    expectCollectCommandNotToCreateLogsFromMockInStdout(
      stdout,
      ufStaticName,
      SETUP_SANDBOX_STATIC_RC_JSON
    );
    expect(exitCode).toBe(0);
    expectCollectCommandNotToCreateReport(setupStaticPrj, STATIC_JSON_REPORT_NAME, STATIC_RC_NAME);
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


  // @TODO move this tests into format's file
  it('should load ufPath, execute the user-flow on a remote URL and save the results as a HTML file', async () => {
    const { exitCode, stderr } = await setupRemotePrj.$collect({
      rcPath: REMOTE_RC_NAME,
      dryRun: false,
      format: ['html']
    });

    expect(stderr).toBe('');
    // Check report file and content of report
    expectCollectCommandToCreateHtmlReport(setupRemotePrj, REMOTE_HTML_REPORT_NAME, REMOTE_USERFLOW_TITLE, REMOTE_RC_NAME);
    expect(exitCode).toBe(0);
  }, 90_000);

  it('should load ufPath, execute the user-flow on a remote URL and save the results as a JSON file', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({ rcPath: REMOTE_RC_NAME, format: ['json'] });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCommandCreatesJsonReport(setupRemotePrj, REMOTE_JSON_REPORT_NAME, REMOTE_USERFLOW_TITLE, REMOTE_RC_NAME);
  }, 90_000);

  it('should load ufPath, execute the user-flow on a remote URL and save the results as a Markdown file', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({
      rcPath: REMOTE_RC_NAME,
      dryRun: false, format: ['md']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
    // Check report file and content of report
    expectCollectCommandCreatesMdReport(setupRemotePrj, REMOTE_MD_REPORT_NAME, REMOTE_USERFLOW_TITLE, REMOTE_RC_NAME);
  }, 90_000);

});
