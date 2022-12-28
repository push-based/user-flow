import { DEFAULT_RC_NAME, ERROR_PERSIST_FORMAT_WRONG, PROMPT_COLLECT_URL } from '@push-based/user-flow';
import { ACCEPT_BOOLEAN, DECLINE_BOOLEAN, ENTER } from '@push-based/cli-testing/process';
import {
  CLI_DEFAULT_RC_JSON,
  ENTER,
  SANDBOX_BASE_RC_JSON,
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '@push-based/user-flow-cli-testing';
import { EMPTY_PRJ_CFG, INITIATED_PRJ_CFG, REMOTE_PRJ_CFG, REMOTE_RC_JSON, STATIC_RC_JSON } from 'test-data';
import { expectOutputRcInStdout, expectPromptsOfInitInStdout } from '../../jest';

let emptyPrj: UserFlowCliProject;
let remotePrj: UserFlowCliProject;
let initializedPrj: UserFlowCliProject;

describe('.rc.json in empty sandbox', () => {
  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(EMPTY_PRJ_CFG);
    }
    await emptyPrj.setup();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
  });

  it('should take default params from prompt', async () => {

    const { exitCode, stdout, stderr } = await emptyPrj.$init({ verbose: true }, [
      //url
      ENTER,
      // ufPath
      ENTER,
      // HTML format
      ENTER,
      // outPath
      ENTER, ENTER,
      // create NO flow example
      DECLINE_BOOLEAN
    ]);

    // Assertions

    // STDOUT
    expect(stdout).toContain('.user-flowrc.json does not exist.');
    // prompts
    expectPromptsOfInitInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, CLI_DEFAULT_RC_JSON);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    const hardRc = emptyPrj.readRcJson();
    expect(hardRc).toEqual(CLI_DEFAULT_RC_JSON);
  });

  it('should take custom params from prompt', async () => {
    const { collect, persist } = STATIC_RC_JSON;
    const { url, ufPath } = collect;
    const { outPath } = persist;
    const { exitCode, stdout, stderr } = await emptyPrj.$init({}, [
      // url
      url, ENTER,
      // ufPath
      ufPath, ENTER,
      // html default format
      ENTER,
      // measures default folder
      outPath, ENTER,
      DECLINE_BOOLEAN
    ]);

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);
    expect(exitCode).toBe(0);
   const hardRc = emptyPrj.readRcJson();
    expect(hardRc).toEqual({
      collect: {
        url,
        ufPath
      },
      persist: { outPath, format: ['html'] },
      assert: {}
    });
  }, 40_000);

});

describe('.rc.json in initialized sandbox', () => {

  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }

    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should validate params from rc', async () => {
    const wrongFormat = 'wrong';
    const { exitCode, stdout, stderr } = await initializedPrj.$init({
      interactive: false,
      format: [wrongFormat as any]
    });

    // Assertions

    expect(stderr).toContain(ERROR_PERSIST_FORMAT_WRONG(wrongFormat));
    // expect(stdout).toBe('');
    expect(exitCode).toBe(1);
  });

  it('should log and ask if specified rc file param -p does not exist', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$init({ rcPath: 'wrong/path/to/file.json' });

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(PROMPT_COLLECT_URL);
  });

  it('should take params from cli', async () => {
    const { collect, persist } = STATIC_RC_JSON;
    const { url, ufPath, serveCommand, awaitServeStdout } = collect;
    let { outPath, format } = persist;
    let htmlFormat = format[0];

    const { exitCode, stdout, stderr } = await initializedPrj.$init({
        // collect
        url,
        ufPath,
        serveCommand,
        awaitServeStdout,
        // persist
        outPath,
        format: [htmlFormat]
      },
      ['n']);

    // Assertions
    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, STATIC_RC_JSON);
    const hardRc = initializedPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual(STATIC_RC_JSON);
    expect(exitCode).toBe(0);
  });

  it('should load default RC config name in a setup project', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$init();
    // Assertions

    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, SANDBOX_BASE_RC_JSON);
    const hardRc = initializedPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual(SANDBOX_BASE_RC_JSON);
    expect(exitCode).toBe(0);
  });
});

describe('.rc.json in remote sandbox', () => {

  beforeEach(async () => {
    if (!remotePrj) {
      remotePrj = await UserFlowCliProjectFactory.create(REMOTE_PRJ_CFG);
    }

    await remotePrj.setup();
  });
  afterEach(async () => {
    await remotePrj.teardown();
  });

  it('should load configuration if specified rc file param -p is given', async () => {
    const { exitCode, stdout, stderr } = await remotePrj.$init(
      { rcPath: DEFAULT_RC_NAME },
      ['n']);

    // Assertions
    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, REMOTE_RC_JSON);
    expect(exitCode).toBe(0);
  });

});
