import { default as _Budget } from 'lighthouse/types/lhr/budget';

export interface Budget {
  resourceType: _Budget.ResourceType,
  sizeOverBudget: number;
  transferSize: number;
  size: number;
  countOverBudget: string;
  requestCount: number;
}
export type BudgetDetails = { items: (Budget)[] }

