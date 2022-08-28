import { get as verbose } from '../../options/verbose';

/**
 * logs messages only if the CLI parameter -v or --verbose is passed as true
 *
 * @example
 * user-flow collect -v // log is present
 * user-flow collect -v=false // log is NOT present
 *
 * @param message
 */
export function logVerbose(...message: Array<string | number | Symbol | Object | Array<any>>): void {
  if (verbose()) {
    return console.log(...message);
  }
}

export function log(...message: Array<string | number | Symbol | Object | Array<any>>): void {
  return console.log(...message);
}
