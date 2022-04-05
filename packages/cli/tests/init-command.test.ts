import * as fs from 'fs';
import * as path from 'path';
import * as cliPromptTest from 'cli-prompts-test';
import {
  ASK_OUT_PATH,
  ASK_UF_PATH,
  ASK_URL,
  CLI_PATH,
  CUSTOM_USER_FLOW_RC_JSON,
  DEFAULT_USER_FLOW_RC_JSON, EMPTY_SANDBOX_PATH, EMPTY_SANDBOX_RC, SETUP_CONFIRM,
  SETUP_SANDBOX_PATH, SETUP_SANDBOX_RC
} from './fixtures';

const initCommand = [CLI_PATH, 'init'];
describe('init command in setup sandbox', () => {
  it('should inform about the already existing setup', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).not.toContain(ASK_URL);
    expect(stdout).not.toContain(ASK_UF_PATH);
    expect(stdout).not.toContain(ASK_OUT_PATH);
    expect(stdout).toContain(SETUP_CONFIRM);

    const config = JSON.parse(fs.readFileSync(SETUP_SANDBOX_RC) as any);
    expect(config).toEqual(CUSTOM_USER_FLOW_RC_JSON);
  });
});

describe('init command in empty sandbox', () => {

  afterEach(() => {
    fs.rm(EMPTY_SANDBOX_RC, () => void 0);
  });

  it('should generate a valid rc.json if we accept default values', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        'default-url', cliPromptTest.ENTER,
        cliPromptTest.ENTER,
        cliPromptTest.ENTER,
        cliPromptTest.ENTER,
      ],
      {
        testPath: EMPTY_SANDBOX_PATH
      }
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(ASK_URL);
    expect(stdout).toContain(ASK_UF_PATH);
    expect(stdout).toContain(ASK_OUT_PATH);
    expect(stdout).toContain(SETUP_CONFIRM);

    const config = JSON.parse(fs.readFileSync(EMPTY_SANDBOX_RC) as any);
    expect(config).toEqual(DEFAULT_USER_FLOW_RC_JSON)
  });

  it('should generate a valid rc.json if we answer with custom values', async () => {

    const { url, ufPath } = CUSTOM_USER_FLOW_RC_JSON.collect;
    const { outPath } = CUSTOM_USER_FLOW_RC_JSON.persist;
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        url, cliPromptTest.ENTER, cliPromptTest.ENTER,
        ufPath, cliPromptTest.ENTER,
        outPath, cliPromptTest.ENTER
      ],
      {
        testPath: EMPTY_SANDBOX_PATH,
        timeout: 500
      }
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(ASK_URL);
    expect(stdout).toContain(ASK_UF_PATH);
    expect(stdout).toContain(ASK_OUT_PATH);
    expect(stdout).toContain(SETUP_CONFIRM);

    const config = JSON.parse(fs.readFileSync(EMPTY_SANDBOX_RC) as any);
    expect(config).toEqual(CUSTOM_USER_FLOW_RC_JSON);
  }, 20_000);

});
