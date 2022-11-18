import { RcArgvOptions } from './types';
import { GlobalOptionsArgv } from '../options/types';
import { ArgvPreset } from '../../types';
import { detectCliMode } from '../cli-mode/cli-mode';
import * as path from 'path';

const DEFAULT_RC_NAME = '.user-flowrc.json';
const DEFAULT_RC_PATH = `./`;

export const DEFAULT_PRESET: Partial<GlobalOptionsArgv & RcArgvOptions> = {
  // GLOBAL
  rcPath: path.join(DEFAULT_RC_PATH, DEFAULT_RC_NAME),
  interactive: true,
  verbose: false,
  // PERSIST COMMAND
  openReport: true,
  format: []
};

export const CI_PRESET: Partial<GlobalOptionsArgv & RcArgvOptions> = {
  ...DEFAULT_PRESET,
  // GLOBAL
  interactive: false,
  verbose: false,
  // COLLECT COMMAND
  dryRun: true,
  // PERSIST COMMAND
  openReport: false
};

export const SANDBOX_PRESET: ArgvPreset = {
  ...DEFAULT_PRESET,
  // GLOBAL
  verbose: true,
  // COLLECT COMMAND
  dryRun: true,
  // PERSIST COMMAND
  openReport: false
};

export function getEnvPreset(): ArgvPreset  {
  const m = detectCliMode();
  if(m === 'SANDBOX') {
    return SANDBOX_PRESET;
  }
  if(m === 'CI') {
    return CI_PRESET;
  }
  return DEFAULT_PRESET;
}
