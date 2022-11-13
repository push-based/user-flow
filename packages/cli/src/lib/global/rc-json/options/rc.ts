import { argv } from 'yargs';
import { Param } from './rc.model';
import { ArgvOption } from '../../../core/yargs/types';
import { join } from 'path';
import { DEFAULT_RC_NAME, DEFAULT_RC_PATH } from './rc.constant';
import { getEnvPreset } from '../pre-set';

function getDefaultByCliMode(): string {
  return getEnvPreset().rcPath as string;
}
export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
    default: getDefaultByCliMode()
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath, p, ['rc-path']: rc_path } = argv as any as ArgvOption<any>;
  const pathToCfgRc = rcPath || rc_path || p;
  console.log('!!!!', pathToCfgRc, param.rcPath.default);
  return pathToCfgRc !== undefined ? pathToCfgRc : param.rcPath.default;
}
