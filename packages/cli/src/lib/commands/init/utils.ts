import { join } from 'path';
import { readFile, writeFile } from '../../core/file';
import { FlowExamples } from './types';
import { log, logVerbose } from '../../core/loggin';
import { GlobalOptionsArgv } from '../../global/options/types';
import { InitArgvOptions } from './options/types';
import { CollectRcOptions, PersistRcOptions } from '../collect/options/types';
import { getCollectCommandOptionsFromArgv } from '../collect/utils/params';

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

  if (readFile(exampleDestination) !== '') {
    throw new Error(`No flow example given for name ${flowExample}.`);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  logVerbose('fileContent', fileContent);
  writeFile(exampleDestination, fileContent);

  log(`setup user-flow for basic navigation in ${folder} successfully`);
}

export function getInitCommandOptionsFromArgv(argv: any): Partial<InitArgvOptions> {
  const {
    url, ufPath, serveCommand, awaitServeStdout,
    outPath, format,
    budgetPath, budgets
  } = getCollectCommandOptionsFromArgv(argv);

  let initOptions = {} as Partial<InitArgvOptions>;
  url && (initOptions.url = url);
  ufPath && (initOptions.ufPath = ufPath);
  budgets && (initOptions.budgets = budgets);
  budgetPath && (initOptions.budgetPath = budgetPath);
  outPath && (initOptions.outPath = outPath);
  format && (initOptions.format = format);
  awaitServeStdout && (initOptions.awaitServeStdout = awaitServeStdout);

  return initOptions;
}
