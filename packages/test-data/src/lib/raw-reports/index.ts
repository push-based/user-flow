import { join } from 'path';
import { readFileSync } from 'fs';

export function getReportContent<T = string>(fileName: string): T {
  const path = join(__dirname, fileName);
  let report: string = readFileSync(path, 'utf-8').trim();
  report = report[1] === ' ' ? '| ' + report.slice(2) : report;
  if (fileName.endsWith('.json')) {
    return JSON.parse(report as string);
  }
  return report as unknown as T;
}
