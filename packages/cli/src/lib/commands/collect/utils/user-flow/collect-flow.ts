import { CollectOptions } from '../../../../global/rc-json/types';
import { UserFlowProvider } from './types';
import { logVerbose } from '../../../../core/loggin';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { normalize } from 'path';
import { startFlow, UserFlow } from '../../../../hacky-things/lighthouse';
import { get as dryRun } from '../../../../commands/collect/options/dryRun';
import { UserFlowMock } from './user-flow.mock';
import * as Config from 'lighthouse/types/config';
import Budget from 'lighthouse/types/lhr/budget';
import { readBudgets } from '../../../assert/utils/budgets';
import { detectCliMode } from '../../../../global/cli-mode/cli-mode';

export async function collectFlow(
  collectOptions: Pick<CollectOptions, 'url'>,
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
  // @TODO consider CI vs dev mode => headless, openReport, persist etc
  /*if (detectCliMode() !== 'DEFAULT') {
    logVerbose(`Set headless to true as we are running in ${detectCliMode()} mode`);
    launchOptions.headless = true;
  }*/
  const browser: Browser = await puppeteer.launch(launchOptions);
  const page: Page = await browser.newPage();

  logVerbose(`Collect: ${flowOptions.name} from URL ${collectOptions.url}`);
  logVerbose(`File path: ${normalize(path)}`);
  let start = Date.now();

  const flow: UserFlow = !dryRun() ? await startFlow(page, flowOptions) : new UserFlowMock(page, flowOptions);

  // run custom interactions
  await interactions({ flow, page, browser, collectOptions: { url: collectOptions.url } });
  logVerbose(`Duration: ${flowOptions.name}: ${(Date.now() - start) / 1000}`);
  await browser.close();

  return flow;
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
