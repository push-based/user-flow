import { CollectArgvOptions, DEFAULT_RC_NAME, GlobalOptionsArgv, SANDBOX_PRESET } from '@push-based/user-flow';
import { SANDBOX_BASE_RC_JSON, UserFlowCliProject, UserFlowCliProjectFactory } from '@push-based/user-flow-cli-testing';
import { EMPTY_PRJ_CFG, INITIATED_PRJ_CFG } from 'test-data';
import { expectInitOptionsToBeContainedInStdout } from '../../jest/expect.init';

let emptyPrj: UserFlowCliProject;

describe('init command configuration in empty sandbox', () => {

  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(EMPTY_PRJ_CFG);
    }
    await emptyPrj.setup();
  });

  afterEach(async () => {
    await emptyPrj.teardown();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await emptyPrj.$init();

    // @NOTICE formats are in the preset but not used as default param
    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    const { dryRun, openReport, format, ...initOptions } = rest as any;
    expectInitOptionsToBeContainedInStdout(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});

let initializedPrj: UserFlowCliProject;

describe('init command configuration in setup sandbox', () => {

  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$init();
    const { collect, persist, assert } = SANDBOX_BASE_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    // openReport is not part of the init options
    delete (cfg as any).openReport;
    expectInitOptionsToBeContainedInStdout(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters and save it to json file', async () => {
    const collect = {
      url: 'http://www.xxx.xx',
      ufPath: 'xxxufPath'
      // note: complicated to implement
      // serveCommand: 'xxxstart',
      // awaitServeStdout: 'xxxawaitServeStdout'
    };

    const persist: any = {
      outPath: 'xxxoutPath',
      format: ['md']
    };

    const assert: any = {
      budgetPath: 'XXXXXX.json'
    };

    const { url, ufPath } = collect;
    let { outPath, format } = persist;
    let { budgetPath } = assert;

    const { exitCode, stdout, stderr } = await initializedPrj.$init({
        // -- collect
        url,
        ufPath,
        // serveCommand,
        // awaitServeStdout,
        // -- persist
        outPath,
        format,
        // -- assert
        budgetPath
      } as any,
      ['n']
    );

    const cfg = {
      ...collect,
      ...persist,
      ...assert
    };

    expectInitOptionsToBeContainedInStdout(stdout, cfg);
    const hardRc = initializedPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual({ collect, persist, assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});
