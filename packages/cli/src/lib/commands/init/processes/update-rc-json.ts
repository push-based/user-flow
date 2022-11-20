import { updateRcConfig } from '../../../global/rc-json';
import { logVerbose } from '../../../core/loggin';
import { RcJson } from '../../../types';

export async function updateRcJson(config: RcJson): Promise<RcJson> {
  logVerbose(config);
  updateRcConfig(config);
  return config;
}
