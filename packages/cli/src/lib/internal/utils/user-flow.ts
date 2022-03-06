import { readdirSync } from 'fs';
import * as open from 'open';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import {
  UserFlowProvider,
  UserFlowCliConfig
} from '../../types/model';
import { resolveAnyFile, toFileName, writeFile } from './file';
import { join } from 'path';
import { logVerbose } from '../yargs/utils';
import { readRepoConfig } from '../config/config';
import { getOpen, getOutPath } from '../../options';
import { getInteractive } from '../yargs/options';

export function persistFlow(flow: UserFlow, name: string, { outPath }: UserFlowCliConfig['persist']): string {
  const report = flow.generateReport();
  const fileName = join(outPath, `${toFileName(name)}.user-flow-report.html`);
  writeFile(fileName, report);
  return fileName;
}

export async function collectFlow(
  collectOptions: UserFlowCliConfig['collect'],
  userFlowProvider: UserFlowProvider
) {
  let {launchOptions, flowOptions, interactions} = userFlowProvider;
  // @TODO consider CI vs dev mode
  launchOptions = launchOptions || { headless: false};
  logVerbose(`Capture user-flow report: "${flowOptions.name}" on URL ${collectOptions.url}`);

  // setup ppt, and start flow
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();
  const flow: UserFlow = await startFlow(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions });
  await browser.close();

  return flow;
}

export function loadFlow(path: string): UserFlowProvider[] {
  const flows = readdirSync(path).map((p) => resolveAnyFile<UserFlowProvider>(join(path, p)));
  return flows;
}

