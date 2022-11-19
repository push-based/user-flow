import { RcArgvOptions } from '../../..';
import {
  CollectArgvOptions,
  CollectCommandCfg,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from '../options/types';
import { AssertArgvOptions } from '../../assert/options/types';

export function getArgvOptionsFromRc(cfg: CollectCommandCfg): RcArgvOptions {
  const { collect, persist, assert } = cfg;
  return { ...collect, ...persist, ...assert } as RcArgvOptions;
}

export function getCollectCommandOptionsFromArgv(argv: RcArgvOptions): CollectCommandCfg {

  const {
    url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport,
    outPath, format, budgetPath, budgets
  } = (argv || {}) as any as (keyof CollectRcOptions & keyof PersistRcOptions);

  let collect = {} as CollectArgvOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);
  // cli only
  dryRun && (collect.dryRun = dryRun);

  let persist = {} as PersistArgvOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);
  // cli only
  persist && (persist.openReport = openReport);

  let assert = {} as AssertArgvOptions;
  budgetPath && (assert.budgetPath = budgetPath);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert };
}
