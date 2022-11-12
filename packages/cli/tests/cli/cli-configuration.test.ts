import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG, SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_NAME,
  SETUP_SANDBOX_PATH
} from '../fixtures/setup-sandbox';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { expectCfgToContain, expectCollectLogsFromMockInStdout } from '../utils/cli-expectations';
import * as path from 'path';
import * as fs from 'fs';
import { RcArgvOptions, RcJson } from '@push-based/user-flow';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { getEnvPreset } from '../../src/lib/global/rc-json/pre-set';

const initCommand = [CLI_PATH, 'init'];
const collectCommand = [CLI_PATH, 'collect'];

describe('the CLI configurations', () => {
  beforeEach(async () => {
    resetEmptySandbox();
    resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    resetEmptySandbox();
    resetSetupSandboxAndKillPorts();
  });

  it('should have interactive as default in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    const cfg: Partial<GlobalOptionsArgv & RcArgvOptions> = getEnvPreset();
    expectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });


  it('should read the existing .rc configuration', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommand
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert };
    expectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });


});
