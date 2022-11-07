import { RcArgvOptions } from './types';
import { GlobalOptionsArgv } from '../options/types';
import { ArgvPreset } from '../../types';
import { getCliMode } from '../cli-mode/cli-modes';

export const DEFAULT_PRESET = {
  // GLOBAL
  interactive: true,
  openReport: true,
  // PERSIST COMMAND
  format: ['html']
};

export const CI_PRESET: Partial<GlobalOptionsArgv & RcArgvOptions> = {
  // GLOBAL
  interactive: false,
  openReport: false,
  // PERSIST COMMAND
  format: ['md', 'json']
};

export const SANDBOX_PRESET: ArgvPreset = {
  // GLOBAL
  verbose: true,
  // COLLECT COMMAND
  openReport: false,
  dryRun: true,
};

export function getEnvPreset(): ArgvPreset  {
  const m = getCliMode();
  if(m === 'SANDBOX') {
    console.log('SANDBOX_PRESET', SANDBOX_PRESET);
    return SANDBOX_PRESET;
  }
  if(m === 'CI') {
    console.log('CI_PRESET', CI_PRESET);
    return CI_PRESET;
  }
  console.log('DEFAULT_PRESET', DEFAULT_PRESET);
  return DEFAULT_PRESET;
}
