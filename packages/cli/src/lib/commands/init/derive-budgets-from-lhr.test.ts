import { existsSync } from 'fs';
import { join } from 'path';
import { deriveBudgetsFromLhr } from './derive-budgets-from-lhr';
import { getReportContent } from 'test-data';
import LHR from 'lighthouse/types/lhr/lhr';

const lhr9 = getReportContent<LHR>('lhr-9.json');
const expectedBudgets = [
  {
    resourceCounts: [
      {budget: 0, resourceType: 'stylesheet'},
      {budget: 0, resourceType: 'script'},
    ],
    resourceSizes: [
      {budget: 941, resourceType: 'document'},
      {budget: 0, resourceType: 'stylesheet'},
      {budget: 0, resourceType: 'font'},
      {budget: 0, resourceType: 'script'},
      {budget: 0, resourceType: 'third-party'},
    ],
    timings: [
      {budget: 0, metric: 'cumulative-layout-shift'},
      {budget: 724, metric: 'largest-contentful-paint'},
    ],
  },
];

const expectedFilePath = join('.github', 'workflows', 'user-flow-ci.yml');
describe('deriveBudgetsFromLhr', () => {
  it('should create budgets array if a valid lhr is given', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    const budgets = deriveBudgetsFromLhr(lhr9);
    expect(budgets).toStrictEqual(expectedBudgets);
  });
});
