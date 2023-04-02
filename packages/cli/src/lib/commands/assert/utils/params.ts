import { AssertArgvOptions, AssertCommandCfg, AssertRcOptions } from '../options/types';
import { RcJsonAsArgv } from '../../../types';
import {
  CollectArgvOptions,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from '../../collect/options/types';

export function getArgvOptionsFromRc(cfg: AssertCommandCfg): RcJsonAsArgv {
  const { collect, persist, assert } = cfg;
  return { ...collect, ...persist, ...assert } as RcJsonAsArgv;
}

export function getAssertCommandOptionsFromArgv(argv: RcJsonAsArgv): AssertCommandCfg {

  const {
    outPath, format,
    budgetPath, budgets
  } = (argv || {}) as any as (keyof CollectRcOptions & keyof PersistRcOptions & keyof AssertRcOptions);

  let collect = {} as CollectArgvOptions;

  // optional
  // cli only

  let persist = {} as PersistArgvOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);
  // cli only

  let assert = {} as AssertArgvOptions;
  budgetPath && (assert.budgetPath = budgetPath);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert };
}
