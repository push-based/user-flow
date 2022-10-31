import {cliPromptTest} from '../../../../../tools/tests/cli-promp-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import { CLI_MODE_PROPERTY, detectCi, detectCliMode } from '../../../src/lib/cli-modes';

const collectCommand = [CLI_PATH, 'init', '-v'];
const collectCommandStaticRc = [
  ...collectCommand,
  `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`,
  `--ufPath=${SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath}`
];

let CLI_MODE_SANDBOX = 'CLI_MODE: SANDBOX';

describe('env check in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should return SANDBOX in sandbox mode for CLI_MODES prop', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(CLI_MODE_SANDBOX);

    expect(exitCode).toBe(0);
  }, 90_000);

  it('should return DEFAULT in CI mode fo CI prop', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(CLI_MODE_SANDBOX);
    // fake the environment
    process.env[CLI_MODE_PROPERTY] = 'CI';
    expect(detectCliMode()).toBe('CI');
    expect(detectCi()).toBe('DEFAULT');


    expect(exitCode).toBe(0);
  }, 90_000);

  it('should return SANDBOX in sandbox mode fo CI prop', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(stdout).toContain(CLI_MODE_SANDBOX);
    expect(detectCliMode()).toBe('SANDBOX');
    expect(detectCi()).toBe('SANDBOX');

    expect(exitCode).toBe(0);
  }, 90_000);

});
