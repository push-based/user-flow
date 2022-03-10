import { argv, Options } from 'yargs';
import { Param } from './url.model';
import { ArgvT } from '../../../internal/yargs/model';

export const param: Param = {
  url: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze',
    // demandOption: true
  }
};

export function get(): string {
  const { url } = argv as any as ArgvT<Param>;
  return url;
}
