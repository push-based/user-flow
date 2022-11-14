import { CollectOptions } from '../../../../global/rc-json/types';
import { UserFlowProvider } from './types';
import { join } from 'path';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { resolveAnyFile } from '../../../../core/file';

export function loadFlow(collect: CollectOptions): ({ exports: UserFlowProvider, path: string })[] {
  const { ufPath } = collect;
  const path = join(process.cwd(), ufPath);
  console.log('Logging in loadFlow -> ufPath | path', ufPath);
  if (!existsSync(path)) {
    throw new Error(`ufPath: ${path} is no directory`);
  }

  let files: string[];
  if (lstatSync(path).isDirectory()) {
    files = readdirSync(path).map(file => join(path, file));
  } else {
    files = [path];
  }

  console.log('Logging in loadFlow -> existsSync(path) | lstatSync(path).isDirectory()', existsSync(path), lstatSync(path).isDirectory());

  const flows = files.filter(f => f.endsWith('js') || f.endsWith('ts'))
    .map((file) => resolveAnyFile<UserFlowProvider & { path: string }>(file));

  if (flows.length === 0) {
    // @TODO use const for error msg
    throw new Error(`No user flows found in ${ufPath}`);
  }
  console.log('Logging the output of loadFlow -> flows', flows);
  return flows;
}
