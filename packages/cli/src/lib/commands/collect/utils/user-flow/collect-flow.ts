import { UserFlowProvider } from './types.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import * as puppeteer from 'puppeteer';
import { Browser, LaunchOptions, Page } from 'puppeteer';
import { normalize } from 'path';
import { startFlow, UserFlow } from 'lighthouse';
import { UserFlowMock } from './user-flow.mock.js';
import { detectCliMode } from '../../../../global/cli-mode/cli-mode.js';
import { CollectArgvOptions } from '../../options/types.js';
import { getLhConfigFromArgv, mergeLhConfig } from '../config/index.js';
import { PersistArgvOptions } from '../../options/types.js';
import { AssertRcOptions } from '../../../assert/options.js';
import { CollectCommandOptions } from '../../options/index.js';

export async function collectFlow(
  cliOption: CollectArgvOptions & PersistArgvOptions & AssertRcOptions,
  userFlowProvider: UserFlowProvider & { path: string },
  argv: CollectCommandOptions
) {
  let {
    path,
    // object containing the LH setting for budgets
    // @TODO refactor typing
    flowOptions,
    interactions,
    launchOptions
  } = userFlowProvider;

  let globalLhCfg = getLhConfigFromArgv(cliOption);
  const lhConfig = mergeLhConfig(globalLhCfg, flowOptions?.config);
  flowOptions.config = lhConfig;

  const browser: Browser = await puppeteer.launch(parseLaunchOptions(launchOptions));
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${cliOption.url}`);
  logVerbose(`User-flow path: ${normalize(path)}`);
  let start = Date.now();

  const flow: UserFlow = !argv.dryRun ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions) as unknown as UserFlow;

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: cliOption });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

function parseLaunchOptions(launchOptions?: LaunchOptions): LaunchOptions {
  // object containing the options for puppeteer/chromium
  launchOptions = launchOptions || {
    // has to be false to run in the CI because of a bug :(
    // https://github.com/puppeteer/puppeteer/issues/8148
    headless: false,
    // hack for dryRun => should get fixed inside user flow in future
    defaultViewport: { isMobile: true, isLandscape: false, width: 800, height: 600 }
  } as LaunchOptions;
  const cliMode = detectCliMode();
  // cli mode is "CI" or "SANDBOX"
  if (cliMode !== 'DEFAULT' && launchOptions) {
    const headlessMode = 'new';
    logVerbose(`Set options#headless to ${headlessMode} in puppeteer#launch as we are running in ${cliMode} mode`);
    (launchOptions as any).headless = headlessMode;
  }

  return launchOptions;
}
