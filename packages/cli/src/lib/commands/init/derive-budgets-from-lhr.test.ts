import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { deriveBudgetsFromLhr } from './derive-budgets-from-lhr';
import LHR from 'lighthouse/types/lhr/lhr';

function getReportContent<T = string>(fileName: string): T {
  const path = join(__dirname, fileName);
  let report: string = readFileSync(path, 'utf-8').trim();
  report = report[1] === ' ' ? '| ' + report.slice(2) : report;
  if (fileName.endsWith('.json')) {
    return JSON.parse(report as string);
  }
  return report as unknown as T;
}

const lhr9 = getReportContent<LHR>('lhr-9.json');
const expectedBudgets = [
  {
    resourceCounts: [
      { budget: 0, resourceType: 'stylesheet' },
      { budget: 0, resourceType: 'script' }
    ],
    resourceSizes: [
      { budget: 941, resourceType: 'document' },
      { budget: 0, resourceType: 'stylesheet' },
      { budget: 0, resourceType: 'font' },
      { budget: 0, resourceType: 'script' },
      { budget: 0, resourceType: 'third-party' }
    ],
    timings: [
      { budget: 0, metric: 'cumulative-layout-shift' },
      { budget: 724, metric: 'largest-contentful-paint' }
    ]
  }
];

const expectedFilePath = join('.github', 'workflows', 'user-flow-ci.yml');
describe('deriveBudgetsFromLhr', () => {

  it('should create budgets array if a valid lhr is given', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    const budgets = deriveBudgetsFromLhr(lhr9);
    expect(budgets).toStrictEqual(expectedBudgets);
  });

});
