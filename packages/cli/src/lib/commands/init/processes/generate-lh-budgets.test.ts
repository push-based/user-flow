import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { handleGhWorkflowGeneration } from './generate-workflow';
import { handleBudgetsGeneration } from './generate-lh-budgets';

const expectedFilePath = join('budgets.json');
describe('generate LH budgets', () => {

  it('should create budgets when --generateBudgets is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleBudgetsGeneration({ generateBudgets: true })({} as any);
    expect(existsSync(expectedFilePath)).toBeTruthy();
    rmSync(expectedFilePath);
  });

  it('should not create flow when --no-generateBudgets is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleBudgetsGeneration({ generateBudgets: false })({} as any);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });

});
