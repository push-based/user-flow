import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import {
  REMOTE_HTML_REPORT_NAME,
  REMOTE_JSON_REPORT_NAME,
  REMOTE_MD_REPORT_NAME
} from '../../fixtures/rc-files/remote-url';
import { REMOTE_USERFLOW_TITLE } from '../../fixtures/user-flows/remote-sandbox-setup.uf';
import { REMOTE_PRJ_CFG } from '../../fixtures/sandbox/remote';
import {
  expectCollectCommandCreatesHtmlReport,
  expectCollectCommandCreatesJsonReport, expectCollectCommandCreatesMdReport
} from '../../utils/cli-testing/user-flow-cli-project/expect';

let setupRemotePrj: UserFlowCliProject;

const ufStaticName = 'Sandbox Setup StaticDist';

describe('collect command in setup sandbox with a remote served app', () => {

  beforeEach(async () => {
    if (!setupRemotePrj) {
      setupRemotePrj = await UserFlowCliProjectFactory.create(REMOTE_PRJ_CFG);
    }
    await setupRemotePrj.setup();
  });
  afterEach(async () => await setupRemotePrj.teardown());

  // @TODO move this tests into format's file
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
    const { exitCode, stdout, stderr } = await setupRemotePrj
      .$collect({ format: ['json'] });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCommandCreatesJsonReport(setupRemotePrj, REMOTE_JSON_REPORT_NAME, REMOTE_USERFLOW_TITLE);
  }, 90_000);

  it('should save the results as a Markdown file', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj
      .$collect({ format: ['md'] });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
    // Check report file and content of report
    expectCollectCommandCreatesMdReport(setupRemotePrj, REMOTE_MD_REPORT_NAME, REMOTE_USERFLOW_TITLE);
  }, 90_000);

});
