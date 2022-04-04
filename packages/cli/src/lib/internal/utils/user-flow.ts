import { readdirSync } from 'fs';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import {
  UserFlowProvider,
  UserFlowMock
} from '../../types/model';
import { resolveAnyFile, toFileName, writeFile } from './file';
import { join, normalize } from 'path';
import { logVerbose } from '../../core/loggin';
import { get as dryRun } from '../../core/options/dryRun';
import { PersistOptions } from '../config/model';

export async function persistFlow(flow: UserFlow, name: string, { outPath }: PersistOptions): Promise<string> {
  const report = await flow.generateReport();
  const fileName = join(outPath, `${toFileName(name)}.uf.html`);
  writeFile(fileName, report);
  return fileName;
}

export async function collectFlow(
  collectOptions: { url: string, dryRun: boolean },
  userFlowProvider: UserFlowProvider & {path: string}
) {
  let { launchOptions, flowOptions, interactions } = userFlowProvider;
  // @TODO consider CI vs dev mode => headless, open, persist etc
  // if dryRun run in headful mode for better debugging
  launchOptions && (launchOptions.headless = collectOptions.dryRun ? false : launchOptions.headless)
  launchOptions = launchOptions || { headless: !collectOptions.dryRun, defaultViewport: { isMobile: true, isLandscape: false, width: 800, height: 600  }  };
  logVerbose(`Collect: ${flowOptions.name} from URL ${collectOptions.url}`);
  logVerbose(`File path: ${normalize(userFlowProvider.path)}`);
  let start = Date.now();

  // setup ppt, and start flow
  logVerbose(`launchOptions: ${JSON.stringify(launchOptions)}`);
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();

  const flow: UserFlow = !dryRun() ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

export function loadFlow(path: string): ({exports: UserFlowProvider, path: string})[] {
  let ufDirectory = [];
  try {
    ufDirectory = readdirSync(path)
  } catch (e) {
    throw new Error(`ufPath: ${path} is no directory`)
  }
  const flows = readdirSync(path).map((p) => resolveAnyFile<UserFlowProvider & {path: string}>(join(path, p)));
  return flows;
}

