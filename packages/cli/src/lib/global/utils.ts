import { GlobalOptionsArgv } from './options/types.js';

export function getGlobalOptionsFromArgv(argv: object): Partial<GlobalOptionsArgv> {
  const { rcPath, interactive, verbose } = argv as Partial<GlobalOptionsArgv>;

  const globalOptions = {} as GlobalOptionsArgv;
  if (rcPath) globalOptions.rcPath = rcPath;
  if (interactive) globalOptions.interactive = interactive;
  if (verbose) globalOptions.verbose = verbose;

  return globalOptions;
}
