import { argv } from 'yargs';
import { Param } from './rc.model';
import { ArgvOption } from '../../../core/yargs/types';
import { join } from 'path';
import { DEFAULT_RC_NAME, DEFAULT_RC_PATH } from './rc.constant';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
    default: join(DEFAULT_RC_PATH, DEFAULT_RC_NAME)
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath, p, ['rc-path']: rc_path } = argv as any as ArgvOption<any>;
  const pathToCfgRc = rcPath || rc_path || p;
  return (pathToCfgRc as any as string) || param.rcPath.default;
}
