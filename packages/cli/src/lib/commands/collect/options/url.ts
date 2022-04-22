import { argv, Options } from 'yargs';
import { Param } from './url.model';
import { ArgvOption } from '../../../core/utils/yargs/types';

export const param: Param = {
  url: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze',
    // demandOption: true
  }
};

export function get(): string {
  const { url } = argv as any as ArgvOption<Param>;
  return url;
}
