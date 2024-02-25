import { AssertRcOptions } from '../../assert/options/types';
import { CollectRcOptions, PersistRcOptions } from '../../collect/options/types';

export type InitCliOnlyOptions = {
  generateFlow?: boolean;
  generateGhWorkflow?: boolean;
  generateBudgets?: boolean;
  lhr?: string;
}

export type InitArgvOptions = CollectRcOptions & PersistRcOptions & AssertRcOptions & InitCliOnlyOptions;

export type InitCommandArgv = InitArgvOptions;
