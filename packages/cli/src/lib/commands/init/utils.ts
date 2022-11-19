import { join } from 'path';
import { readFile, writeFile } from '../../core/file';
import { FlowExamples } from './types';
import { log } from '../../core/loggin';

const FlowExampleMap: Record<FlowExamples, string> = {
  'basic-navigation': 'order-coffee.uf.ts'
};

export function getExamplePathSrc(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(__dirname, 'static', fileName);
}
export function getExamplePathDest(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(folder, fileName);
}

export function addUserFlow(flowExample: FlowExamples, folder: string) {

  if (!Object.keys(FlowExampleMap).includes(flowExample)) {

  }

  const fileName = FlowExampleMap[flowExample];
  const exampleSourceLocation = join(__dirname, 'static', fileName);
  const exampleDestination = join(folder, fileName);

  if(readFile(exampleDestination) !== '') {
    throw new Error(`No flow example given for name ${flowExample}.`);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  writeFile(exampleDestination, fileContent);

  log(`setup user-flow for basic navigation in ${folder} successfully`);
}
