import { describe, expect, it } from 'vitest';
import { getBudgetTable, getStepsTable } from './md-report';
import { FlowResult } from 'lighthouse';
import { getReportContent } from 'test-data';
import { ReducedReport } from '../../collect/utils/report/types';
import { createReducedReport, enrichReducedReportWithBaseline } from '../../collect/utils/report/utils';

const lhr8 = getReportContent<any>('lhr-8.json');
const lhr9 = getReportContent<FlowResult>('lhr-9.json');
const lhr9budgets = getReportContent<FlowResult>('lhr-9-budgets.json');
const lhr9Ex2 = getReportContent<FlowResult>('lhr-9-ex-2.json');
const lhr9reduced = getReportContent<ReducedReport>('lhr-9_reduced.json');
const lhr9ReducedBaseline = getReportContent<ReducedReport>('lhr-9_reduced-baseline.json');

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
    expect(reducedLhr9).toEqual(lhr9reduced);
  });

  it('should generate reduced JSON with baseline results if enrichReducedReportWithBaseline is called', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const enrichedReducedLhr9 = enrichReducedReportWithBaseline(reducedLhr9, lhr9Ex2);
    expect(enrichedReducedLhr9).toEqual(lhr9ReducedBaseline);
  });

  it('should print MD table if getStepsTable is called with a reduced result', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const mdTable = getStepsTable(reducedLhr9);
    expect(mdTable).toMatchSnapshot();
  });

  it('should return a Md table comparing to reports if getStepsTable is passed a baseline report', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const mdTable = getStepsTable(reducedLhr9, lhr9Ex2);
    expect(mdTable).toMatchSnapshot();
  });

  it('should return a Md table if getBudgetTable is passed a baseline report', () => {
    const reducedLhr9 = createReducedReport(lhr9budgets);
    const mdTable = getBudgetTable(reducedLhr9);
    expect(mdTable).toContain('| Resource Type | Transfer Size | Over Budget |');
    expect(mdTable).toContain('| Resource Type | Requests | Over Budget |');
    expect(mdTable).toContain('|         Metric         | Measurement | Over Budget |');
  });
});
