import { INITIATED_PRJ_CFG, INITIATED_RC_JSON } from 'test-data';
import { handleFlowGeneration } from './generate-userflow';
import { existsSync } from 'fs';
import { join } from 'path';
import { withUserFlowProject } from '@push-based/user-flow-cli-testing';

let originalCwd = process.cwd();
const consoleLog = console.log;

describe('generate userflow', () => {

  beforeAll(() => {
    process.chdir(INITIATED_PRJ_CFG.root);
    console.log = (...args: any) => void 0;
  });
  afterAll(() => {
    process.chdir(originalCwd);
    console.log = consoleLog;
  });

  it('should prompt with --interactive', withUserFlowProject(INITIATED_PRJ_CFG, async (_) => {
      await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
      const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
      expect(existsSync(expectedFilePath)).toBeTruthy()
    })
  );

  it('should not prompt with --interactive if file exists', async () => {

  });

  it('should create flow when --generateFlow is used', async () => {

  });

  it('should not create flow when --no-generateFlow is used', async () => {

  });

});
