import { CollectOptions, RcArgvOptions } from './types';
import { CoreOptionsArgv } from '../options/types';
import { ArgvPreset } from '../../types';
import { getCliMode } from '../cli-mode/cli-modes';

export const DEFAULT_PRESET = {

};
export const CI_PRESET: Partial<CoreOptionsArgv & RcArgvOptions> = {
  format: ['md', 'json'],
  interactive: false,
  openReport: false
};

export const SANDBOX_PRESET: ArgvPreset = {
  dryRun: true,
  interactive: false,
  openReport: false
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
