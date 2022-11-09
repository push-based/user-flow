import { RcArgvOptions } from './types';
import { GlobalOptionsArgv } from '../options/types';
import { ArgvPreset } from '../../types';
import { getCliMode } from '../cli-mode/cli-modes';

export const DEFAULT_PRESET = {
  // GLOBAL
  interactive: true,
  verbose: false,
  // PERSIST COMMAND
  openReport: true,
  format: ['html']
};

export const CI_PRESET: Partial<GlobalOptionsArgv & RcArgvOptions> = {
  // GLOBAL
  interactive: false,
  verbose: false,
  // PERSIST COMMAND
  openReport: false,
  format: ['md', 'json']
};

export const SANDBOX_PRESET: ArgvPreset = {
  // GLOBAL
  verbose: true,
  interactive: true,
  // COLLECT COMMAND
  openReport: false,
  dryRun: true,
};

export function getEnvPreset(): ArgvPreset  {
  const m = getCliMode();
  if(m === 'SANDBOX') {
    return SANDBOX_PRESET;
  }
  if(m === 'CI') {
    return CI_PRESET;
  }
  return DEFAULT_PRESET;
}
