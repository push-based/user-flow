import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

import { UserFlow, FlowResult } from 'lighthouse';

import { log, logVerbose } from '../../../../core/loggin/index.js';
import { writeFile } from '../../../../core/file/index.js';
import { PersistFlowOptions } from './types.js';
import { createReducedReport, ReportFormat } from '../../../../index.js';
import { generateStdoutReport } from './utils.js';
import { toReportName } from '../report/utils.js';
import { ReducedReport } from '../report/types.js';
import { generateMdReport } from '../../../assert/utils/md-report.js';
import { REPORT_FORMAT } from '../../../init/constants.js';

export async function persistFlow(
  flow: UserFlow,
  { outPath, format, url }: PersistFlowOptions
): Promise<string[]> {
  if (!format.length) {
    format = [REPORT_FORMAT.Stdout];
  }

  const jsonReport: FlowResult = await flow.createFlowResult();
  const reducedReport: ReducedReport = createReducedReport(jsonReport);
  const results: { format: ReportFormat, out: string }[] = [];
  if (format.includes(REPORT_FORMAT.JSON)) {
    results.push({ format: REPORT_FORMAT.JSON, out: JSON.stringify(jsonReport) });
  }

  let mdReport: string | undefined = undefined;

  if (format.includes(REPORT_FORMAT.Markdown)) {
    mdReport = generateMdReport(reducedReport);
    results.push({ format: REPORT_FORMAT.Markdown, out: mdReport });
  }

  if (format.includes(REPORT_FORMAT.Stdout)) {
    if(!mdReport) {
      mdReport = generateStdoutReport(reducedReport);
    }

    log(mdReport + '');
  }
  if (format.includes(REPORT_FORMAT.HTML)) {
    const htmlReport = await flow.generateReport();
    results.push({ format: REPORT_FORMAT.HTML, out: htmlReport });
  }

  const fileFormats: ReportFormat[] = [REPORT_FORMAT.HTML, REPORT_FORMAT.JSON, REPORT_FORMAT.Markdown];
  const containsFileFormat: boolean = format.some(v => fileFormats.includes(v));
  if (!containsFileFormat) {
    return [];
  }

  if (!existsSync(outPath)) {
    try {
      mkdirSync(outPath, { recursive: true });
    } catch (e) {
      // @TODO use a constant instead of a string e.g. `OUT_PATH_NO_DIR_ERROR(dir)`
      throw new Error(`outPath: ${outPath} is no directory`);
    }
  }

  // @TODO Define correct fallback for missing name!
  const fileName = toReportName(url, flow._options?.name ?? 'flow-results', reducedReport);

  const mappedResults = results.map((result) => {
    const filePath = join(outPath, `${fileName}.${result.format}`);
    const persist = writeFile(filePath, result.out);
    return { ...results, filePath, persist };
  });

  await Promise.all(mappedResults.map(({ persist }) => persist));

  return mappedResults.map(({ filePath }) => filePath);
}
