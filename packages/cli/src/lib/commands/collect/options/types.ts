import { Param as OpenReport } from './openReport.model';
import { Param as UfPath } from './ufPath.model';
import { Param as Url } from './url.model';
import { Param as ServeCommand } from './serveCommand.model';
import { Param as AwaitServeStdout } from './awaitServeStdout.model';
import { Param as OutPath } from './outPath.model';
import { Param as Format } from './format.model';
import { AssertArgvOptions, AssertRcOptions } from '../../assert/options/types';
import { LhConfigJson } from '../../../../../../../dist/packages/cli/src/lib';

export type PersistYargsOptions = OpenReport & OutPath & Format;
export type CollectYargsOptions = UfPath & OutPath & Url & ServeCommand & AwaitServeStdout;

export type CollectRcOptions = {
  url: string,
  ufPath: string,
  configPath?: string;
  config?: LhConfigJson,
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
