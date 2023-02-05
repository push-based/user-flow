import { UserFlowProvider } from './types';
import { logVerbose } from '../../../../core/loggin';
import * as puppeteer from 'puppeteer';
import { Browser, Page, LaunchOptions } from 'puppeteer';
import { normalize } from 'path';
import { LhConfigJson, startFlow, UserFlow } from '../../../../hacky-things/lighthouse';
import { get as dryRun } from '../../../../commands/collect/options/dryRun';
import { UserFlowMock } from './user-flow.mock';
import { detectCliMode } from '../../../../global/cli-mode/cli-mode';
import { CollectArgvOptions } from '../../options/types';
import { getLhConfigFromArgv, mergeLhConfig } from '../config';
import { readConfig } from '../../utils/config';
import { readBudgets } from '../../../assert/utils/budgets';
import * as Config from 'lighthouse/types/config';
import Budget from 'lighthouse/types/lhr/budget';

export async function collectFlow(
  cliOption: CollectArgvOptions,
  userFlowProvider: UserFlowProvider & { path: string }
) {
  let {
    path,
    // object containing the LH setting for budgets
    flowOptions: providerFlowOptions,
    interactions,
    launchOptions
  } = userFlowProvider;


  let { config, ...rest } = providerFlowOptions;
  // includes config, configPath, budgets, budgetPath
  let globalLhCfg = getLhConfigFromArgv(cliOption);
  const mergedConfig: LhConfigJson = mergeLhConfig(globalLhCfg, config as any);
  const flowOptions = { ...rest, config: mergedConfig };

  const browser: Browser = await puppeteer.launch(parseLaunchOptions(launchOptions));
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${cliOption.url}`);
  logVerbose(`User-flow path: ${normalize(path)}`);
  let start = Date.now();

  const flow: UserFlow = !dryRun() ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: cliOption });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
}

/*
function parseUserFlowOptionsConfig(flowOptionsConfig?: LhConfigJson): Config.default.Json {
  flowOptionsConfig = flowOptionsConfig || {} as any;
  // @ts-ignore
  flowOptionsConfig?.extends || (flowOptionsConfig.extends = 'lighthouse:default');

  // if budgets are given
  if (flowOptionsConfig?.settings?.budgets) {
    logVerbose('Use budgets from UserFlowProvider objects under the flowOptions.settings.budgets property');
    let budgets: Budget[] = flowOptionsConfig?.settings?.budgets;
    budgets && (budgets = Array.isArray(budgets) ? budgets : readBudgets(budgets));
    flowOptionsConfig.settings.budgets = budgets;
  }

  return flowOptionsConfig as any as Config.default.Json;
}
*/
function parseLaunchOptions(launchOptions?: LaunchOptions): LaunchOptions {
  // object containing the options for puppeteer/chromium
  launchOptions = launchOptions || {
    // has to be false to run in the CI because of a bug :(
    // https://github.com/puppeteer/puppeteer/issues/8148
    headless: false,
    // hack for dryRun => should get fixed inside user flow in future
    defaultViewport: { isMobile: true, isLandscape: false, width: 800, height: 600 }
  } as any;
  // @TODO consider CI vs dev mode => headless, openReport, persist etc
  const cliMode = detectCliMode();
  // cli mode is "CI" or "SANDBOX"
  if (cliMode !== 'DEFAULT' && launchOptions) {
    const headlessMode = true;
    logVerbose(`Set options#headless to ${headlessMode} in puppeteer#launch as we are running in ${cliMode} mode`);
    (launchOptions as any).headless = headlessMode;
  }

  return launchOptions as any;
}
