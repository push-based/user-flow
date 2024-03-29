import { GlobalOptionsArgv } from './global/options/types';
import {
  CollectArgvOptions,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from './commands/collect/options/types';
import { AssertArgvOptions, AssertRcOptions } from './commands/assert/options';

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
} & Object;
