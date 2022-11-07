import { get as dryRun } from '../../../../commands/collect/options/dryRun';
import { get as openOpt } from '../../options/open';
import { get as interactive } from '../../../../global/options/interactive';
import { logVerbose } from '../../../../core/loggin';
import * as openFileInBrowser from 'open';

export async function openFlowReport(fileNames: string[]): Promise<void> {
  // open report if requested and not in executed in CI
  if (openOpt()) {

    const htmlReport = fileNames.find(i => i.includes('.html'));
    if (htmlReport) {
      logVerbose('open HTML report in browser');
      await openFileInBrowser(htmlReport, { wait: false });
      return Promise.resolve(void 0);
    }

    const mdReport = fileNames.find(i => i.includes('.md'));
    if (mdReport) {
      logVerbose('open Markdown report in browser');
      await openFileInBrowser(mdReport, { wait: false });
      return Promise.resolve(void 0);
    }

    const jsonReport = fileNames.find(i => i.includes('.json'));
    if (jsonReport) {
      logVerbose('open JSON report in browser');
      // @TODO if JSON is given open the file in https://googlechrome.github.io/lighthouse/viewer/
      await openFileInBrowser(jsonReport, { wait: false });
    }
  }
  return Promise.resolve(void 0);
}
