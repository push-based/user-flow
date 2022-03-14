import { readdirSync } from 'fs';
import * as open from 'open';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import {
  UserFlowProvider,
  UserFlowRcConfig, UserFlowMock
} from '../../types/model';
import { resolveAnyFile, toFileName, writeFile } from './file';
import { join } from 'path';
import { logVerbose } from '../../core/loggin';
import { get as dryRun } from '../../core/options/dryRun';


export function persistFlow(flow: UserFlow, name: string, { outPath }: UserFlowRcConfig['persist']): string {
  const report = flow.generateReport();
  const fileName = join(outPath, `${toFileName(name)}.uf.html`);
  writeFile(fileName, report);
  return fileName;
}

export async function collectFlow(
  collectOptions: UserFlowRcConfig['collect'],
  userFlowProvider: UserFlowProvider & {path: string}
) {
  let { launchOptions, flowOptions, interactions } = userFlowProvider;
  // @TODO consider CI vs dev mode => headless, open, persist etc
  launchOptions = launchOptions || { headless: false, defaultViewport: { isMobile: true, isLandscape: false,  width: 800, height: 600  }  };
  logVerbose(`Collect user-flow: "${flowOptions.name}" from URL ${collectOptions.url}`);
  logVerbose(`File path: ${userFlowProvider.path}`);
  let start = Date.now();
  // setup ppt, and start flow
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();

  const flow: UserFlow = !dryRun() ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions });
  logVerbose(`duration: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

export function loadFlow(path: string): ({exports: UserFlowProvider, path: string})[] {
  const flows = readdirSync(path).map((p) => resolveAnyFile<UserFlowProvider & {path: string}>(join(path, p)));
  return flows;
}

