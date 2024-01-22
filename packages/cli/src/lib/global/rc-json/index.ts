import { readFile, writeFile } from '../../core/file/index.js';
import { logVerbose } from '../../core/loggin/index.js';
import { RcJson } from '../../types.js';
import { globalOptions } from '../options/index.js';

export function readRcConfig(rcPath: string = '', options?: {
  fail?: boolean,
  fallback?: {}
}): RcJson {
  let { fail, fallback } = options || {};
  fallback = fallback || {};
  rcPath = rcPath || globalOptions.getRcPath();
  let repoConfigJson = readFile<RcJson>(rcPath, { ext: 'json', fail: !!fail });
  if (!repoConfigJson) {
    repoConfigJson = fallback as RcJson;
  }
  return repoConfigJson;
}

export function updateRcConfig(config: RcJson, rcPath: string): void {
  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed
  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(rcPath, JSON.stringify(config));
    logVerbose(`Update config under ${rcPath} to`, config);
  }
}

export function getCliOptionsFromRcConfig<T>(rcPath?: string): T {
  const { collect, persist, assert } = readRcConfig(rcPath || globalOptions.getRcPath());
  return { ...collect, ...persist, ...assert } as unknown as T;
}


