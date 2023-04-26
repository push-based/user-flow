import { Param } from './url.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  url: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze',
    // demandOption: true
  }
};

export function get(): string {
  const { url } = yargs.argv as unknown as ArgvOption<Param>;
  return url;
}
