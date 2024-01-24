import { Config } from 'lighthouse';
import { AssertArgvOptions } from '../../assert/options/types.js';

export type CollectRcOptions = {
  url: string,
  ufPath: string,
  configPath?: string;
  config?: Config,
  // @TODO get better typing for if serveCommand is given await is required
  serveCommand?: string,
  awaitServeStdout?: string;
}
export type CollectCliOnlyOptions = {
  dryRun?: boolean;
}
export type CollectArgvOptions = CollectRcOptions & CollectCliOnlyOptions;

export type ReportFormat = 'html' | 'md' | 'json'  | 'stdout';
export type PersistRcOptions = {
  outPath: string,
  format: ReportFormat[]
}
export type PersistCliOnlyOptions = {
  openReport?: boolean;
}

export type PersistArgvOptions = PersistRcOptions & PersistCliOnlyOptions;

export type CollectCommandCfg = {
  collect: CollectArgvOptions,
  persist: PersistArgvOptions,
  assert?: AssertArgvOptions;
}

export type CollectCommandArgv = CollectArgvOptions & PersistArgvOptions & AssertArgvOptions;
