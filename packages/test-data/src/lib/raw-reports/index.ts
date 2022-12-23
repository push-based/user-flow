import { join } from 'path';
import { readFileSync } from 'fs';

export function getReportContent<T = string>(fileName: string): T {
  const path = join(__dirname, fileName);
  const report: string = readFileSync(path, 'utf-8');
  if (fileName.endsWith('.json')) {
    return JSON.parse(report as string);
  }
  return report as unknown as T;
}
