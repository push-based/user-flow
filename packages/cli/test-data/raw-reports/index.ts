import { join } from "path";
import { readFileSync } from "fs";

export function getReportContent(fileName: string): string | {} {
  const path = join(__dirname, fileName);
  const report: string = readFileSync(path, 'utf-8');
  if(fileName.endsWith('.json')) {
    return JSON.parse(report);
  }
  return report;
}
