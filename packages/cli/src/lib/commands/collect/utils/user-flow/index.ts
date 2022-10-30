import { readdirSync, existsSync, lstatSync } from 'fs';
import { log, logVerbose } from '../../../../core/utils/loggin';
import { cwd } from 'node:process';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';

import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { resolveAnyFile, toFileName, writeFile } from '../../../../core/utils/file';
import { join, normalize } from 'path';
import { get as dryRun } from '../../../../core/options/dryRun';
import { CollectOptions, PersistOptions } from '../../../../core/rc-json/types';
import { detectCliMode } from '../../../../cli-modes';
import { readBudgets } from '../../../assert/utils/budgets';
import Budget from 'lighthouse/types/lhr/budget';
import * as Config from 'lighthouse/types/config';
import { UserFlowMock } from './user-flow.mock';
import { UserFlowProvider } from './types';
import { get as openOpt } from '../../options/open';
import { get as interactive } from '../../../../core/options/interactive';
import * as openFileInBrowser from 'open';
import { userFlowReportToMdTable } from '../../../assert/processes/md-table';
import FlowResult from 'lighthouse/types/lhr/flow';


export async function persistFlow(flow: UserFlow, name: string, { outPath, format }: PersistOptions): Promise<string[]> {
  if (!format.length) {
    format = ['stdout']
  }

  const jsonReport: FlowResult = await flow.createFlowResult();


  const results: {format: string, out: any}[] = []
  if (format.includes('json')) {
    results.push({format: 'json', out: JSON.stringify(jsonReport)})
  }

  let mdReport: string | undefined = undefined;
  if (format.includes('md')) {
    // mdReport = userFlowReportToMdTable(jsonReport);

    results.push({format: 'md', out: mdReport})
  }
  if (format.includes('stdout')) {
    mdReport = mdReport || userFlowReportToMdTable(jsonReport);
    log(mdReport+'');
  }
  if (format.includes('html')) {
    const htmlReport = await flow.generateReport();
    results.push({format: 'html', out: htmlReport})
  }

  const fileNames = results.map((result) => {
    const fileName = join(outPath, `${toFileName(name)}.uf.${result.format}`);
    writeFile(fileName, result.out);
    return fileName
  });
  return fileNames;
}

export async function collectFlow(
  cliOption: CollectOptions & { dryRun: boolean },
  userFlowProvider: UserFlowProvider & { path: string }
) {
  let {
    path,
    // object containing the LH setting for budgets
    flowOptions: providerFlowOptions,
    interactions,
    launchOptions
  } = userFlowProvider;

  const { config, ...rest } = providerFlowOptions;
  const flowOptions = { ...rest, config: parseUserFlowOptionsConfig(providerFlowOptions.config) };

  // object containing the options for puppeteer/chromium
  launchOptions = launchOptions || {
    headless: false,
    // hack for dryRun => should get fixed inside user flow in future
    defaultViewport: { isMobile: true, isLandscape: false, width: 800, height: 600 }
  };
  // @TODO consider CI vs dev mode => headless, open, persist etc
  if (detectCliMode() !== 'DEFAULT') {
    logVerbose(`Set headless to true as we are running in ${detectCliMode()} mode`);
    launchOptions.headless = true;
  }
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${cliOption.url}`);
  logVerbose(`File path: ${normalize(path)}`);
  let start = Date.now();

  const flow: UserFlow = !dryRun() ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: cliOption });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

export function loadFlow(collect: CollectOptions): ({ exports: UserFlowProvider, path: string })[] {
  const {ufPath} = collect;
  const path = join(cwd(), ufPath);
  if (!existsSync(path)) {
    throw new Error(`ufPath: ${path} is no directory`);
  }

  let files: string[];
  if (lstatSync(path).isDirectory()) {
    files = readdirSync(path).map(file => join(path, file));
  } else {
    files = [ path ]
  }

  const flows = files.filter(f => f.endsWith('js') || f.endsWith('ts'))
    .map((file) => resolveAnyFile<UserFlowProvider & { path: string }>(file));

  if(flows.length === 0) {
    // @TODO use const for error msg
    throw new Error(`No user flows found in ${ufPath}`);
  }
  return flows;
}


export async function openFlowReport(fileNames: string[]): Promise<void> {
  // open report if requested and not in executed in CI
  if (!dryRun() && openOpt() && interactive()) {

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

function parseUserFlowOptionsConfig(flowOptionsConfig?: UserFlowProvider['flowOptions']['config']): Config.default.Json {
  flowOptionsConfig = flowOptionsConfig || {} as any;
  // @ts-ignore
  flowOptionsConfig?.extends || (flowOptionsConfig.extends = 'lighthouse:default');

  // if budgets are given
  if (flowOptionsConfig?.settings?.budgets) {
    logVerbose('format given budgets')
    let budgets: Budget[] = flowOptionsConfig?.settings?.budgets;
    budgets && (budgets = Array.isArray(budgets) ? budgets : readBudgets(budgets));
    flowOptionsConfig.settings.budgets = budgets;
  }

  return flowOptionsConfig as any as Config.default.Json;
}
