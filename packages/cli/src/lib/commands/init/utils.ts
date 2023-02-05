import { InitArgvOptions } from './options/types';
import { CollectRcOptions, PersistRcOptions } from '../collect/options/types';
import { AssertRcOptions } from '../assert/options/types';

export function getInitCommandOptionsFromArgv(argv: any) {
  let {
    generateFlow, generateGhWorkflow,
    url, ufPath, serveCommand, awaitServeStdout,
    outPath, format, budgetPath, budgets
  } = argv as unknown as InitArgvOptions;

  let collect = {} as CollectRcOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);

  let persist = {} as PersistRcOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);

  let assert = {} as AssertRcOptions;
  budgetPath && (assert.budgetPath = budgetPath);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert, generateFlow, generateGhWorkflow };
}

