import {
  budgetsFileExist,
  defaultBudgets,
  derivedBudgets,
  handleBudgetsGeneration,
  writeBudgetsFile
} from './generate-lh-budgets';
import { RcJson } from '@push-based/user-flow';

jest.mock('./generate-lh-budgets', () => ({
    ...jest.requireActual('./generate-lh-budgets'),
    budgetsFileExist: jest.fn(),
    writeBudgetsFile: jest.fn(),
    derivedBudgets: jest.fn(),
    defaultBudgets: jest.fn(),
}));

describe('generate LH budgets', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should not create flow if generateBudgets is false', async () => {
    await handleBudgetsGeneration({ generateBudgets: false })({} as RcJson);
    expect(budgetsFileExist).not.toHaveBeenCalled();
    expect(writeBudgetsFile).not.toHaveBeenCalled();
  });

  it('should create default budgets if generateBudgets is true and lhr is passed', async () => {
    await handleBudgetsGeneration({ generateBudgets: true })({} as RcJson);
    expect(defaultBudgets).toHaveBeenCalled();
    expect(writeBudgetsFile).toHaveBeenCalled();
  });

  it('should create derived budgets if generateBudgets is true and lhr is passed', async () => {
    await handleBudgetsGeneration({ generateBudgets: true, lhr: 'path-to-budget.json' })({} as RcJson);
    expect(derivedBudgets).toHaveBeenCalled();
    expect(writeBudgetsFile).toHaveBeenCalled();
  });
});
