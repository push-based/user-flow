import { argv } from 'yargs';
import { Param } from './rc.model';
import { ArgvT } from '../../internal/yargs/model';
import { CONFIG_NAME, CONFIG_PATH, USER_FLOWS_DIR } from '../../internal/config/constants';
import { join } from 'path';

export const param: Param = {
  rcPath: {
    alias: 'p',
    type: 'string',
    description: 'Path to user-flow.config.json. e.g. `./user-flow.config.json`'
  }
};

export function get(): string {
  const {rcPath} = argv as any as ArgvT<Param>;
  return rcPath || join(CONFIG_PATH, CONFIG_NAME);
}
