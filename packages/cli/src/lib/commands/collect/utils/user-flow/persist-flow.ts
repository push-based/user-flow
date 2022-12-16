import { UserFlow } from '../../../../hacky-things/lighthouse';
import FlowResult from 'lighthouse/types/lhr/flow';
import { generateMdReport } from '../../processes/generate-reports';
import { log, logVerbose } from '../../../../core/loggin';
import { join } from 'path';
import { toFileName, writeFile } from '../../../../core/file';
import { existsSync, mkdirSync } from 'fs';
import { PersistFlowOptions } from './types';


export async function persistFlow(
  flow: UserFlow,
  isoLikeDate: string, // <yyyyddmm>T<hhmmss> e.g. 20221216T202427
  { outPath, format, url }: PersistFlowOptions
): Promise<string[]> {
  if (!format.length) {
    format = ['stdout'];
  }

  const jsonReport: FlowResult = await flow.createFlowResult();

  const results: { format: string, out: string }[] = [];
  if (format.includes('json')) {
    results.push({ format: 'json', out: JSON.stringify(jsonReport) });
  }

  let mdReport: string | undefined = undefined;
  if (format.includes('md')) {
    mdReport = generateMdReport(jsonReport);
    results.push({ format: 'md', out: mdReport });
  }
  if (format.includes('stdout')) {
    mdReport = mdReport || generateMdReport(jsonReport);
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

  const fileNames = results.map((result) => {
    const fileName = `${url}-${toFileName(flow.name)}-${isoLikeDate}`;
    const filePath = join(outPath, `${fileName}.${result.format}`);
    writeFile(filePath, result.out);
    logVerbose(`Report path: ${filePath}.`);
    return filePath;
  });
  return fileNames;
}
