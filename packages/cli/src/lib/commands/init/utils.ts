import { join } from 'path';
import { readFile, writeFile } from '../../core/file';
import { FlowExamples } from './types';
import { log } from '../../core/loggin';
import { InitArgvOptions } from './options/types';
import { CollectRcOptions, PersistRcOptions } from '../collect/options/types';
import { AssertRcOptions } from '../assert/options/types';

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
  writeFile(exampleDestination, fileContent);

  log(`setup user-flow for basic navigation in ${folder} successfully`);
}

export function getInitCommandOptionsFromArgv(argv: any) {
  const {
    url, ufPath, serveCommand, awaitServeStdout,
    outPath, format, budgetPath, budgets
  } = argv as unknown as InitArgvOptions;

  let collect = {} as CollectRcOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);

  let persist = {} as PersistRcOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);

  let assert = {} as AssertRcOptions;
  budgetPath && (assert.budgetPath = budgetPath);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert };
}

