import { Config } from 'lighthouse';

import { Param as OpenReport } from './openReport.model.js';
import { Param as UfPath } from './ufPath.model.js';
import { Param as Url } from './url.model.js';
import { Param as ServeCommand } from './serveCommand.model.js';
import { Param as AwaitServeStdout } from './awaitServeStdout.model.js';
import { Param as OutPath } from './outPath.model.js';
import { Param as Format } from './format.model.js';
import { AssertArgvOptions } from '../../assert/options/types.js';

export type PersistYargsOptions = OpenReport & OutPath & Format;
export type CollectYargsOptions = UfPath & OutPath & Url & ServeCommand & AwaitServeStdout;

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
