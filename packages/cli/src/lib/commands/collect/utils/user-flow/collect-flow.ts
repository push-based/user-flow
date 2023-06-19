import {UserFlowProvider} from './types';
import {logVerbose} from '../../../../core/loggin';
import * as puppeteer from 'puppeteer';
import {Browser, LaunchOptions, Page} from 'puppeteer';
import {normalize} from 'path';
// @ts-ignore
import {startFlow, UserFlow,} from 'lighthouse/lighthouse-core/fraggle-rock/api';
import {get as dryRun} from '../../../../commands/collect/options/dryRun';
import {UserFlowMock} from './user-flow.mock';
import {detectCliMode} from '../../../../global/cli-mode/cli-mode';
import {CollectArgvOptions, PersistArgvOptions} from '../../options/types';
import {getLhConfigFromArgv, mergeLhConfig} from '../config';
import {AssertRcOptions} from '../../../assert/options/types';

export async function collectFlow(
  cliOption: CollectArgvOptions & PersistArgvOptions & AssertRcOptions,
  userFlowProvider: UserFlowProvider & { path: string }
) {
  let {
    path,
    // object containing the LH setting for budgets
    // @TODO refactor typing
    flowOptions,
    interactions,
    launchOptions,
  } = userFlowProvider;

  let globalLhCfg = getLhConfigFromArgv(cliOption);
  const lhConfig = mergeLhConfig(globalLhCfg, flowOptions?.config);
  flowOptions.config = lhConfig;

  const browser: Browser = await puppeteer.launch(
    parseLaunchOptions(launchOptions)
  );
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${cliOption.url}`);
  logVerbose(`User-flow path: ${normalize(path)}`);
  let start = Date.now();

  const flow: UserFlow = !dryRun()
    ? await startFlow(page, flowOptions)
    : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: cliOption });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

function parseLaunchOptions(launchOptions?: LaunchOptions): LaunchOptions {
  // object containing the options for puppeteer/chromium
  launchOptions =
    launchOptions ||
    ({
      // has to be false to run in the CI because of a bug :(
      // https://github.com/puppeteer/puppeteer/issues/8148
      headless: false,
      // hack for dryRun => should get fixed inside user flow in future
      defaultViewport: {
        isMobile: true,
        isLandscape: false,
        width: 800,
        height: 600,
      },
    } as LaunchOptions);
  const cliMode = detectCliMode();
  // cli mode is "CI" or "SANDBOX"
  if (cliMode !== 'DEFAULT' && launchOptions) {
    const headlessMode = true;
    logVerbose(
      `Set options#headless to ${headlessMode} in puppeteer#launch as we are running in ${cliMode} mode`
    );
    (launchOptions as any).headless = headlessMode;
  }

  return launchOptions;
}
