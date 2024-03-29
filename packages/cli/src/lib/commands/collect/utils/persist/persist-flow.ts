import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { UserFlow } from '../../../../hacky-things/lighthouse';
import FlowResult from 'lighthouse/types/lhr/flow';
import { log, logVerbose } from '../../../../core/loggin';
import { writeFile } from '../../../../core/file';
import { PersistFlowOptions } from './types';
import { generateStdoutReport } from './utils';
import { createReducedReport, toReportName } from '../report/utils';
import { ReducedReport } from '../report/types';
import { generateMdReport } from '../../../assert/utils/md-report';

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
  const fileNames = results.map((result) => {
    const filePath = join(outPath, `${fileName}.${result.format}`);
    writeFile(filePath, result.out);
    logVerbose(`Report path: ${filePath}.`);
    return filePath;
  });
  return fileNames;
}
