import { join } from 'path';
import { readFileSync } from 'fs';
import { parse } from './parse';

function getReportContent<T = string>(fileName: string): T {
  const refPath = '../../../../../../../../packages/test-data/src/lib/raw-reports';
  const path = join(__dirname, refPath, fileName);
  let report: string = readFileSync(path, 'utf-8').trim();
  report = report[1] === ' ' ? '| ' + report.slice(2) : report;
  if (fileName.endsWith('.json')) {
    return JSON.parse(report as string);
  }
  return report as unknown as T;
}

const pupeteerReplay = getReportContent('pupeteer-replay.json');
const userFlowReplay = getReportContent('userflow-replay.json');

describe('replay', () => {

  it('should parse original replay script without changes', () => {
    expect(pupeteerReplay['steps']).toBeDefined();

    expect(parse(pupeteerReplay)).toEqual(pupeteerReplay);
  });

  it('should parse user-flow enriched replay script without changes', () => {
    expect(userFlowReplay['steps']).toBeDefined();

    expect(parse(userFlowReplay)).toEqual(userFlowReplay);
  });

});
