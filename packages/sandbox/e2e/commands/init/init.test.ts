import {
  ENTER,
  SANDBOX_BASE_RC_JSON,
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  withUserFlowProject,
} from '@push-based/user-flow-cli-testing';
import {expectCliToCreateRc, expectOutputRcInStdout} from '../../jest/expect';
import {
  expectNoPromptsOfInitInStdout,
  expectPromptsOfInitInStdout,
} from '../../jest/expect.init';
import {EMPTY_PRJ_CFG, INITIATED_PRJ_CFG} from 'test-data';
import { join } from 'path';
import { existsSync } from 'fs';

let emptyPrj: UserFlowCliProject;
const cwd = process.cwd();

describe('init command in empty sandbox', () => {
  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(EMPTY_PRJ_CFG);
    }
    await emptyPrj.setup();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
  });

  it('should generate a user-flow for basic navigation after the CLI is setup', async () => {
    const { exitCode, stdout, stderr } = await emptyPrj.$init({}, [
      // url
      ENTER,
      // ufPath
      ENTER,
      // html default format
      ENTER,
      ENTER,
    ]);

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);

    expect(exitCode).toBe(0);

    //
    // expectEnsureConfigToCreateRc(emptyPrj.rcFilePath);
  }, 40_000);

  it('should throw missing url error', async () => {
    const { exitCode, stdout, stderr } = await emptyPrj.$init({
      interactive: false,
      url: '',
    });

    expect(stderr).toContain('URL is required');
    expect(exitCode).toBe(1);
  }, 40_000);
});

let initializedPrj: UserFlowCliProject;
const expectedFilePath = join('.github', 'workflows', 'user-flow-ci.yml');

describe('init command in setup sandbox', () => {
  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(
        INITIATED_PRJ_CFG
      );
    }
    await initializedPrj.setup();
    process.chdir(INITIATED_PRJ_CFG.root);
  });
  afterEach(async () => {
    await initializedPrj.teardown();
    process.chdir(cwd);
  });

  it(
    'should inform about the already existing cli-setup',
    withUserFlowProject(INITIATED_PRJ_CFG, async () => {
      const {exitCode, stdout, stderr} = await initializedPrj.$init({});

      // Assertions

      // STDOUT
      // prompts
      expectNoPromptsOfInitInStdout(stdout);
      // setup log
      expectOutputRcInStdout(stdout, SANDBOX_BASE_RC_JSON);

      expect(stderr).toBe('');
      expect(exitCode).toBe(0);

      // file output
      expectCliToCreateRc(initializedPrj, SANDBOX_BASE_RC_JSON);
    })
  );

  it(
    'should create a workflow if `--generateGhWorkflow is used` ',
    withUserFlowProject(
      {
        ...INITIATED_PRJ_CFG,
        delete: [expectedFilePath].concat(INITIATED_PRJ_CFG.delete || []),
      },
      async (prj) => {
        const workflowPath = join(process.cwd(), expectedFilePath);
        expect(existsSync(workflowPath)).toBeFalsy();
        const {exitCode, stderr} = await prj.$init({
          generateGhWorkflow: true,
        });
        expect(existsSync(workflowPath)).toBeTruthy();
        expect(stderr).toBe('');
        expect(exitCode).toBe(0);
      }
    )
  );
});
