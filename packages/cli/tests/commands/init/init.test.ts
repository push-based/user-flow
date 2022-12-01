import { expectOutputRcInStdout } from '../../utils/cli-expectations';
import { ENTER, PRJ_BASE_RC_JSON, UserFlowCliProject, UserFlowCliProjectFactory } from '../../../user-flow-testing';
import {
  expectCliToCreateRc,
  expectNoPromptsInStdout,
  expectPromptsOfInitInStdout
} from '../../../user-flow-testing/expect';
import { EMPTY_PRJ_CFG } from '../../../test-data/empty-prj';
import { INITIATED_PRJ_CFG } from '../../../test-data/initialized-prj';

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
    expectOutputRcInStdout(stdout, PRJ_BASE_RC_JSON);

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // file output
    expectCliToCreateRc(initializedPrj, PRJ_BASE_RC_JSON);
  });

});

