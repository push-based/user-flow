import * as fs from 'fs';
import { ProcessParams } from './types';
import { CLI_MODES } from '../../../../src/lib/global/cli-mode/types';
import { CI_PROPERTY } from '../../../../src/lib/global/cli-mode/cli-mode';
import * as path from 'path';

export function getFolderContent(folders: string[]): string[] {
  return folders.flatMap((d) => {

    // @TODO
    if (fs.existsSync(d)) {
      const files = fs.readdirSync(d);
      return files.map((f) => path.join(d, f));
    }
    return [d];
  });
}

export function deleteFileOrFolder(files: string | string[]): void {
  (typeof files === 'string' ? [files] : files).forEach((p) => {
    if (fs.existsSync(p)) {
      const stats = fs.lstatSync(p);
      if(stats.isDirectory()) {
        fs.rmdirSync(p, { recursive: true });
      } else {
        fs.rmSync(p);
      }
      // console.info(`Deleted file ${file}`);
    } else {
      // console.error(`File ${file} does not exist`);
    }
  });
}

export function processParamsToParamsArray(params: ProcessParams): string[] {
  return Object.entries(params).flatMap(([key, value]) => {
    if (key === '_') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return value.map(v => `--${key}=${v.toString()}`);
    } else {
      if (typeof value === 'string') {
        return [`--${key}=${value + ''}`];
      } else if (typeof value === 'boolean') {
        return [`--${value ? '' : 'no-'}${key}`];
      }
      return [`--${key}=${value + ''}`];
    }
  }) as string[];
}

export function getEnvVarsByCliModeAndDeleteOld(cliMode: CLI_MODES): Record<string, string | undefined> {

  if (cliMode === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
    return {};
  }

  // CI mode value
  let ciValue = 'true';
  if (cliMode === 'SANDBOX') {
    // emulate sandbox env by setting CI to SANDBOX
    ciValue = 'SANDBOX';
  }
  return { [CI_PROPERTY]: ciValue };
}
