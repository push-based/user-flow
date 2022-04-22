import { get as verbose } from '../../options/verbose';

export function logVerbose(...message: Array<string | number | Symbol | Object | Array<any>>): void {
  if (verbose()) {
    return console.log(...message);
  }
}

export function log(...message: Array<string | number | Symbol | Object | Array<any>>): void {
  return console.log(...message);
}
