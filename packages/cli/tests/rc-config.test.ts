import * as fs from 'fs';
import * as path from 'path';
import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH,
  CUSTOM_USER_FLOW_RC_JSON, EMPTY_SANDBOX_PATH, SETUP_CONFIRM,
  SETUP_SANDBOX_PATH, SETUP_SANDBOX_RC, SETUP_SANDBOX_STATIC_RC,
  USER_FLOW_RC_JSON_NAME, USER_FLOW_RC_STATIC_JSON_NAME
} from './fixtures';
import { CLI_MODE_PROPERTY } from '../src/lib/cli-modes';

const CLI_PROMPT_TEST_CFG = {
  testPath: SETUP_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX'
};
const CLI_OPTIONS_TEST_CFG = {
  testPath: EMPTY_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX'
};
const initCommand = [CLI_PATH, 'init', '-v'];

describe('.rc.json in setup sandbox', () => {
  it('should load default name if no param is given', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [cliPromptTest.ENTER],
      CLI_PROMPT_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(SETUP_CONFIRM);
    expect(stdout).toContain(`Update config under ${USER_FLOW_RC_JSON_NAME}`);
    expect(stdout).toContain(`url: '${CUSTOM_USER_FLOW_RC_JSON.collect.url}', ufPath: '${CUSTOM_USER_FLOW_RC_JSON.collect.ufPath}'`);
    expect(stdout).toContain(`persist: { outPath: '${CUSTOM_USER_FLOW_RC_JSON.persist.outPath}' }`);

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_RC) as any);
    expect(config).toEqual(CUSTOM_USER_FLOW_RC_JSON);
  });
  it('should load specified file from given param', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=${USER_FLOW_RC_STATIC_JSON_NAME}`],
      [cliPromptTest.ENTER],
      CLI_PROMPT_TEST_CFG
    );

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_STATIC_RC) as any);

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(SETUP_CONFIRM);
    expect(stdout).toContain(`Update config under ${USER_FLOW_RC_STATIC_JSON_NAME}`);
    expect(stdout).toContain(`url: '${config.collect.url}', ufPath: '${config.collect.ufPath}'`);
    expect(stdout).toContain(`persist: { outPath: '${config.persist.outPath}' }`);

  });
  it('should take params from cli', async () => {
    const { collect, persist } = JSON.parse(fs.readFileSync(SETUP_SANDBOX_STATIC_RC) as any);
    const { url, ufPath, serveCommand, awaitServeStdout } = collect;
    let { outPath, format } = persist;
    format = format[0];

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        `--outPath=${outPath}`,
        `--format=${format}`,
        `--serveCommand=${serveCommand}`,
        `--awaitServeStdout=${awaitServeStdout}`
      ],
      [],
      CLI_OPTIONS_TEST_CFG
    );

    // Assertions
    expect(stderr).toBe('');
    expect(stdout).toContain(`url: '${url}'`);
    expect(stdout).toContain(`serveCommand: '${serveCommand}'`);
    expect(stdout).toContain(`awaitServeStdout: '${awaitServeStdout}'`);
    expect(stdout).toContain(`ufPath: '${ufPath}'`);
    expect(stdout).toContain(`outPath: '${outPath}'`);
    expect(stdout).toContain(`format: [ '${format}' ]`);
    expect(exitCode).toBe(0);
  });

  it('should validate params from cli', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--url=`
      ],
      [],
      CLI_OPTIONS_TEST_CFG
    );

    // Assertions
    // expect(stdout).toBe('');
    expect(stderr).toContain(`URL is required. Either through the console as \`--url\` or in the \`.user-flow.json\``);

    expect(exitCode).toBe(1);
  });
it('should validate params from rc', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--format=json`
      ],
      [],
      CLI_OPTIONS_TEST_CFG
    );

    // Assertions
    // expect(stdout).toBe('');
    expect(stderr).toContain(`Wrong format "wrong"`);

    expect(exitCode).toBe(1);
  });

  it('should log and ask if specified file does not exist', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=wrong/path/to/file.json`],
      [],
      CLI_PROMPT_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('wrong/path/to/file.json does not exist');

  });
});
