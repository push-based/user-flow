import { GlobalOptionsArgv } from './global/options/types.js';
import {
  CollectArgvOptions,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from './commands/collect/options/types.js';

export type ArgvPreset =
  { rcPath: GlobalOptionsArgv['rcPath'] } &
  Partial<Omit<GlobalOptionsArgv, 'rcPath'> & CollectArgvOptions & PersistArgvOptions>

export type RcJson = {
  collect: CollectRcOptions;
  persist: PersistRcOptions;
} & Object;
