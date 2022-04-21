import Budget from 'lighthouse/types/lhr/budget';

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
  budgets?: Budget[],
}

export type RcJson = {
  collect: CollectOptions,
  persist: PersistOptions,
  assert?: AssertOptions,
} & Object;

export type RcArgvOptions = CollectOptions & PersistOptions & AssertOptions & { openReport?: boolean };

