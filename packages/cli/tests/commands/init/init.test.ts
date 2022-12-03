import { ENTER } from '../../utils/cli-testing/process/keyboard';

import { expectOutputRcInStdout } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../../user-flow-cli-project/user-flow-cli';
import {
  expectCliToCreateRc,
  expectNoPromptsInStdout,
  expectPromptsOfInitInStdout
} from '../../../user-flow-cli-project/expect';
import { EMPTY_PRJ_CFG } from '../../fixtures/sandbox/empty';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';
import { SANDBOX_BASE_RC_JSON } from '../../../user-flow-cli-project/data/user-flowrc.base';

let emptyPrj: UserFlowCliProject;

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
      ENTER
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
      url: ''
    });

    expect(stderr).toContain('URL is required');
    expect(exitCode).toBe(1);

  }, 40_000);


});

let initializedPrj: UserFlowCliProject;

describe('init command in setup sandbox', () => {

  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should inform about the already existing cli-setup', async () => {

    const { exitCode, stdout, stderr } = await initializedPrj.$init({});

    // Assertions

    // STDOUT
    // prompts
    expectNoPromptsInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, SANDBOX_BASE_RC_JSON);

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // file output
    expectCliToCreateRc(initializedPrj, SANDBOX_BASE_RC_JSON);
  });

});

