import { Config } from 'lighthouse';
import { AssertArgvOptions } from '../../assert/options/types.js';
import { REPORT_FORMAT } from '../../init/constants.js';

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

type ReportFormatKeys = keyof typeof REPORT_FORMAT;
export type ReportFormat = typeof REPORT_FORMAT[ReportFormatKeys];
export type PersistRcOptions = {
  outPath: string,
  format: ReportFormat[]
}
export type PersistCliOnlyOptions = {
  openReport?: boolean;
}

export type PersistArgvOptions = PersistRcOptions & PersistCliOnlyOptions;

export type CollectCommandArgv = CollectArgvOptions & PersistArgvOptions & AssertArgvOptions;
