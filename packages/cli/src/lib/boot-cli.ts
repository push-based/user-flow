import { getCliOptionsFromRcConfig } from './global/rc-json/index.js';
import { getGlobalOptionsFromArgv } from './global/utils.js';

/**
 * Merges CLI params into rc config
 * @param rcPath
 */
export function configParser(rcPath?: string): {} {
  let rcConfig: any = getCliOptionsFromRcConfig(rcPath);
  let globalConfig: any = getGlobalOptionsFromArgv(rcConfig);
  return { ...globalConfig, ...rcConfig };
}
