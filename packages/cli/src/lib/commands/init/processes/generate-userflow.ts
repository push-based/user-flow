import { RcJson } from '../../../types';
import { join } from 'path';
import { readFile, writeFile } from '../../../core/file';
import { log } from '../../../core/loggin';
import { mkdirSync, readdirSync } from 'fs';
import { FlowExampleMap } from '../constants';
import { FlowExamples } from '../types';

const exampleName = 'basic-navigation';

export function getExamplePathDest(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(exampleName, cfg.collect.ufPath)) === '' : false);

export async function generateUserFlow(cliCfg: RcJson): Promise<RcJson> {

  const ufPath = cliCfg.collect.ufPath;
  // DX create directory if it does ot exist
  try {
    readdirSync(ufPath);
  } catch (e) {
    mkdirSync(ufPath, { recursive: true });
  }
  const tplFileName = FlowExampleMap[exampleName];
  const exampleSourceLocation = join(__dirname,'..', 'static', tplFileName);
  const exampleDestination = join(ufPath, tplFileName);

  if (readFile(exampleDestination) !== '') {
    throw new Error(`No flow example given for name ${exampleName}.`);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  writeFile(exampleDestination, fileContent);

  log(`setup user-flow for basic navigation in ${ufPath} successfully`);
  return Promise.resolve(cliCfg);
}

