import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './rc.model.js';
import { getEnvPreset } from '../../../pre-set.js';
import { GlobalOptionsArgv } from '../../options/types.js';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
    default: getEnvPreset().rcPath
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath } = yargs.argv as unknown as GlobalOptionsArgv;
  return rcPath as string
}
