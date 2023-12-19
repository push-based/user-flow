import { UserFlow } from '../../../../hacky-things/lighthouse.js';
// @ts-ignore
import FlowResult from 'lighthouse/types/lhr/flow';
import { log, logVerbose } from '../../../../core/loggin/index.js';
import { join } from 'path';
import { writeFile } from '../../../../core/file/index.js';
import { existsSync, mkdirSync } from 'fs';
import { PersistFlowOptions } from './types.js';
import { createReducedReport } from '../../../../index.js';
import { generateStdoutReport } from './utils.js';
import { toReportName } from '../report/utils.js';
import { ReducedReport } from '../report/types.js';
import { generateMdReport } from '../../../assert/utils/md-report.js';

export async function persistFlow(
  flow: UserFlow,
  { outPath, format, url }: PersistFlowOptions
): Promise<string[]> {
  if (!format.length) {
    format = ['stdout'];
  }

  const jsonReport: FlowResult = await flow.createFlowResult();
  const reducedReport: ReducedReport = createReducedReport(jsonReport);
  const results: { format: string, out: string }[] = [];
  if (format.includes('json')) {
    results.push({ format: 'json', out: JSON.stringify(jsonReport) });
  }

  let mdReport: string | undefined = undefined;

  if (format.includes('md')) {
    mdReport = generateMdReport(reducedReport);
    results.push({ format: 'md', out: mdReport });
  }

  if (format.includes('stdout')) {
    if(!mdReport) {
      mdReport = generateStdoutReport(reducedReport);
    }

    log(mdReport + '');
  }
  if (format.includes('html')) {
    const htmlReport = await flow.generateReport();
    results.push({ format: 'html', out: htmlReport });
  }

  if (!existsSync(outPath)) {
    try {
      mkdirSync(outPath, { recursive: true });
    } catch (e) {
      // @TODO use a constant instead of a string e.g. `OUT_PATH_NO_DIR_ERROR(dir)`
      throw new Error(`outPath: ${outPath} is no directory`);
    }
  }

  const fileName = toReportName(url, flow.name, reducedReport);
  return results.map((result) => {
    const filePath = join(outPath, `${fileName}.${result.format}`);
    writeFile(filePath, result.out);
    logVerbose(`Report path: ${filePath}.`);
    return filePath;
  });
}
