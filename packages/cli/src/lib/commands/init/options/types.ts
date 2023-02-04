import { AssertRcOptions, AssertYargsOptions } from '../../assert/options/types';
import {
  CollectCliOnlyOptions,
  CollectRcOptions,
  CollectYargsOptions, PersistCliOnlyOptions, PersistRcOptions,
  PersistYargsOptions
} from '../../collect/options/types';
import { YargsArgvOptionFromParamsOptions } from '../../../core/yargs/types';

export type InitYargsOptions = CollectYargsOptions & PersistYargsOptions & AssertYargsOptions;


export type InitCliOnlyOptions = {
  generateFlow?: boolean;
  generateGhWorkflow?: boolean;
}

export type InitArgvOptions = CollectRcOptions & PersistRcOptions & AssertRcOptions & InitCliOnlyOptions;

export type InitCommandCfg = {
  collect: CollectRcOptions,
  persist: PersistRcOptions,
  assert?: AssertRcOptions;
} & InitCliOnlyOptions

export type InitCommandArgv = InitArgvOptions;
