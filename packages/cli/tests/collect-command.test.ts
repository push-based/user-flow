import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH,
  EMPTY_SANDBOX_PATH,
  SETUP_SANDBOX_PATH,
  DEFAULT_USER_FLOW_RC_JSON,
  SETUP_SANDBOX_RC,
  SETUP_SANDBOX_STATIC_RC,
  STATIC_USER_FLOW_RC_JSON,
  STATIC_USER_FLOW_RC_JSON_NAME
} from './fixtures';
import * as fs from 'fs';

import * as path from 'path';
import { UserFlowRcConfig } from '@push-based/user-flow/cli';
import { CLI_MODE_PROPERTY } from '../src/lib/cli-modes';
import { resetSetupSandbox } from './utils';

const CLI_SETUP_TEST_CFG = {
  testPath: SETUP_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX'
};
const defaultCommand = [CLI_PATH];
const collectCommand = [CLI_PATH, 'collect'];

const uf1Name = 'Sandbox Setup UF1';
const ufStaticName = 'Sandbox Setup StaticDist';
const ufPathRemote = path.join('./src/lib/user-flows-remote-url');
const ufPathStatic = path.join('./src/lib/user-flows-static-dist');
const uf1OutPath = path.join(SETUP_SANDBOX_PATH, DEFAULT_USER_FLOW_RC_JSON.persist.outPath, 'sandbox-setup-uf1.uf.html');
const ufStaticOutPath = path.join(SETUP_SANDBOX_PATH, STATIC_USER_FLOW_RC_JSON.persist.outPath, 'sandbox-setup-static-dist.uf.html');

describe('collect command', () => {
  beforeEach(() => resetSetupSandbox());

  it('should be default', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      defaultCommand,
      [],
      {
        ...CLI_SETUP_TEST_CFG,
        // we use the empty command to stop collecting at the beginning as we just test id the default fallback works
        testPath: EMPTY_SANDBOX_PATH
      }
    );

    expect(exitCode).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toContain('Error: ufPath: undefined is no directory');

  });
});

describe('collect command in empty sandbox', () => {
  beforeEach(() => resetSetupSandbox());

  it('should throw missing url error', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '--url=', `-p=./${STATIC_USER_FLOW_RC_JSON_NAME}`, '-v'],
      [cliPromptTest.ENTER],
      CLI_SETUP_TEST_CFG
    );

    expect(stderr).toContain('URL is required. Either through the console as `--url` or in the `.user-flow.json`');
    expect(exitCode).toBe(1);
    expect(stdout).toBe('');

  }, 40_000);

});

describe('collect command in setup sandbox', () => {
  beforeEach(() => {
    resetSetupSandbox();
  });
  it('should exit if wrong ufPath is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommand,
        `-p=./${STATIC_USER_FLOW_RC_JSON_NAME}`,
        `--ufPath=WRONG`
      ],
      [cliPromptTest.ENTER],
      CLI_SETUP_TEST_CFG
    );
    expect(stdout).toBe('');
    expect(stderr).toContain(`Error ufPath: `);
    expect(exitCode).toBe(1);
  });

  it('should load ufPath and execute the user-flow in dryRun', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '-v', `-p=${STATIC_USER_FLOW_RC_JSON_NAME}`, `--ufPath=${ufPathStatic}`, '--dryRun'],
      [cliPromptTest.ENTER],
      CLI_SETUP_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(`Collect: ${ufStaticName} from URL ${STATIC_USER_FLOW_RC_JSON.collect.url}`);
    expect(stdout).toContain(`flow#navigate: ${STATIC_USER_FLOW_RC_JSON.collect.url}`);
    expect(stdout).toContain(`Duration: ${ufStaticName}`);
    expect(exitCode).toBe(0);

  }, 40_000);

  it('should load ufPath and execute the user-flow with verbose information', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      // dryRun is here to get faster tests
      [...collectCommand,`-p=${STATIC_USER_FLOW_RC_JSON_NAME}`, `--ufPath=${ufPathStatic}`, '--dryRun'],
      [cliPromptTest.ENTER],
      CLI_SETUP_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).not.toContain(`Collect: ${ufStaticName} from URL ${STATIC_USER_FLOW_RC_JSON.collect.url}`);
    expect(stdout).not.toContain(`flow#navigate: ${DEFAULT_USER_FLOW_RC_JSON.collect.url}`);
    expect(stdout).not.toContain(`Duration: ${ufStaticName}`);
    expect(exitCode).toBe(0);

    // Check report file is not created
    try {
      fs.readFileSync(uf1OutPath).toString('utf8');
    } catch (e: any) {
      expect(e.message).toContain('no such file or directory');
    }

  }, 40_000);

  // @TODO use remote location config
  it('should load ufPath, execute the user-flow and save the file', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `-p=${STATIC_USER_FLOW_RC_JSON_NAME}`, `--url=https://google.com`, `--ufPath=${ufPathStatic}`,'-v'],
      [],
      CLI_SETUP_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(`Collect: ${uf1Name} from URL ${DEFAULT_USER_FLOW_RC_JSON.collect.url}`);
    expect(stdout).toContain(`Duration: ${uf1Name}`);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    const reportHTML = fs.readFileSync(uf1OutPath).toString('utf8');
    expect(reportHTML).toBeTruthy();
    expect(reportHTML).toContain(`${uf1Name}`);


  }, 90_000);


  it('should use serve command and pass the test including output', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `-p=./${STATIC_USER_FLOW_RC_JSON_NAME}`],
      [],
      CLI_SETUP_TEST_CFG
    );


    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    const reportHTML = fs.readFileSync(ufStaticOutPath).toString('utf8');
    expect(reportHTML).toBeTruthy();
    expect(reportHTML).toContain(`${ufStaticName}`);


  }, 90_000);

});
