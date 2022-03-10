import { readdirSync } from 'fs';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import {
  UserFlowProvider,
  UserFlowRcConfig
} from '../../types/model';
import { resolveAnyFile, toFileName, writeFile } from './file';
import { join } from 'path';
import { logVerbose } from '../../core/loggin/index';

export function persistFlow(flow: UserFlow, name: string, { outPath }: UserFlowRcConfig['persist']): string {
  const report = flow.generateReport();
  const fileName = join(outPath, `${toFileName(name)}.uf.html`);
  writeFile(fileName, report);
  return fileName;
}

export async function collectFlow(
  collectOptions: UserFlowRcConfig['collect'],
  userFlowProvider: UserFlowProvider
) {
  let {launchOptions, flowOptions, interactions} = userFlowProvider;
  // @TODO consider CI vs dev mode
  launchOptions = launchOptions || { headless: false};
  logVerbose(`Collect user-flow: "${flowOptions.name}" from URL ${collectOptions.url}`);
  let start = Date.now();
  // setup ppt, and start flow
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();
  const flow: UserFlow = await startFlow(page, flowOptions);
  // run custom interactions
  await interactions({ flow, page, browser, collectOptions });
  logVerbose(`duration: "${(Date.now() - start)/1000}`);
  await browser.close();

  return flow;
}

export function loadFlow(path: string): UserFlowProvider[] {
  const flows = readdirSync(path).map((p) => resolveAnyFile<UserFlowProvider>(join(path, p)));
  return flows;
}

