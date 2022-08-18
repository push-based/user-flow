import {
  FractionResults,
  ReducedFlowStep,
  ReducedReport
} from '../../collect/utils/user-flow/types';
import { formatCode } from '../../../core/utils/prettier';
import { createReducedReport } from '../../collect/processes/generate-reports';
import FlowResult from 'lighthouse/types/lhr/flow';

/**
 *
 * | Step Name       | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function userFlowReportToMdTable(
  flowResult: FlowResult
): string {
  const reducedResult: ReducedReport = createReducedReport(flowResult);
  const reportCategories = Object.keys(reducedResult.steps[0].results);
  const reportFormats = reportCategories.map(_ => 'c');
  // name is center, gather mode is center, all other columns are centered
  const TABLE_OPTIONS = { align: ['l', 'c'].concat(reportFormats) };
  const TABLE_HEAD = ['Step Name', 'Gather Mode']
    .concat(reportCategories
      .map(
        c => c.split('-').map(cN => cN[0].toUpperCase() + cN.slice(1)).join(' ')
      )
    );
  const tableArr = [TABLE_HEAD].concat(reducedResult.steps.map((step) => (extractTableRow(step, reportCategories))) as any);
  return markdownTable(tableArr, TABLE_OPTIONS as any).replace(' ', '') + `\n`;
}

type Alignment = 'l' | 'c' | 'r';

function markdownTable(data: string[][], {align} : {align:  Alignment | Alignment[]}): string {
  const _data = data.map((arr) => arr.join('|'));
  let secondRow = typeof align === 'string' ?  getAlignString(align) : align.map((s) => getAlignString(s)).join('|');
  return formatCode(_data.shift() + '\n' + secondRow + '\n' + _data.join('\n'), 'markdown');
}

function getAlignString(option?:  Alignment ): string {
  const _ = '--'
  return option === 'l' ? ':'+_ : option === 'c' ? ':'+_+':' : option === 'r' ? _+':' : _ ;
}

function extractTableRow(step: ReducedFlowStep, reportCategories: string[]) {
  const nameAndMode = [step.name, step.gatherMode];
  let results: string[];
  if (step.gatherMode === 'navigation') {
    results = Object.values(step.results).map((v) => {
      return v ? ((v as unknown as number) * 100) + '' : '-';
    });
  } else {

    const existingCats = Object.keys(step.results);
    results = reportCategories.map(category => {
      if (!existingCats.includes(category)) {
        return '-';
      }
      const { totalWeight, numPassed, numPassableAudits } = step.results[category] as FractionResults;
      const res = numPassed + '/' + numPassableAudits;
      return totalWeight === 0 ? 'Ø ' + res : res;
    });

  }
  return nameAndMode.concat(results);
}
