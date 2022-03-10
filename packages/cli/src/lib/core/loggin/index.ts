import { get as verbose } from '../options/verbose';

export function logVerbose(message: string | number | Symbol | Object | Array<any>, enforceLog = false): void {
  if (verbose() || enforceLog) {
    return console.log(message);
  }
}

export function log(message: string | number | Symbol | Object | Array<any>): void {
  return console.log(message);
}
