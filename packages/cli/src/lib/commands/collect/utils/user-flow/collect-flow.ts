import { UserFlowProvider } from './types.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import * as puppeteer from 'puppeteer';
import { Browser, LaunchOptions, Page } from 'puppeteer';
import { normalize } from 'node:path';
import { startFlow, UserFlow } from 'lighthouse';
import { UserFlowMock } from './user-flow.mock.js';
import { detectCliMode } from '../../../../global/cli-mode/cli-mode.js';
import { CollectArgvOptions, PersistArgvOptions } from '../../options/types.js';
import { getLhConfigFromArgv, mergeLhConfig } from '../config/index.js';
import { CollectCommandOptions } from '../../options/index.js';

export async function collectFlow(
  cliOption: CollectArgvOptions & PersistArgvOptions,
  userFlowProvider: UserFlowProvider & { path: string },
  argv: CollectCommandOptions
) {
  const {
    path,
    flowOptions,
    interactions,
    launchOptions
  } = userFlowProvider;

  const globalLhCfg = getLhConfigFromArgv(cliOption);
  const lhConfig = mergeLhConfig(globalLhCfg, flowOptions?.config);
  flowOptions.config = lhConfig;

  const browser: Browser = await puppeteer.launch(parseLaunchOptions(launchOptions, argv));
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${cliOption.url}`);
  logVerbose(`User-flow path: ${normalize(path)}`);
  const start = Date.now();

  const flow: UserFlow = !argv.dryRun ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions) as unknown as UserFlow;

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: cliOption });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

export function parseLaunchOptions(
  launchOptions?: LaunchOptions,
  { dryRun }: { dryRun?: boolean } = {}
): LaunchOptions {
  // object containing the options for puppeteer/chromium
  launchOptions = launchOptions || {
    // has to be false to run in the CI because of a bug :(
    // https://github.com/puppeteer/puppeteer/issues/8148
    headless: false,
    // Only for dry runs. In a real run, a mobile viewport makes Puppeteer reload the page
    // when a recording's setViewport step sets isMobile: false.
    ...(dryRun && { defaultViewport: { isMobile: true, isLandscape: false, width: 800, height: 600 } }),
  };
  const cliMode = detectCliMode();
  // cli mode is "CI" or "SANDBOX"
  if (cliMode !== 'DEFAULT' && launchOptions) {
    // `true` is Chrome's new headless mode since Puppeteer v22, `'new'` is no longer a valid value
    logVerbose(`Set options#headless to true in puppeteer#launch as we are running in ${cliMode} mode`);
    launchOptions.headless = true;
  }

  return launchOptions;
}
