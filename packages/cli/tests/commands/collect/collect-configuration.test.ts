import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { resetEmptySandbox } from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_REMOTE_RC_JSON
} from '../../fixtures/setup-sandbox';

import { expectCollectCfgToContain } from '../../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { setupUserFlowProject } from '../../utils/cli-testing/user-flow-cli';

const setupPrj = setupUserFlowProject({
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
});

describe('collect command configuration in setup sandbox', () => {

  beforeEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$collect();

    const { rcPath, interactive, verbose, ...collectOptions }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    // @TODO implement format
    delete collectOptions['format'];
    expectCollectCfgToContain(stdout, collectOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$collect();
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    delete (cfg as any).format;
    expectCollectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters', async () => {

    let { collect, persist, assert } = SETUP_SANDBOX_REMOTE_RC_JSON;

    const { url, ufPath } = collect;
    // @TODO fix format
    let { outPath/*, format*/ } = persist;
    let budgetPath = assert?.budgetPath;

    const { exitCode, stdout, stderr } = await setupPrj.$collect({
        url,
        ufPath,
        // `--serveCommand=${serveCommand}`,
        // `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        outPath
        // `--format=${format[0]}`,
        // `--format=${format[1]}`,
        // assert
        // `--budgetPath=${budgetPath}`
      },
      ['n']
    );

    const cfg = {
      url, ufPath,
      outPath
    };
    expectCollectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});

