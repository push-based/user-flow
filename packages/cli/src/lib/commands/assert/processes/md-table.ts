
import { ReducedFlowStep, ReducedReport } from '../../collect/utils/user-flow/types';
import {markdownTable} from 'markdown-table';

/**
 *
 * | Step Name       | Gather Mode |Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function userFlowReportToMdTable(
  reducedResult: ReducedReport
): string {
  const TABLE_OPTIONS = {align: 'c'}
  const TABLE_HEAD = ['Step Name', 'Gather Mode','Performance', 'Accessibility', 'BestPractices', 'SEO', 'PWA'];
  //reducedResult.steps.map((step) => (extractTableRow(step)))
  const tableRow1 = ['Navigation report (127.0.0.1/)', '?', '100', '92', '100', '-'];
  const tableRow2 = ['Timespan report (127.0.0.1/)', '10/11', '-', '5/7', '-', '-'];
  const tableRow3 = ['Snapshot report (127.0.0.1/)', 'Ø 3/4', '10/10', '4/5', '9/9', '-'];
  const tableArr = [TABLE_HEAD, tableRow1, tableRow2, tableRow3];

  return markdownTable(tableArr, TABLE_OPTIONS);
}

function extractTableRow(step: ReducedFlowStep) {
  if (step.gatherMode === "navigation") {
    
  } else {

  }
  return '';
}