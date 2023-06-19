import {existsSync, rmSync} from 'fs';
import {join} from 'path';
import {handleGhWorkflowGeneration} from './generate-workflow';

const expectedFilePath = join('.github', 'workflows', 'user-flow-ci.yml');
describe('generate GH workflow', () => {
  it('should create flow when --generateGhWorkflow is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleGhWorkflowGeneration({ generateGhWorkflow: true })({} as any);
    expect(existsSync(expectedFilePath)).toBeTruthy();
    rmSync(expectedFilePath);
  });

  it('should not create flow when --no-generateGhWorkflow is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleGhWorkflowGeneration({ generateGhWorkflow: false })({} as any);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });
});
