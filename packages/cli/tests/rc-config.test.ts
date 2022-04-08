import * as fs from 'fs';
import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH
} from './fixtures/cli-bin-path';
import {
  resetEmptySandbox, EMPTY_SANDBOX_CLI_TEST_CFG
} from './fixtures/empty-sandbox';

import {
  resetSetupSandbox,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_NAME,
  SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from './fixtures/setup-sandbox';
import { INIT_COMMAND__ASK_URL, INIT_COMMAND__SETUP_CONFIRM } from './fixtures/cli-prompts';
import { expectOutputRcInStdout } from './utils/cli-expectations';


const initCommand = [CLI_PATH, 'init', '-v'];

describe('.rc.json in empty sandbox', () => {
  beforeEach(() => {
    resetEmptySandbox();
  });
  afterEach(() => {
    resetEmptySandbox();
  });

  it('should validate params from cli', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--url=`
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    // expect(stdout).toBe('');
    expect(stderr).toContain(`URL is required. Either through the console as \`--url\` or in the \`.user-flow.json\``);

    expect(exitCode).toBe(1);
  });

});
describe('.rc.json in setup sandbox', () => {
  beforeEach(() => {
    resetSetupSandbox();
  });
  afterEach(() => {
    resetSetupSandbox();
  });
  it('should take params from cli', async () => {
    const { collect, persist } = SETUP_SANDBOX_STATIC_RC_JSON;
    const { url, ufPath, serveCommand, awaitServeStdout } = collect;
    let { outPath, format } = persist;
    let htmlFormat = format[0];

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        // collect
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        `--serveCommand=${serveCommand}`,
        `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        `--outPath=${outPath}`,
        `--format=${htmlFormat}`
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(stderr).toBe('');
    expect(stdout).toContain(`url: '${url}'`);
    expect(stdout).toContain(`serveCommand: '${serveCommand}'`);
    expect(stdout).toContain(`awaitServeStdout: '${awaitServeStdout}'`);
    expect(stdout).toContain(`ufPath: '${ufPath}'`);
    expect(stdout).toContain(`outPath: '${outPath}'`);
    expect(stdout).toContain(`format: [ '${htmlFormat}' ]`);
    expect(exitCode).toBe(0);
  });

  it('should load default RC config name in a setup project', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(`Update config under ${SETUP_SANDBOX_DEFAULT_RC_NAME}`);
    expectOutputRcInStdout(stdout, SETUP_SANDBOX_DEFAULT_RC_JSON);

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_DEFAULT_RC_PATH) as any);
    expect(config).toEqual(SETUP_SANDBOX_DEFAULT_RC_JSON);
  });

  it('should load configuration if specified rc file param -p is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=${SETUP_SANDBOX_STATIC_RC_NAME}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    const config = SETUP_SANDBOX_STATIC_RC_JSON;

    // Assertions
    expect(stderr).toBe('');
    expect(stdout).toContain(INIT_COMMAND__SETUP_CONFIRM);
    expect(stdout).toContain(`Update config under ${SETUP_SANDBOX_STATIC_RC_NAME}`);
    expect(stdout).toContain(`url: '${config.collect.url}'`);
    expect(stdout).toContain(`ufPath: '${config.collect.ufPath}'`);
    expect(stdout).toContain(`outPath: '${config.persist.outPath}'`);
    expect(stdout).toContain(`format: [ '${config.persist.format[0]}' ]`);
    expect(exitCode).toBe(0);
  });

  it('should validate params from rc', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--format=wrong`
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(stderr).toContain(`Wrong format "wrong"`);
    expect(exitCode).toBe(1);
  });

  it('should log and ask if specified rc file param -p does not exist', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=wrong/path/to/file.json`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('wrong/path/to/file.json does not exist');
  });

});
