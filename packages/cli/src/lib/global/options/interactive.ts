import { argv } from 'yargs';
import { Param } from './interactive.model';
import { GlobalOptionsArgv } from './types';
import { getEnvPreset } from '../rc-json/pre-set';

export const param: Param = {
  interactive: {
    alias: 'i',
    type: 'boolean',
    description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
    default: getEnvPreset().interactive
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
  const { interactive } = argv as unknown as GlobalOptionsArgv;
  return interactive;
}
