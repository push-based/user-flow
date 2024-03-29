import {
  CollectArgvOptions,
  CollectCommandCfg,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from '../options/types';
import { AssertArgvOptions } from '../../assert/options';
import { CollectOptions } from '../options';


export function getCollectCommandOptionsFromArgv(argv: CollectOptions): CollectCommandCfg {

  const {
    url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport,
    outPath, format,
    budgetPath, budgets, configPath, config
  } = (argv || {}) as any as (keyof CollectRcOptions & keyof PersistRcOptions);

  let collect = {} as CollectArgvOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);
  configPath && (collect.configPath = configPath);
  config && (collect.config = config);
  // cli only
  dryRun !== undefined && (collect.dryRun = Boolean(dryRun));

  let persist = {} as PersistArgvOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);
  // cli only
  openReport !== undefined && (persist.openReport = Boolean(openReport));

  let assert = {} as AssertArgvOptions;
  budgetPath && (assert.budgetPath = budgetPath);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert };
}
