import { UserFlowProvider } from './types.js';
import { join } from 'path';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { resolveAnyFile } from '../../../../core/file/index.js';
import { CollectRcOptions } from '../../options/types.js';

export function loadFlow(collect: Pick<CollectRcOptions, 'ufPath'>): ({ exports: UserFlowProvider, path: string })[] {
  const { ufPath } = collect;
  const path = join(process.cwd(), ufPath);
  if (!existsSync(path)) {
    throw new Error(`ufPath: ${path} is no directory`);
  }

  let files: string[];
  if (lstatSync(path).isDirectory()) {
    files = readdirSync(path).map(file => join(path, file));
  } else {
    files = [path];
  }

  console.log(files);
  const flows = files.filter(f => f.endsWith('js') || f.endsWith('ts'))
    .map((file) => resolveAnyFile<UserFlowProvider & { path: string }>(file));

  if (flows.length === 0) {
    // @TODO use const for error msg
    throw new Error(`No user flows found in ${ufPath}`);
  }
  return flows;
}
