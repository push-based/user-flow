import { AssertRcOptions, AssertYargsOptions } from '../../assert/options/types.js';
import {
  CollectRcOptions,
  CollectYargsOptions,
  PersistRcOptions,
  PersistYargsOptions
} from '../../collect/options/types.js';

export type InitYargsOptions = CollectYargsOptions & PersistYargsOptions & AssertYargsOptions;

export type InitCliOnlyOptions = {
  generateFlow?: boolean;
  generateGhWorkflow?: boolean;
  generateBudgets?: boolean;
  lhr?: string;
}

export type InitArgvOptions = CollectRcOptions & PersistRcOptions & AssertRcOptions & InitCliOnlyOptions;

export type InitCommandCfg = {
  collect: CollectRcOptions,
  persist: PersistRcOptions,
  assert?: AssertRcOptions;
} & InitCliOnlyOptions

export type InitCommandArgv = InitArgvOptions;
