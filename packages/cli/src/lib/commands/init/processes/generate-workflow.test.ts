import { EMPTY_PRJ_CFG, INITIATED_PRJ_CFG, INITIATED_RC_JSON } from 'test-data';
import { existsSync } from 'fs';
import { join } from 'path';
import { withUserFlowProject } from '@push-based/user-flow-cli-testing';
import { handleGhWorkflowGeneration } from './generate-workflow';

let originalCwd = process.cwd();

const expectedFilePath = join(EMPTY_PRJ_CFG.root, '.github', 'workflows','user-flow-ci.yml');
const CFG = {
  ...EMPTY_PRJ_CFG,
  delete: [join('.github', 'workflows','user-flow-ci.yml')].concat(EMPTY_PRJ_CFG?.delete || [])
}

describe('generate GH workflow', () => {

  /**
   * Legend:
   * - [nf] - flow file does not exist
   * - [f] - flow file does exist
   * - [F] - flow file creation
   * - [nF] - no flow file creation
   *
   * Cases:
   * [f] init --generateGhWorkflow => [F]
   * [nf] init --generateGhWorkflow => [F]
   * [f, nf] init --no-generateGhWorkflow => [nF]
   *
   */

  beforeAll(() => {
    process.chdir(INITIATED_PRJ_CFG.root);
  });
  afterAll(() => {
    process.chdir(originalCwd);
  });

  // [f] init --generateGhWorkflow => [F]
  it('should create flow when --generateGhWorkflow is used', withUserFlowProject(CFG, async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleGhWorkflowGeneration({generateGhWorkflow: true})(INITIATED_RC_JSON);
    expect(existsSync(join('.github', 'workflows','user-flow-ci.yml'))).toBeTruthy();
  }));

  // [f, nf] init --no-generateGhWorkflow => [nF]
  it('should not create flow when --no-generateGhWorkflow is used', withUserFlowProject(CFG, async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleGhWorkflowGeneration({generateGhWorkflow: false})(INITIATED_RC_JSON);
    expect(existsSync(join('..','..','.github', 'workflows','user-flow-ci.yml'))).toBeFalsy();
  }));

});
