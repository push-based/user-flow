import { readdirSync, writeFileSync } from 'fs';
import * as open from 'open';
// @ts-ignore
import { startFlow, UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import {
  UserFlowInteractionsFn,
  UserFlowOptions,
  LaunchOptions,
  UserFlowProvider,
  UserFlowCliConfig
} from '../../types/model';
import { resolveAnyFile, toFileName } from './file';
import { join } from 'path';
import { logVerbose } from '../yargs/utils';
import { readRepoConfig } from '../config/config';
import { getOpen, getOutPath } from '../../options';
import { getInteractive } from '../yargs/options';

export function saveUserFlow(flow: UserFlow, name: string): string {
  const { outPath }: UserFlowCliConfig = readRepoConfig();
  const _outPath: string | false = outPath || getOutPath();
  if (_outPath == '') {
    throw new Error('Path to to save reports is required. Either through the console as `--outPath` or in the `user-flow.config.json`');
  }

  const report = flow.generateReport();
  const fileName = join(outPath, `${toFileName(name)}.user-flow-report.html`);
  writeFileSync(fileName, report);
  return fileName;
}

export async function captureUserFlow(
  baseUrl: string,
  userFlowProvider: UserFlowProvider
) {
  const {launchOptions, flowOptions, interactions} = userFlowProvider;
  logVerbose(`Capture user-flow report: ${flowOptions.name}`);

  // setup ppt, and start flow
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();
  const flow: UserFlow = await startFlow(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, baseUrl });
  await browser.close();

  // generate and save report
  const fileName = saveUserFlow(flow, flowOptions.name);

  // open report if requested and not in executed in CI
  if (getOpen() && !getInteractive()) {
    open(fileName, { wait: false });
  }
}

export function loadUserFlows(path: string): UserFlowProvider[] {
  const flows = readdirSync(path).map((p) => resolveAnyFile<UserFlowProvider>(join(path, p)));
  return flows;
}

