import { argv } from 'yargs';
import { Param } from './rc.model';
import { ArgvT } from '../../internal/yargs/model';
import { DEFAULT_RC_NAME, DEFAULT_RC_PATH, DEFAULT_COLLECT_UF_PATH } from '../../internal/config/constants';
import { join } from 'path';
import { logVerbose } from '../loggin';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`'
  }
};

export function get(): string {
  // we don't rely on yargs option normalization features as this can happen before cli bootstrap
  const {rcPath, p, ["rc-path"]: rc_path } = argv as any as ArgvT<any>;
  const pathToCfgRc = rcPath || rc_path || p
  return (pathToCfgRc as any as string) || join(DEFAULT_RC_PATH, DEFAULT_RC_NAME);
}
