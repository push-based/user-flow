import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH,
  EMPTY_SANDBOX_PATH,
  SETUP_SANDBOX_PATH,
  SETUP_SANDBOX_RC,
  SETUP_SANDBOX_STATIC_RC,
  SETUP_SANDBOX_WRONG_RC, USER_FLOW_RC_STATIC_JSON_NAME,
  USER_FLOW_RC_WRONG_JSON_NAME
} from './fixtures';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';
import { UserFlowRcConfig } from '@push-based/user-flow/cli';

const defaultCommand = [CLI_PATH];
const collectCommand = [CLI_PATH, 'collect'];

const setupSandboxCfg = JSON.parse(fs.readFileSync(SETUP_SANDBOX_RC) as any);
const setupSandboxWrongCfg = JSON.parse(fs.readFileSync(SETUP_SANDBOX_WRONG_RC) as any);
const setupSandboxStaticDistCfg = JSON.parse(fs.readFileSync(SETUP_SANDBOX_STATIC_RC) as any);

const uf1Name = 'Sandbox Setup UF1';
const ufStaticName = 'Sandbox Setup Static Dist';
const uf1OutPath = path.join(SETUP_SANDBOX_PATH, setupSandboxCfg.persist.outPath, 'sandbox-setup-uf1.uf.html');
const ufStaticOutPath = path.join(SETUP_SANDBOX_PATH, setupSandboxStaticDistCfg.persist.outPath, 'sandbox-setup-static-dist.uf.html');

function cleanSetupOutputFolder(rootPath: string, cfg: UserFlowRcConfig) {
  rimraf(path.join(rootPath, cfg.persist.outPath), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

describe('collect command', () => {
  it('should be default', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      defaultCommand,
      [],
      {
        // we use the empty command to stop collecting at the beginning as we just test id the default fallback works
        testPath: EMPTY_SANDBOX_PATH
      }
    );

    expect(exitCode).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toContain('URL is required. Either through the console as `--url` or in the `.user-flow.json`');

  });
});
describe('collect command in empty sandbox', () => {
  it('should throw missing url error', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      collectCommand,
      [cliPromptTest.ENTER],
      {
        testPath: EMPTY_SANDBOX_PATH
      }
    );

    expect(exitCode).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toContain('URL is required. Either through the console as `--url` or in the `.user-flow.json`');

  });
});

describe('collect command in setup sandbox', () => {
  afterEach(() => {
    cleanSetupOutputFolder(SETUP_SANDBOX_PATH, setupSandboxCfg);
  });
  it('should exit if wrong ufPath is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...defaultCommand, `-p=./${USER_FLOW_RC_WRONG_JSON_NAME}`],
      [cliPromptTest.ENTER],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    expect(stderr).toContain(`ufPath: ${setupSandboxWrongCfg.collect.ufPath} is no directory`);
    expect(stdout).toBe('');
    expect(exitCode).toBe(1);
  });

  it('should load ufPath and execute the user-flow in dryRun', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '-v', '--dryRun'],
      [cliPromptTest.ENTER],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(`Collect: ${uf1Name} from URL ${setupSandboxCfg.collect.url}`);
    expect(stdout).toContain(`flow#navigate: ${setupSandboxCfg.collect.url}`);
    expect(stdout).toContain(`Duration: ${uf1Name}`);
    expect(exitCode).toBe(0);

  }, 20_000);

  it('should load ufPath and execute the user-flow with verbose information', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      // dryRun is here to get faster tests
      [...collectCommand, '--dryRun'],
      [cliPromptTest.ENTER],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    expect(stderr).toBe('');
    expect(stdout).not.toContain(`Collect: ${uf1Name} from URL ${setupSandboxCfg.collect.url}`);
    expect(stdout).not.toContain(`flow#navigate: ${setupSandboxCfg.collect.url}`);
    expect(stdout).not.toContain(`Duration: ${uf1Name}`);
    expect(exitCode).toBe(0);

    // Check report file is not created
    try {
      fs.readFileSync(uf1OutPath).toString('utf8');
    } catch (e: any) {
      expect(e.message).toContain('no such file or directory');
    }

  }, 20_000);

  it('should load ufPath, execute the user-flow and save the file', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '-v'],
      [],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(`Collect: ${uf1Name} from URL ${setupSandboxCfg.collect.url}`);
    expect(stdout).toContain(`Duration: ${uf1Name}`);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    const reportHTML = fs.readFileSync(uf1OutPath).toString('utf8');
    expect(reportHTML).toBeTruthy();
    expect(reportHTML).toContain(`"name":"${uf1Name}"`);


  }, 60_000);


  it('should load use serve command and pass the test including output', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `-p=./${USER_FLOW_RC_STATIC_JSON_NAME}`, '-v', '--dryRun'],
      [],
      {
        testPath: SETUP_SANDBOX_PATH
      }
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(`Starting up http-server, serving ./`);
    expect(stdout).toContain(`${setupSandboxStaticDistCfg.collect.awaitServeStdout}`);
    expect(stdout).toContain(`Collect: ${ufStaticName} from URL ${setupSandboxStaticDistCfg.collect.url}`);
    expect(stdout).toContain(`Duration: ${ufStaticName}`);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    const reportHTML = fs.readFileSync(ufStaticOutPath).toString('utf8');
    expect(reportHTML).toBeTruthy();
    expect(reportHTML).toContain(`"name":"${ufStaticName}"`);


  }, 60_000);

});
