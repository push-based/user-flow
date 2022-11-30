import { SETUP_SANDBOX_REMOTE_RC_NAME } from '../../fixtures/setup-sandbox';
import { expectCollectLogsReportByDefault } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';
import { REMOTE_PRJ_CFG } from '../../fixtures/sandbox/remote';
import {
  expectCollectCommandCreatesHtmlReport,
  expectCollectCommandCreatesJsonReport, expectCollectCommandCreatesMdReport
} from '../../utils/cli-testing/user-flow-cli-project/expect';
import {
  REMOTE_HTML_REPORT_NAME,
  REMOTE_JSON_REPORT_NAME,
  REMOTE_MD_REPORT_NAME
} from '../../fixtures/rc-files/remote';
import { REMOTE_USERFLOW_TITLE } from '../../fixtures/user-flows/remote.uf';

let setupRemotePrj: UserFlowCliProject;

const uf1Name = 'Sandbox Setup UF1';

describe('collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!setupRemotePrj) {
      setupRemotePrj = await UserFlowCliProjectFactory.create(REMOTE_PRJ_CFG);
    }
    await setupRemotePrj.setup();
  });
  afterEach(async () => await setupRemotePrj.teardown());


  it('should save the results as a HTML file', async () => {
    const { exitCode, stderr } = await setupRemotePrj.$collect({
      format: ['html']
    });

    expect(stderr).toBe('');
    // Check report file and content of report
    expectCollectCommandCreatesHtmlReport(setupRemotePrj, REMOTE_HTML_REPORT_NAME, REMOTE_USERFLOW_TITLE);
    expect(exitCode).toBe(0);
  }, 90_000);

  it('should save the results as a JSON file', async () => {
    const { exitCode, stderr } = await setupRemotePrj
      .$collect({ format: ['json'] });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCommandCreatesJsonReport(setupRemotePrj, REMOTE_JSON_REPORT_NAME, REMOTE_USERFLOW_TITLE);
  }, 90_000);

  it('should save the results as a Markdown file', async () => {
    const { exitCode, stderr } = await setupRemotePrj
      .$collect({
        // @TODO provide proper mock data for the json report so md also works in dryRun
        dryRun: false, format: ['md']
      });

    expect(stderr).toBe('');
    // Check report file and content of report
    expectCollectCommandCreatesMdReport(setupRemotePrj, REMOTE_MD_REPORT_NAME, REMOTE_USERFLOW_TITLE);
    expect(exitCode).toBe(0);
  }, 90_000);

  it('should log to stdout if stdout is', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({
      dryRun: false, format: ['stdout']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectLogsReportByDefault(stdout, uf1Name);
  }, 180_000);

});
