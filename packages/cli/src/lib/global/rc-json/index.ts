import { readFile, writeFile } from '../../core/file';
import { logVerbose } from '../../core/loggin';
import { RcArgvOptions} from './types';
import { get as getRcParam, get as getRcPath } from './options/rc';
import { CollectCommandArgv, CollectRcOptions, PersistRcOptions } from '../../commands/collect/options/types';
import { AssertRcOptions } from '../../commands/assert/options/types';
import { RcJson } from '../../types';

export function readRcConfig(rcPath: string = ''): RcJson {
  const configPath = rcPath || getRcPath();
  const repoConfigJson = readFile<RcJson>(configPath, { ext: 'json' }) || {};
  return repoConfigJson;
}

export function updateRcConfig(config: RcJson, rcPath: string = ''): void {
  const configPath = rcPath || getRcPath();
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

export function getCliOptionsFromRcConfig(rcPath?: string): RcArgvOptions {
  const { collect, persist, assert } = readRcConfig(rcPath || getRcParam());
  return { ...collect, ...persist, ...assert } as RcArgvOptions;
}


