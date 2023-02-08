import { FractionResults, ReducedFlowStep, ReducedReport } from '../../collect/utils/report/types';
import { createReducedReport, enrichReducedReportWithBaseline } from '../../collect/utils/report/utils';
import { Alignment, markdownTable } from '../../../core/md/md-table';

// import FlowResult from 'lighthouse/types/lhr/flow';

/**
 * | Step Name       | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function userFlowReportToMdTable(flowResult: any, baselineResults?: any): string {
  const reducedReport = createReducedReport(flowResult);
  const reportCategories = Object.keys(reducedReport.steps[0].results);
  const tableStepsArr = formatStepsForMdTable(reportCategories, reducedReport, baselineResults);
  const alignOptions = headerAlignment(reportCategories);
  const tableArr = extractTableArr(reportCategories, tableStepsArr);
  return markdownTable(tableArr, alignOptions);
}

function formatStepsForMdTable(reportCategories: string[], reducedReport: ReducedReport, baselineResults?: any): string[][] {
  if (baselineResults) {
    const enrichedReducedReport = enrichReducedReportWithBaseline(reducedReport, baselineResults);
    return enrichedReducedReport.steps.map((step) => {
      const results = reportCategories.map(category => extractEnrichedResults(step, category));
      return [step.name, step.gatherMode].concat(results);
    });
  }
  return reducedReport.steps.map((step) => {
    const results = reportCategories.map(category => extractResultsValue(step.results[category]));
    return [step.name, step.gatherMode].concat(results);
  });
}

function extractTableArr(reportCategories: string[],  steps: any[]): string[][] {
  const tableHead = extractTableHead(reportCategories);
  return [tableHead].concat(steps);
}

function extractTableHead(reportCategories: string[]): string[] {
  return ['Step Name', 'Gather Mode']
    .concat(reportCategories.map(c => c.split('-').map(cN => cN[0].toUpperCase() + cN.slice(1)).join(' ')));
}

function extractFractionalResultValue(fractionResults: FractionResults): string {
  const { totalWeight, numPassed, numPassableAudits } = fractionResults;
  const value = numPassed + '/' + numPassableAudits;
  return totalWeight === 0 ? 'Ø ' + value : value;
}

function extractResultsValue(stepResult?: number | FractionResults): string {
  if (typeof stepResult === 'number') {
    return (stepResult * 100).toFixed(0);
  }
  return stepResult ? extractFractionalResultValue(stepResult) : '-';
}

function extractEnrichedResults(step: ReducedFlowStep, category: string): string {
  const result = extractResultsValue(step.results[category]);
  const baseline = extractResultsValue(step.baseline![category]);
  return resultWithBaselineComparison(result, baseline)
}

function resultWithBaselineComparison(result: string, baseline: string): string {
  if (result ===  baseline) {
    return result;
  }
  const resultNum = Number(result.replace('Ø ', '').split('/')[0]);
  const baselineNum = Number(baseline.replace('Ø ', '').split('/')[0]);
  const difference = baselineNum - resultNum;
  return `${result} (${difference > 0 ? '+' : ''}${difference})`;
}

function headerAlignment(reportCategories: string[]):  Alignment[] {
  const reportFormats = reportCategories.map(_ => 'c');
  return ['l', 'c'].concat(reportFormats) as Alignment[];
}
