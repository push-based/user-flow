import { join } from 'path';
import { readFile, writeFile } from '../../core/utils/file';
import { FlowExamples } from './types';
import { logVerbose } from '../../core/utils/loggin';

const FlowExampleMap: Record<FlowExamples, string> = {
  'basic-navigation': 'order-coffee.uf.ts'
};

export function addUserFlow(flowExample: FlowExamples, folder: string) {

  if (!Object.keys(FlowExampleMap).includes(flowExample)) {
    throw new Error(`No flow example given for name ${flowExample}.`);
  }

  const fileName = FlowExampleMap[flowExample];
  const exampleSourceLocation = join(__dirname, 'static', fileName);
  const exampleDestination = join(folder, fileName);

  const fileContent = readFile(exampleSourceLocation, true).toString();
  logVerbose('fileContent', fileContent);
  writeFile(exampleDestination, fileContent);

  logVerbose(`setup user-flow for basic navigation in ${folder} successfully`);
}
