import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { handleGhWorkflowGeneration } from './generate-workflow';
import { handleBudgetsGeneration } from './generate-lh-budgets';

const _cwd = process.cwd();
const packagesRoot = join(__dirname, '..', '..', '..', '..', '..', '..');
const sandboxRoot = join(packagesRoot, 'sandbox', 'src', 'lib');
const expectedFilePath = join(sandboxRoot, 'budget.json');
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

describe('generate LH budgets', () => {
  beforeAll(() => {
    process.chdir(sandboxRoot);
  });
  afterAll(() => {
    process.chdir(_cwd);
  });

  it('should create budgets when --generateBudgets is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleBudgetsGeneration({ generateBudgets: true })({} as any);
    expect(existsSync(expectedFilePath)).toBeTruthy();
    rmSync(expectedFilePath);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });

  it('should not create flow when --no-generateBudgets is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleBudgetsGeneration({ generateBudgets: false })({} as any);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });

  it('should create budgets derived form lhr when --generateBudgets --lhr is used', async () => {
    expect(existsSync(expectedFilePath)).toBeFalsy();
    const lhrPath = join(
      packagesRoot,
      'test-data',
      'src',
      'lib',
      'raw-reports',
      'lhr-9.json'
    );

    expect(existsSync(lhrPath)).toBeTruthy();
    await handleBudgetsGeneration({
      generateBudgets: true,
      lhr: lhrPath,
    })({} as any);
    expect(existsSync(expectedFilePath)).toBeTruthy();
    const result = JSON.parse(
      readFileSync(expectedFilePath, {encoding: 'utf8'})
    );
    expect(result).toStrictEqual(expectedBudgets);
    rmSync(expectedFilePath);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });
});
