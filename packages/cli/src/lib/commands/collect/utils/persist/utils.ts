import { ReducedReport } from '../report/types.js';
import { getStepsTable } from '../../../assert/utils/md-report.js';

export async function generateStdoutReport(flowResult: ReducedReport): Promise<string> {
  const dateTime = new Date().toISOString().replace('T', ' ').split('.')[0].slice(0, -3);
  const mdTable = await getStepsTable(flowResult);
  return `# ${flowResult.name}\n\nDate/Time: ${dateTime}\n\n${mdTable}`;
}

export function isoDateStringToIsoLikeString(isoDate: string): string {
  return isoDate.replace(/[\-:]/gm, '').split('.').shift() as string;
}
