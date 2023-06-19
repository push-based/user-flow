import { GlobalOptionsArgv } from './options/types';

export function getGlobalOptionsFromArgv(
  argv: any
): Partial<GlobalOptionsArgv> {
  const { rcPath, interactive, verbose } = argv;

  let globalOptions = {} as GlobalOptionsArgv;
  rcPath && (globalOptions.rcPath = rcPath);
  interactive && (globalOptions.interactive = interactive);
  verbose && (globalOptions.verbose = verbose);

  return globalOptions;
}
