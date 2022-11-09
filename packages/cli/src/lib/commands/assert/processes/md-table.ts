import {
  FractionResults,
  ReducedFlowStep,
  ReducedReport
} from '../../collect/utils/user-flow/types';
import { formatCode } from '../../../core/prettier';
import { createReducedReport } from '../../collect/processes/generate-reports';
import FlowResult from 'lighthouse/types/lhr/flow';

/**
 * | Step Name       | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function userFlowReportToMdTable(flowResult: FlowResult): string {
  const reducedResult: ReducedReport = createReducedReport(flowResult);
  const reportCategories = Object.keys(reducedResult.steps[0].results);
  const alignOptions = generateTableAlignOptions(reportCategories);
  const tableArr = extractTableArr(reportCategories, reducedResult);
  return markdownTable(tableArr, alignOptions);
}

type Alignment = 'l' | 'c' | 'r';

const alignString = new Map<Alignment, string>([['l', ':--'],['c', ':--:'],['r', '--:']]);

function markdownTable(data: string[][], align: Alignment[]): string {
  const _data = data.map((arr) => arr.join('|'));
  const secondRow = align.map((s) => alignString.get(s)).join('|');
  return formatCode(_data.shift() + '\n' + secondRow + '\n' + _data.join('\n'), 'markdown');
}

function extractTableArr(reportCategories: string[], reducedResult: ReducedReport): string[][] {
  const tableHead = extractTableHead(reportCategories);
  return [tableHead].concat(reducedResult.steps.map((step) => (extractTableRow(step, reportCategories))));
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

function extractTableRow(step: ReducedFlowStep, reportCategories: string[]): string[] {
  const results = reportCategories.map(category => extractResultsValue(step.results[category]));
  return [step.name, step.gatherMode].concat(results);
}

function generateTableAlignOptions(reportCategories: string[]):  Alignment[] {
  const reportFormats = reportCategories.map(_ => 'c');
  return ['l', 'c'].concat(reportFormats) as Alignment[];
}
