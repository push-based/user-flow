import { ReducedReport } from '../../collect/utils/user-flow/types';
import {markdownTable} from 'markdown-table';
/**
 *
 * | Steps           | Performance | Accessibility | BestPractices | Seo  | PWA |
 * | --------------- | ----------- | ------------- | ------------- | ---- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98   |  -  |
 * |  Snap   1       |  3/3        | 22/5          | 5/2           | 7/10 |  -  |
 * |  TimeSpan 1     |  10/11      | -             | 4/7           | 7/10 |  -  |
 */
export function userFlowReportToMdTable(
  reducedResult: ReducedReport
): string {
  const arr = Object.keys(reducedResult);
  return markdownTable([arr]);
}
