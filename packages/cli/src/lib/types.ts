import { Page } from 'puppeteer';
import { UserFlowContext } from './commands/collect/utils/user-flow/types';
import {
  AssertOptions,
  CollectOptions,
  PersistOptions,
} from './core/rc-json/types';

/**
 * This class is used in the user-flow interactions to ensure the context of the flow is available in UFO's
 */
export class Ufo {
  protected page: Page;

  constructor({ page }: UserFlowContext) {
    this.page = page;
  }
}

export type RcJson = {
  collect: CollectOptions;
  persist: PersistOptions;
  assert?: AssertOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export type RcArgvOptions = CollectOptions &
  PersistOptions &
  AssertOptions & { openReport?: boolean };
