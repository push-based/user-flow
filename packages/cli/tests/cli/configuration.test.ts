import { CLI_PATH } from '../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../fixtures/empty-sandbox';
import { SANDBOX_PRESET } from '../../src/lib/pre-set';
import { expectGlobalOptionsToContain, expectInitCfgToContain } from '../utils/cli-expectations';
import { getGlobalOptionsFromArgv } from '../../src/lib/global/utils';
import { getInitCommandOptionsFromArgv } from '../../src/lib/commands/init/utils';
import { setupUserFlowProject } from '../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { handleCliModeEnvVars } from '../utils/cli-testing/cli-project/utils';

const emptyPrjSandbox = setupUserFlowProject({
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  delete: []
});
const emptyPrjDefault = setupUserFlowProject({
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  env: handleCliModeEnvVars('DEFAULT') as Record<string, string>
});

describe('the CLI configuration', () => {
  beforeEach(async () => {
    await emptyPrjSandbox.createInitialFiles();
    await emptyPrjDefault.createInitialFiles();
  });
  afterEach(async () => {
    await emptyPrjSandbox.deleteGeneratedFiles();
    await emptyPrjDefault.deleteGeneratedFiles();
  });

  it('should have sandbox preset of global options in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await emptyPrjSandbox.$init();
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);


    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have verbose false as default in a fresh environment', async () => {

    const { exitCode, stdout, stderr } = await emptyPrjDefault.$init();
    // verbose => no log as it is false by default
    expect(stdout).not.toContain('CLI Mode:  DEFAULT');
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have default preset in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await emptyPrjDefault.$init({ verbose: true });
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);

    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
