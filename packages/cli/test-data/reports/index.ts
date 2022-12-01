import { readFileSync } from "fs";
import { join } from "path";

export const LHR9_HTML_NAME = 'lhr-9.html';
export const LHR9_JSON_NAME = 'lhr-9.json';


export function getContent(fileName: string): string | {} {
  const reportContent = readFileSync(join(__dirname, fileName), 'utf-8');
  return reportContent;
}
