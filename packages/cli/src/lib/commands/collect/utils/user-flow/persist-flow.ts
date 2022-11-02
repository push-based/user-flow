import { UserFlow } from '../../../../hacky-things/lighthouse';
import { PersistOptions } from '../../../../core/rc-json/types';
import FlowResult from 'lighthouse/types/lhr/flow';
import { userFlowReportToMdTable } from '../../../assert/processes/md-table';
import { log } from '../../../../core/utils/loggin';
import { join } from 'path';
import { toFileName, writeFile } from '../../../../core/utils/file/file';

export async function persistFlow(flow: UserFlow, name: string, { outPath, format }: PersistOptions): Promise<string[]> {
  if (!format.length) {
    format = ['stdout'];
  }

  const jsonReport: FlowResult = await flow.createFlowResult();


  const results: { format: string, out: any }[] = [];
  if (format.includes('json')) {
    results.push({ format: 'json', out: JSON.stringify(jsonReport) });
  }

  let mdReport: string | undefined = undefined;
  if (format.includes('md')) {
    mdReport = userFlowReportToMdTable(jsonReport);
    results.push({ format: 'md', out: mdReport });
  }
  if (format.includes('stdout')) {
    mdReport = mdReport || userFlowReportToMdTable(jsonReport);
    log(mdReport + '');
  }
  if (format.includes('html')) {
    const htmlReport = await flow.generateReport();
    results.push({ format: 'html', out: htmlReport });
  }

  const fileNames = results.map((result) => {
    const fileName = join(outPath, `${toFileName(name)}.uf.${result.format}`);
    writeFile(fileName, result.out);
    return fileName;
  });
  return fileNames;
}