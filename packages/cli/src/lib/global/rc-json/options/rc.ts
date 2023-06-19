import { argv } from 'yargs';
import { Param } from './rc.model';
import { getEnvPreset } from '../../../pre-set';
import { GlobalOptionsArgv } from '../../options/types';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
    default: getEnvPreset().rcPath,
  },
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath } = argv as unknown as GlobalOptionsArgv;
  return rcPath as string;
}
