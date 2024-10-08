import { join } from 'node:path';
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { UserFlowProvider } from './types.js';
import { resolveAnyFile } from '../../../../core/file/index.js';
import { CollectRcOptions } from '../../options/types.js';

export async function loadFlow(collect: Pick<CollectRcOptions, 'ufPath'>): Promise<({
  exports: UserFlowProvider,
  path: string
})[]> {
  const { ufPath } = collect;
  const path = join(ufPath);
  if (!existsSync(path)) {
    throw new Error(`ufPath: ${path} is neither a file nor a directory`);
  }

  let files: string[];
  if (lstatSync(path).isDirectory()) {
    files = readdirSync(path).map(file => join(path, file));
  } else {
    files = [path];
  }

  const flows = await Promise.all(files.filter(f => f.endsWith('js') || f.endsWith('ts'))
    .map((file) => resolveAnyFile<UserFlowProvider & { path: string }>(file)));

  if (flows.length === 0) {
    // @TODO use const for error msg
    throw new Error(`No user flows found in ${ufPath}`);
  }
  return flows;
}
