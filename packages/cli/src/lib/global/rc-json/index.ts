import { readFile, writeFile } from '../../core/file';
import { logVerbose } from '../../core/loggin';
import { RcJson } from '../../types';
import { globalOptions } from '../options';

export function readRcConfig(rcPath: string = ''): RcJson {
  const configPath = rcPath || globalOptions.getRcPath();
  const repoConfigJson = readFile<RcJson>(configPath, { ext: 'json' }) || {};
  return repoConfigJson;
}

export function updateRcConfig(config: RcJson, rcPath: string = ''): void {
  const configPath = rcPath || globalOptions.getRcPath();
  logVerbose(`Update config under ${configPath}`);
  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed

  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

export function getCliOptionsFromRcConfig<T>(rcPath?: string): T {
  const { collect, persist, assert } = readRcConfig(rcPath || globalOptions.getRcPath());
  return { ...collect, ...persist, ...assert } as unknown as T;
}


