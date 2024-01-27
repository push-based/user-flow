import { describe, it, expect } from 'vitest';
import { getBudgetTable, getStepsTable } from './md-report.js';
import { FlowResult } from 'lighthouse';
import { getReportContent } from 'test-data';

import { createReducedReport, enrichReducedReportWithBaseline } from '../../collect/utils/report/utils.js';

const lhr8 = getReportContent<any>('lhr-8.json');
const lhr9 = getReportContent<FlowResult>('lhr-9.json');
const lhr9budgets = getReportContent<FlowResult>('lhr-9-budgets.json');
const lhr9Ex2 = getReportContent<FlowResult>('lhr-9-ex-2.json');

describe('md-table', () => {

  it('should throw if version is lower than 9', () => {
    expect(lhr8['steps']).toBe(undefined);
    expect(parseFloat(lhr8.lhr.lighthouseVersion)).toBeLessThan(9);
  });

  it('should NOT throw if version is greater or equal than 9', () => {
    expect(parseFloat(lhr9.steps[0].lhr.lighthouseVersion)).toBeGreaterThan(9);
  });

  it('should generate reduced JSON format for v9 raw JSON result if createReducedReport is called', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    expect(reducedLhr9).toMatchSnapshot();
  });

  it('should generate reduced JSON with baseline results if enrichReducedReportWithBaseline is called', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const enrichedReducedLhr9 = enrichReducedReportWithBaseline(reducedLhr9, lhr9Ex2);
    expect(enrichedReducedLhr9).toMatchSnapshot();
  });

  it('should print MD table if getStepsTable is called with a reduced result', async () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const mdTable = await getStepsTable(reducedLhr9);
    expect(mdTable).toMatchSnapshot();
  });

  it('should return a Md table comparing to reports if getStepsTable is passed a baseline report', async () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const mdTable = await getStepsTable(reducedLhr9, lhr9Ex2);
    expect(mdTable).toMatchSnapshot();
  });

  it('should return a Md table if getBudgetTable is passed a baseline report', () => {
    const reducedLhr9 = createReducedReport(lhr9budgets);
    const mdTable = getBudgetTable(reducedLhr9);
    expect(mdTable).toMatchSnapshot();
  });
});
