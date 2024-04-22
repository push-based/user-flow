import openReport from 'open';
import { logVerbose } from '../../../../core/loggin';
import { CollectCommandOptions } from '../../options';

export async function openFlowReports(fileNames: string[]): Promise<void> {
  const htmlReport = fileNames.find(i => i.includes('.html'));
  if (htmlReport) {
    logVerbose('open HTML report in browser');
    await openReport(htmlReport, { wait: false });
    return Promise.resolve(void 0);
  }

  const mdReport = fileNames.find(i => i.includes('.md'));
  if (mdReport) {
    logVerbose('open Markdown report in browser');
    await openReport(mdReport, { wait: false });
    return Promise.resolve(void 0);
  }

  const jsonReport = fileNames.find(i => i.includes('.json'));
  if (jsonReport) {
    logVerbose('open JSON report in browser');
    // @TODO if JSON is given open the file in https://googlechrome.github.io/lighthouse/viewer/
    await openReport(jsonReport, { wait: false });
  }
  return Promise.resolve(void 0);
}

export function handleOpenFlowReports({ dryRun, openReport, interactive}: CollectCommandOptions) {
  if (dryRun || !openReport || !interactive) {
    return;
  }
  return openFlowReports;
}
