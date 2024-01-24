import { ArgumentsCamelCase } from 'yargs';

import { InitArgvOptions } from './options/types.js';
import { CollectRcOptions, PersistRcOptions } from '../collect/options/types.js';
import { AssertRcOptions } from '../assert/options/types.js';
import { GlobalCliOptions } from '../../global/options/index.js';
import { InitOptions } from './options/index.js';
import { RcJson } from '../../types.js';

export function getCfgFromInitArgv(
  argv: ArgumentsCamelCase<GlobalCliOptions & InitOptions>
) {
  const collect: Partial<CollectRcOptions> = {};
  const { url, ufPath, serveCommand, awaitServeStdout, configPath } = argv;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);
  configPath && (collect.configPath = awaitServeStdout);

  const persist: Partial<PersistRcOptions> = {};
  const {outPath, format} = argv;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);

  const assert: Partial<AssertRcOptions> = {};
  const { budgetPath, budgets } = argv;
  budgetPath && (assert.budgetPath = budgetPath);
  // budgets && (assert.budgets = budgets); @TODO

  return {collect, persist, assert} as RcJson; // @TODO
}

export function getInitCommandOptionsFromArgv(argv: any) {
  let {
    generateFlow, generateGhWorkflow, generateBudgets, lhr,
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

  return { collect, persist, assert,
    generateFlow, generateGhWorkflow, generateBudgets, lhr
  };
}

