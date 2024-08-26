import { Options } from 'yargs';
import { REPORT_FORMAT_VALUES } from '../constants.js';

export const format = {
  alias: 'f',
  type: 'array',
  string: true,
  description: 'Report output formats e.g. JSON',
  choices: REPORT_FORMAT_VALUES,
} satisfies Options;
