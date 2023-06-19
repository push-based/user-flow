import {
  UserFlowCliProject,
  UserFlowCliProjectFactory,
} from '@push-based/user-flow-cli-testing';
import { INITIATED_PRJ_CFG } from 'test-data';

let initPrj: UserFlowCliProject;

describe('ufPath and collect command in static sandbox', () => {
  beforeEach(async () => {
    if (!initPrj) {
      initPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initPrj.setup();
  });
  afterEach(async () => {
    await initPrj.teardown();
  });

  it('should throw if no user-flow is given', async () => {
    const existingEmptyFolder = initPrj.readRcJson().persist.outPath;
    const { exitCode, stderr } = await initPrj.$collect({
      ufPath: existingEmptyFolder,
    });

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);
});
