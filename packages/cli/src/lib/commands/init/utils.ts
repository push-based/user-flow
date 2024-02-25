import { CollectRcOptions, PersistRcOptions } from '../collect/options/types';
import { AssertRcOptions } from '../assert/options/types';
import { InitOptions } from './options';

export function getInitCommandOptionsFromArgv(argv: InitOptions) {
  let {
    generateFlow, generateGhWorkflow, generateBudgets, lhr,
    url, ufPath, serveCommand, awaitServeStdout,
    outPath, format, budgetPath, budgets
  } = argv;

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
  budgets && (assert.budgets = budgets as any);

  return { collect, persist, assert,
    generateFlow, generateGhWorkflow, generateBudgets, lhr
  };
}

