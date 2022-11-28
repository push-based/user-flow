import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../../fixtures/empty-sandbox';
import { SETUP_SANDBOX_CLI_TEST_CFG } from '../../fixtures/setup-sandbox';

import { expectOutputRcInStdout, expectPromptsOfInitInStdout } from '../../utils/cli-expectations';
import { ERROR_PERSIST_FORMAT_WRONG } from '../../../src/lib/commands/collect/options/format.constant';
import { PROMPT_COLLECT_URL } from '../../../src/lib/commands/collect/options/url.constant';
import { ENTER } from '../../utils/cli-testing/process/keyboard';

import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import {
  CLI_DEFAULTS_RC_JSON,
  SANDBOX_BASE_RC_JSON
} from '../../utils/cli-testing/user-flow-cli-project/data/user-flowrc.base';
import { RcJson } from '@push-based/user-flow';
import { join } from 'path';
import {
  ORDER_COFFEE_USERFLOW_CONTENT,
  ORDER_COFFEE_USERFLOW_NAME,
  SETUP_1_USERFLOW_CONTENT,
  SETUP_1_USERFLOW_NAME
} from '../../fixtures/user-flows/order-coffee.uf';
import { SERVE_COMMAND_PORT } from '../../utils/cli-testing/user-flow-cli-project/constants';


const emptyPrjCfg: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
};
let emptyPrj: UserFlowCliProject;

const REMOTE_RC_NAME = '.user-flow.remote.json';
const REMOTE_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    ...SANDBOX_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

const STATIC_RC_NAME = '.user-flow.remote.json';
const STATIC_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    'url': 'http://127.0.0.1:' + SERVE_COMMAND_PORT,
    'ufPath': './src/lib/user-flows-static-dist',
    'serveCommand': 'npm run start',
    'awaitServeStdout': 'Available on:'
  },
  persist: {
    ...SANDBOX_BASE_RC_JSON.persist,
    'format': ['json']
  }
};


const setupPrjCfg: UserFlowProjectConfig = {
  verbose: true,
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    [DEFAULT_RC_NAME]: SANDBOX_BASE_RC_JSON,
    [REMOTE_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [join(SANDBOX_BASE_RC_JSON.collect.ufPath, ORDER_COFFEE_USERFLOW_NAME)]: ORDER_COFFEE_USERFLOW_CONTENT,
    [join(SANDBOX_BASE_RC_JSON.collect.ufPath, SETUP_1_USERFLOW_NAME)]: SETUP_1_USERFLOW_CONTENT
  }
};

let setupPrj: UserFlowCliProject;

describe('.rc.json in empty sandbox', () => {
  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(emptyPrjCfg);
    }
    await emptyPrj.setup();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
  });

  it('should take default params from prompt', async () => {

    const { exitCode, stdout, stderr } = await emptyPrj.$init({}, [
      //url
      ENTER,
      // ufPath
      ENTER,
      // HTML format
      ENTER,
      // outPath
      ENTER, ENTER,
      // create NO flow example
      'n'
    ]);

    // Assertions

    // STDOUT
    expect(stdout).toContain('.user-flowrc.json does not exist.');
    // prompts
    expectPromptsOfInitInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, CLI_DEFAULTS_RC_JSON);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    const hardRc = emptyPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual(CLI_DEFAULTS_RC_JSON);
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
      outPath, ENTER
    ]);

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);
    expect(exitCode).toBe(0);

    const hardRc = emptyPrj.readRcJson(DEFAULT_RC_NAME);
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

describe('.rc.json in setup sandbox', () => {

  beforeEach(async () => {
    if (!setupPrj) {
      setupPrj = await UserFlowCliProjectFactory.create(setupPrjCfg);
    }

    await setupPrj.setup();
  });
  afterEach(async () => {
    // await setupPrj.teardown();
  });


  it('should take params from cli', async () => {
    const { collect, persist } = STATIC_RC_JSON;
    const { url, ufPath, serveCommand, awaitServeStdout } = collect;
    let { outPath, format } = persist;
    let htmlFormat = format[0];

    const { exitCode, stdout, stderr } = await setupPrj.$init({
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
    const hardRc = setupPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual(STATIC_RC_JSON);
    expect(exitCode).toBe(0);
  });

  it('should load default RC config name in a setup project', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$init();
    // Assertions

    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, SANDBOX_BASE_RC_JSON);
    const hardRc = setupPrj.readRcJson(DEFAULT_RC_NAME);
    expect(hardRc).toEqual(SANDBOX_BASE_RC_JSON);
    expect(exitCode).toBe(0);
  });

  it('should load configuration if specified rc file param -p is given', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$init(
      { rcPath: REMOTE_RC_NAME },
      ['n']);

    // Assertions
    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, REMOTE_RC_JSON);
    expect(exitCode).toBe(0);
  });

  it('should validate params from rc', async () => {
    const wrongFormat = 'wrong';
    const { exitCode, stdout, stderr } = await setupPrj.$init({
      interactive: false,
      format: [wrongFormat as any]
    });

    // Assertions

    expect(stderr).toContain(ERROR_PERSIST_FORMAT_WRONG(wrongFormat));
    // expect(stdout).toBe('');
    expect(exitCode).toBe(1);
  });

  it('should log and ask if specified rc file param -p does not exist', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$init({ rcPath: 'wrong/path/to/file.json' });

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(PROMPT_COLLECT_URL);
  });

});
