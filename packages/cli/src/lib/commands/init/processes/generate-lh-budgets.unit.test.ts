import { describe, expect, it, beforeEach, vi } from 'vitest';
import { handleBudgetsGeneration } from './generate-lh-budgets';
import { RcJson } from '@push-based/user-flow';
import * as deriveHelpers from '../derive-budgets-from-lhr';
import * as fileHelpers from '../../../core/file';

vi.mock('../derive-budgets-from-lhr');
vi.mock('../../../core/file');
vi.mock('../../../core/loggin');

describe('generate LH budgets', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should not check if file exist if generateBudgets is false', async () => {
    const readFileSpy = vi.spyOn(fileHelpers, 'readFile');
    await handleBudgetsGeneration({ generateBudgets: false })({} as RcJson);
    expect(readFileSpy).not.toHaveBeenCalled();
  })

  it('should not create flow if generateBudgets is false', async () => {
    const writeFileSpy = vi.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: false })({} as RcJson);
    expect(writeFileSpy).not.toHaveBeenCalled();
  });

  it('should not write a budgets file if generateBudgets is true and file budgets file already exists', async () => {
    const readFileSpy = vi.spyOn(fileHelpers, 'readFile').mockReturnValue('Not Empty String' as never);
    const writeFileSpy = vi.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true })({} as RcJson);
    expect(readFileSpy).toHaveBeenCalled();
    expect(writeFileSpy).not.toHaveBeenCalled();
  });

  it('should create default budgets file if generateBudgets is true and lhr is passed', async () => {
    vi.spyOn(fileHelpers, 'readFile').mockReturnValue('' as never);
    const deriveBudgetsFromLhrSpy = vi.spyOn(deriveHelpers, 'deriveBudgetsFromLhr');
    const writeFileSpy = vi.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true })({} as RcJson);
    expect(deriveBudgetsFromLhrSpy).not.toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();
  });

  it('should create derived budgets if generateBudgets is true and lhr is passed', async () => {
    vi.spyOn(fileHelpers, 'readFile')
      .mockReturnValueOnce('' as never)
      .mockReturnValueOnce('{}' as never);
    const deriveBudgetsFromLhrSpy = vi.spyOn(deriveHelpers, 'deriveBudgetsFromLhr').mockReturnValue('' as never);
    const writeFileSpy = vi.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true, lhr: 'path-to-budget.json' })({} as RcJson);
    expect(deriveBudgetsFromLhrSpy).toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();
  });
});
