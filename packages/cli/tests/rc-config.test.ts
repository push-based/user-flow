import * as fs from 'fs';
import * as path from 'path';
import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH,
  CUSTOM_USER_FLOW_RC_JSON,
  DEFAULT_USER_FLOW_RC_JSON, EMPTY_SANDBOX_PATH, EMPTY_SANDBOX_RC, SETUP_CONFIRM,
  SETUP_SANDBOX_PATH, SETUP_SANDBOX_RC, SETUP_SANDBOX_WRONG_RC,
  USER_FLOW_RC_JSON_NAME, USER_FLOW_RC_WRONG_JSON_NAME
} from './fixtures';
import { CLI_MODE_PROPERTY } from '../src/lib/cli-modes';

const CLI_PROMPT_TEST_CFG = {
  testPath: SETUP_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX',
}
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
      [...initCommand, `-p=${USER_FLOW_RC_WRONG_JSON_NAME}`],
      [cliPromptTest.ENTER],
      CLI_PROMPT_TEST_CFG
    );

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_WRONG_RC) as any);

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(SETUP_CONFIRM);
    expect(stdout).toContain(`Update config under ${USER_FLOW_RC_WRONG_JSON_NAME}`);
    expect(stdout).toContain(`url: '${config.collect.url}', ufPath: '${config.collect.ufPath}'`);
    expect(stdout).toContain(`persist: { outPath: '${config.persist.outPath}' }`);

  });
  it('should log and ask if specified file does not exist', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=wrong/path/to/file.json`],
      [],
      CLI_PROMPT_TEST_CFG
    );

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_WRONG_RC) as any);

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('wrong/path/to/file.json does not exist');

  });
});
