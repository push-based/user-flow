import { GlobalOptionsArgv } from './global/options/types';
import {
  CollectArgvOptions,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from './commands/collect/options/types';
import { AssertArgvOptions, AssertRcOptions } from './commands/assert/options/types';

export type ArgvPreset = Partial<GlobalOptionsArgv &
  CollectArgvOptions &
  PersistArgvOptions &
  AssertArgvOptions>

export type RcJson = {
  collect: CollectRcOptions;
  persist: PersistRcOptions;
  assert?: AssertRcOptions;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & Object;
