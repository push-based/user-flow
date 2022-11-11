import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type CollectOptions = {
  url: string,
  ufPath: string,
  // @TODO get better typing for if serveCommand is given await is required
  serveCommand?: string,
  awaitServeStdout?: string;
  dryRun?: boolean;
  openReport?: boolean;
}

export type PersistOptions = {
  outPath: string,
  format: string[]
}

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertOptions = {
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets'] | string
}
export type RcJson = {
  collect: CollectOptions;
  persist: PersistOptions;
  assert?: AssertOptions;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & Object;

export type RcArgvOptions = CollectOptions &
  PersistOptions &
  AssertOptions;
