import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../../user-flow-cli-project/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';

let staticPrj: UserFlowCliProject;
const ufStaticName = 'Sandbox Setup StaticDist';

describe('ufPath and collect command in static sandbox', () => {
  beforeEach(async () => {
    if (!staticPrj) {
      staticPrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
    }
    await staticPrj.setup();
  });
  afterEach(async () => {
    await staticPrj.teardown();
  });

  it('should throw if no user-flow is given', async () => {
    const existingEmptyFolder = staticPrj.readRcJson().persist.outPath;
    const { exitCode, stderr } = await staticPrj.$collect({
      ufPath: existingEmptyFolder
    });

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);
});
