import { getBooleanParam, getCliParam } from './utils';
import { Options } from 'yargs';

export const verboseParam = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  } as Options
};

/**
 * Check for verbose params from cli command
 */
export function getVerboseFlag(): boolean {
  const argPath = getCliParam(['verbose', 'v']);
  return !!argPath;
}


export const interactiveParam = {
  interactive: {
    type: 'boolean',
    description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
    default: true
  } as Options
};

/**
 * Check for path params from cli command
 */
export function getInteractive(): boolean {
  const argPath = getCliParam(['interactive']);
  return getBooleanParam(argPath);
}
