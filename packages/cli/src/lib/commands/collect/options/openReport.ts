import { Options } from 'yargs';
import { getEnvPreset } from '../../../pre-set.js';

export const openReport = {
  alias: 'e',
  type: 'boolean',
  description: 'Opens browser automatically after the user-flow is collected. (true by default)',
  default: getEnvPreset().openReport,
  requiresArg: true
} satisfies Options;
