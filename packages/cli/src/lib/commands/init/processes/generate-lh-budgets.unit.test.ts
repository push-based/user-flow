import { handleBudgetsGeneration } from './generate-lh-budgets';
import { RcJson } from '@push-based/user-flow';
import deriveHelpers = require('../derive-budgets-from-lhr');
import fileHelpers = require('../../../core/file');

jest.mock('../derive-budgets-from-lhr');
jest.mock('../../../core/file');

describe('generate LH budgets', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should not check if file exist if generateBudgets is false', async () => {
    const readFileSpy = jest.spyOn(fileHelpers, 'readFile');
    await handleBudgetsGeneration({ generateBudgets: false })({} as RcJson);
    expect(readFileSpy).not.toHaveBeenCalled();
  })

  it('should not create flow if generateBudgets is false', async () => {
    const writeFileSpy = jest.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: false })({} as RcJson);
    expect(writeFileSpy).not.toHaveBeenCalled();
  });

  it('should not write a budgets file if generateBudgets is true and file budgets file already exists', async () => {
    const readFileSpy = jest.spyOn(fileHelpers, 'readFile').mockReturnValue('Not Empty String' as never);
    const writeFileSpy = jest.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true })({} as RcJson);
    expect(readFileSpy).toHaveBeenCalled();
    expect(writeFileSpy).not.toHaveBeenCalled();
  });

  it('should create default budgets file if generateBudgets is true and lhr is passed', async () => {
    jest.spyOn(fileHelpers, 'readFile').mockReturnValue('' as never);
    const deriveBudgetsFromLhrSpy = jest.spyOn(deriveHelpers, 'deriveBudgetsFromLhr');
    const writeFileSpy = jest.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true })({} as RcJson);
    expect(deriveBudgetsFromLhrSpy).not.toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();
  });

  it('should create derived budgets if generateBudgets is true and lhr is passed', async () => {
    jest.spyOn(fileHelpers, 'readFile')
      .mockReturnValueOnce('' as never)
      .mockReturnValueOnce('{}' as never);
    const deriveBudgetsFromLhrSpy = jest.spyOn(deriveHelpers, 'deriveBudgetsFromLhr').mockReturnValue('' as never);
    const writeFileSpy = jest.spyOn(fileHelpers, 'writeFile');
    await handleBudgetsGeneration({ generateBudgets: true, lhr: 'path-to-budget.json' })({} as RcJson);
    expect(deriveBudgetsFromLhrSpy).toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();
  });
});
