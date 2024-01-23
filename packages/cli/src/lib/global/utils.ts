

// @TODO this needs to be fixed!
export function getGlobalOptionsFromArgv(argv: any): Partial<{ rcPath: string, interactive: boolean, verbose: boolean }> {
  const { rcPath, interactive, verbose } = argv;

  let globalOptions = {} as { rcPath: string, interactive: boolean, verbose: boolean };
  rcPath && (globalOptions.rcPath = rcPath);
  interactive && (globalOptions.interactive = interactive);
  verbose && (globalOptions.verbose = verbose);

  return globalOptions;
}
