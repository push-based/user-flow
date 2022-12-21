import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';
import { REMOTE_RC_JSON } from '../../fixtures/rc-files/remote';
import { SANDBOX_BASE_RC_JSON, UserFlowCliProject, UserFlowCliProjectFactory } from '@push-based/user-flow-cli-testing';
import { expectCollectCfgToContain } from '../../jest';

let initializedPrj: UserFlowCliProject;

describe('collect command configuration in setup sandbox', () => {

  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$collect();

    const { rcPath, interactive, verbose, ...collectOptions }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    // @TODO implement format
    delete collectOptions['format'];
    expectCollectCfgToContain(stdout, collectOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$collect();
    const { collect, persist, assert } = SANDBOX_BASE_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    delete (cfg as any).format;
    expectCollectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters', async () => {

    let { collect, persist, assert } = REMOTE_RC_JSON;
    const { url, ufPath } = collect;
    // @TODO fix format
    let { outPath/*, format*/ } = persist;
    let budgetPath = assert?.budgetPath;

    const { exitCode, stdout, stderr } = await initializedPrj.$collect({
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

