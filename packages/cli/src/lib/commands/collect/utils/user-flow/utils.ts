import { toFileName } from '../../../../core/file';

export function dateToIsoLikeString(date: Date): string {
  return isoDateStringToIsoLikeString(date.toISOString());
}
export function isoDateStringToIsoLikeString(isoDate: string): string {
  return isoDate.replace(/[\-:]/gm, '').split('.').shift() as string;
}

export function toReportName(url: string, flowName: string, date?: string): string {
  date = date || new Date().toISOString();
  console.error('flowName', flowName)
  return `${toFileName(url)}-${toFileName(flowName)}-${isoDateStringToIsoLikeString(date)}`;
}
