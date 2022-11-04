import { argv } from 'yargs';
import { Param } from './rc.model';
import { ArgvOption } from '../../../core/yargs/types';
import { join } from 'path';
import { logVerbose } from '../../../core/loggin';
import { DEFAULT_RC_NAME, DEFAULT_RC_PATH } from './rc.constant';
import { DEFAULT_COLLECT_UF_PATH } from '../../../commands/collect/options/ufPath.constant';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`'
  }
};

export function get(): string {
  // we don't rely on yargs option normalization features as this can happen before cli bootstrap
  const {rcPath, p, ["rc-path"]: rc_path } = argv as any as ArgvOption<any>;
  const pathToCfgRc = rcPath || rc_path || p
  return (pathToCfgRc as any as string) || join(DEFAULT_RC_PATH, DEFAULT_RC_NAME);
}
