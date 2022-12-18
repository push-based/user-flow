import { UserFlowCliProject, UserFlowCliProjectFactory } from '../../user-flow-cli-project';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';
import {
  expectCollectCommandCreatesHtmlReport,
  expectCollectCommandCreatesJsonReport,
  expectCollectCommandCreatesMdReport,
  expectCollectLogsReport
} from '../../user-flow-cli-project/jest/expect.collect.format';
import { STATIC_JSON_REPORT_NAME, STATIC_MD_REPORT_NAME } from '../../fixtures/rc-files/static';
import { STATIC_USERFLOW_NAME, STATIC_USERFLOW_TITLE } from '../../fixtures/user-flows/static.uf';

let setupRemotePrj: UserFlowCliProject;

describe('collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!setupRemotePrj) {
      setupRemotePrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
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
    expectCollectCommandCreatesHtmlReport(setupRemotePrj, STATIC_USERFLOW_NAME, STATIC_USERFLOW_TITLE);
    expect(exitCode).toBe(0);
  }, 90_000);

  it('should save the results as a JSON file', async () => {
    const { exitCode, stderr } = await setupRemotePrj
      .$collect({ format: ['json'] });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCommandCreatesJsonReport(setupRemotePrj, STATIC_JSON_REPORT_NAME, STATIC_USERFLOW_TITLE);
  }, 90_000);

  it('should save the results as a Markdown file', async () => {
    const { exitCode, stderr } = await setupRemotePrj
      .$collect({
        // @TODO provide proper mock data for the json report so md also works in dryRun
        dryRun: false, format: ['md']
      });

    expect(stderr).toBe('');
    // Check report file and content of report
    expectCollectCommandCreatesMdReport(setupRemotePrj, STATIC_MD_REPORT_NAME, STATIC_USERFLOW_TITLE);
    expect(exitCode).toBe(0);
  }, 90_000);

  it('should log to stdout if stdout is', async () => {
    const { exitCode, stdout, stderr } = await setupRemotePrj.$collect({
      dryRun: false, format: ['stdout']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectLogsReport(stdout, STATIC_USERFLOW_TITLE);
  }, 180_000);

});
