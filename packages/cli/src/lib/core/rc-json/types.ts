import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type CollectOptions = {
  url: string,
  ufPath: string,
  // @TODO get better typing for if serveCommand is given await is required
  serveCommand?: string,
  awaitServeStdout?: string
}

export type PersistOptions = {
  outPath: string,
  format: string[]
}
export type AssertOptions = {
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets'] | string
}
