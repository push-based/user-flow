import { GlobalOptionsArgv } from './global/options/types';
import { RcArgvOptions } from './global/rc-json/types';
import { getCliOptionsFromRcConfig } from './global/rc-json';
import { getEnvPreset } from './global/rc-json/pre-set';

export function getCliConfig(rcPath?: string): Partial<GlobalOptionsArgv & RcArgvOptions> {
  let rcConfig: any = getCliOptionsFromRcConfig(rcPath);
  const preset = getEnvPreset();
  return { ...preset, ...rcConfig };
}
