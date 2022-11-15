import { ArgvPreset } from '../../types';
import { detectCliMode } from '../cli-mode/cli-mode';
import * as path from 'path';

const DEFAULT_RC_NAME = '.user-flowrc.json';
const DEFAULT_RC_PATH = `./`;

export const DEFAULT_PRESET: ArgvPreset = {
  // GLOBAL
  rcPath: path.join(DEFAULT_RC_PATH, DEFAULT_RC_NAME),
  interactive: true,
  verbose: false,
  // COLLECT COMMAND
  dryRun: false,
  // PERSIST COMMAND
  openReport: true,
  format: ['html']
};

export const SANDBOX_PRESET: ArgvPreset = mergeArgv(DEFAULT_PRESET, {
  // GLOBAL
  verbose: true,
  // COLLECT COMMAND
  openReport: false,
  dryRun: true
});

export const CI_PRESET: ArgvPreset = mergeArgv(DEFAULT_PRESET, {
  // GLOBAL
  interactive: false,
  // PERSIST COMMAND
  openReport: false,
  format: ['md', 'json']
});

function mergeArgv(cfg1: ArgvPreset, cfg2: Partial<ArgvPreset>): ArgvPreset {
  const merged: ArgvPreset = { ...cfg1 };
  Object.entries(cfg2).forEach((entry) => {
    const [k, v] = entry as [keyof ArgvPreset, any];
    switch (k) {
      case 'format':
        merged[k] = Array.from(new Set(merged[k]?.concat(v)));
        break;
      default:
        // @ts-ignore
        merged[k as any] = v;
        break;
    }
  });
  return merged;
}

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
