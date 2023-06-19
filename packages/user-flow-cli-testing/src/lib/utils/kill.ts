// @ts-ignore
import * as killPort from 'kill-port';

export function kill(args: {
  port: string | string[];
  method?: string;
  verbose?: boolean;
}): Promise<void[]> {
  let {verbose, port, method} = args;
  port = port ? port.toString().split(',') : [];
  const logVerbose = getLogVerbose(Boolean(verbose));
  method = method || 'tcp';

  if (!Array.isArray(port)) {
    port = [port];
  }

  return Promise.all(
    port.map((current) => {
      return killPort(current, method)
        .then((result: any) => {
          logVerbose(`Process on port ${current} killed`, result);
        })
        .catch((error: any) => {
          logVerbose(`Could not kill process on port ${port}`, error);
        });
    })
  );
}

/**
 * logs messages only if the CLI parameter -v or --verbose is passed as true
 *
 * @example
 * user-flow collect -v // log is present
 * user-flow collect -v=false // log is NOT present
 *
 * @param message
 */
function getLogVerbose(verbose: boolean) {
  return (
    ...message: Array<string | number | Symbol | Object | Array<any>>
  ): void => {
    if (verbose) {
      return console.log(...message);
    }
  };
}
