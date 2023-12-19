import { ReducedReport } from '../report/types.js';
import { getStepsTable } from '../../../assert/utils/md-report.js';

export function generateStdoutReport(flowResult: ReducedReport): string {
  const dateTime = new Date().toISOString().replace('T', ' ').split('.')[0].slice(0, -3);
  const mdTable = getStepsTable(flowResult);
  return `# ${flowResult.name}\n\nDate/Time: ${dateTime}\n\n${mdTable}`;
}

export function dateToIsoLikeString(date: Date): string {
  return isoDateStringToIsoLikeString(date.toISOString());
}
export function isoDateStringToIsoLikeString(isoDate: string): string {
  return isoDate.replace(/[\-:]/gm, '').split('.').shift() as string;
}

