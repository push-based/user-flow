import {
  FractionResults,
  GatherMode,
  ReducedFlowStep,
  ReducedFlowStepResult,
  ReducedReport
} from '../../collect/utils/report/types';
import { enrichReducedReportWithBaseline } from '../../collect/utils/report/utils';
import { Alignment, table } from '../../../core/md/table';
import { style } from '../../../core/md/font-style';
import { headline } from '../../../core/md/headline';
import { NEW_LINE } from '../../../core/md/constants';
import { details } from '../../../core/md/details';
import  Details  from 'lighthouse/types/lhr/audit-details';
const budgetsSymbol = '🔒'

export function generateMdReport(flowResult: ReducedReport): string {
  const name = flowResult.name;
  const dateTime = `Date/Time: ${style(new Date().toISOString().replace('T', ' ').split('.')[0].slice(0, -3))}  `;
  const stepsTable = getStepsTable(flowResult);

  let md = `${headline(name)}${NEW_LINE}
${dateTime}${NEW_LINE}
${stepsTable}${NEW_LINE}
`;

  const budgetsTable = getBudgetTable(flowResult);
  if(budgetsTable !== '') {
    md += details(`${budgetsSymbol} Budgets`, budgetsTable, {open:true}) + NEW_LINE;
  }


  return md;
}

/**
 * | ResourceType    | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function getBudgetTable(reducedReport: ReducedReport): string {
  type StepWithBudgets = Required<Pick<ReducedFlowStep, 'resultsPerformanceBudget' | 'resultsTimingBudget'>>;

  const performanceBudgets = reducedReport.steps
    .filter(({ resultsPerformanceBudget, resultsTimingBudget }) => resultsPerformanceBudget || resultsTimingBudget)
    .map(({ resultsPerformanceBudget, resultsTimingBudget }) => ({
      resultsPerformanceBudget: resultsPerformanceBudget?.map((d: Details.Table) => [
          d.headings.map(h => h.text),
          ...d.items.map(({label, transferSize, resourceType, sizeOverBudget}) => [label, transferSize, resourceType, sizeOverBudget])
        ]) || [],
      resultsTimingBudget: resultsTimingBudget
    }));
  return performanceBudgets.length ? JSON.stringify(performanceBudgets) : '';
}


/**
 * | Step Name       | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function getStepsTable(reducedReport: ReducedReport, baselineResults?: any): string {
  const reportCategories = Object.keys(reducedReport.steps[0].results);
  const tableStepsArr = formatStepsForMdTable(reportCategories, reducedReport, baselineResults);
  const alignOptions = headerAlignment(reportCategories);
  const tableArr = extractTableArr(reportCategories, tableStepsArr);
  return table(tableArr, alignOptions);
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
    // add `budgetsSymbol` to gatherMode to indicate budgets
    step.resultsPerformanceBudget && (step.gatherMode = step.gatherMode + ` ${budgetsSymbol}` as GatherMode);
    return [step.name, step.gatherMode].concat(results);
  });
}

function extractTableArr(reportCategories: string[], steps: any[]): string[][] {
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
  return resultWithBaselineComparison(result, baseline);
}

function resultWithBaselineComparison(result: string, baseline: string): string {
  if (result === baseline) {
    return result;
  }
  const resultNum = Number(result.replace('Ø ', '').split('/')[0]);
  const baselineNum = Number(baseline.replace('Ø ', '').split('/')[0]);
  const difference = baselineNum - resultNum;
  return `${result} (${difference > 0 ? '+' : ''}${difference})`;
}

function headerAlignment(reportCategories: string[]): Alignment[] {
  const reportFormats = reportCategories.map(_ => 'c');
  return ['l', 'c'].concat(reportFormats) as Alignment[];
}

