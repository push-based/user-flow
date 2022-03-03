import { Options } from 'yargs';
import { getCliParam, getBooleanParam, getStringParam } from './internal/yargs/utils';
import { interactiveParam, verboseParam } from './internal/yargs/options';

const cfgPathParam = {
  cfgPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flow.config.json`'
  } as Options
};

/**
 * Check for cfgPath params from cli command
 */
export function getCfgPath(): string {
  const argPath = getCliParam(['cfgPath', 'p']);
  return getStringParam(argPath);
}

const targetUrlParam = {
  targetUrl: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze'
  } as Options
};

/**
 * Check for targetUrl params from cli command
 */
export function getTargetUrl(): string {
  const argPath = getCliParam(['targetUrl', 't']);
  return getStringParam(argPath);
}

const ufPathParam = {
  ufPath: {
    alias: 'f',
    type: 'string',
    description: 'folder containing user-flow files to run. (`*.uf.ts` or `*.uf.js`)'
  } as Options
};

/**
 * Check for ufPath params from cli command
 */
export function getUfPath(): string {
  const argPath = getCliParam(['ufPath', 'f']);
  return getStringParam(argPath);
}

const outPathParam = {
  outPath: {
    alias: 'o',
    type: 'string',
    description: 'output folder for the user-flow reports'
  } as Options
};

/**
 * Check for outPath params from cli command
 */
export function getOutPath(): string {
  const argPath = getCliParam(['outPath', 'o']);
  return getStringParam(argPath);
}

const openParam = {
  open: {
    alias: 'e',
    type: 'boolean',
    description: 'Opens browser automatically after the user-flow is captured. (true by default)'
  } as Options
};

/**
 * Check for open params from cli command
 */
export function getOpen(): boolean {
  const argPath = getCliParam(['open', 'e']);
  return getBooleanParam(argPath);
}

export const options: Record<string, Options> = {
  ...cfgPathParam,
  ...targetUrlParam,
  ...ufPathParam,
    ...outPathParam,
    ...openParam,
    ...verboseParam,
   ...interactiveParam
};
