import { updateRcConfig } from '../../../global/rc-json/index.js';
import { logVerbose } from '../../../core/loggin/index.js';
import { RcJson } from '../../../types.js';

export async function updateRcJson(config: RcJson): Promise<RcJson> {
  logVerbose(config);
  updateRcConfig(config);
  return config;
}
