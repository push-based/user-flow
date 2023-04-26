import { GlobalOptionsArgv } from './global/options/types.js';
import {
  CollectArgvOptions,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from './commands/collect/options/types.js';
import { AssertArgvOptions, AssertRcOptions } from './commands/assert/options/types.js';

export type ArgvPreset =
  { rcPath: GlobalOptionsArgv['rcPath'] } &
  Partial<Omit<GlobalOptionsArgv, 'rcPath'> &
    CollectArgvOptions &
    PersistArgvOptions &
    AssertArgvOptions>

export type RcJson = {
  collect: CollectRcOptions;
  persist: PersistRcOptions;
  assert?: AssertRcOptions;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & Object;

export type RcJsonAsArgv = CollectRcOptions & PersistRcOptions & AssertRcOptions;

