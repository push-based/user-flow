import { ArgvPreset } from './types.js';
import { detectCliMode } from './global/cli-mode/cli-mode.js';
import { DEFAULT_FULL_RC_PATH } from './constants.js';

export const DEFAULT_PRESET: ArgvPreset = {
  // GLOBAL
  rcPath: DEFAULT_FULL_RC_PATH,
  interactive: true,
  verbose: false,
  // PERSIST COMMAND
  openReport: true,
  format: ['html']
};

export const CI_PRESET: ArgvPreset = {
  ...DEFAULT_PRESET,
  // GLOBAL
  interactive: false,
  verbose: false,
  // COLLECT COMMAND
  dryRun: false,
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

export function getEnvPreset(): ArgvPreset {
  const m = detectCliMode();
  if (m === 'SANDBOX') {
    return SANDBOX_PRESET;
  }
  if (m === 'CI') {
    return CI_PRESET;
  }
  return DEFAULT_PRESET;
}
