import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { UserFlow, FlowResult } from 'lighthouse';
import { log, logVerbose } from '../../../../core/loggin/index.js';
import { writeFile } from '../../../../core/file/index.js';
import { PersistFlowOptions } from './types.js';
import { generateStdoutReport } from './utils.js';
import { createReducedReport, toReportName } from '../report/utils.js';
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
    mdReport = await generateMdReport(reducedReport);
    results.push({ format: 'md', out: mdReport });
  }

  if (format.includes('stdout')) {
    if(!mdReport) {
      mdReport = await generateStdoutReport(reducedReport);
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

  const fileName = toReportName(url, flow._options?.name || '', reducedReport);
  const fileNames = results.map((result) => {
    const filePath = join(outPath, `${fileName}.${result.format}`);
    writeFile(filePath, result.out);
    logVerbose(`Report path: ${filePath}.`);
    return filePath;
  });
  return fileNames;
}
