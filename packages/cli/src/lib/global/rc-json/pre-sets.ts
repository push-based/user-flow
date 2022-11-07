import { RcArgvOptions } from './types';
import { GlobalOptionsArgv } from '../options/types';
import { ArgvPreset } from '../../types';
import { getCliMode } from '../cli-mode/cli-modes';

export const DEFAULT_PRESET = {

};

export const CI_PRESET: Partial<GlobalOptionsArgv & RcArgvOptions> = {
  // global
  interactive: false,
  openReport: false,
  // collect
  format: ['md', 'json']
};

export const SANDBOX_PRESET: ArgvPreset = {
  // global
  interactive: false,
  verbose: true,
  // collect
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
