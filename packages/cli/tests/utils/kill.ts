import * as killPort from 'kill-port';

export function kill(args: {port: string | string[], method?: string, verbose?: boolean}): Promise<void[]> {
  let { verbose, port, method } = args
  port = port ? port.toString().split(',') : [];
  verbose = !!verbose;
  method = method || 'tcp';

  if (!Array.isArray(port)) {
    port = [port]
  }

  return Promise.all(port.map(current => {
    return killPort(current, method)
      .then((result) => {
        verbose && console.log(`Process on port ${current} killed`, result)
      })
      .catch((error) => {
        verbose && console.log(`Could not kill process on port ${port}`, error)
      })
  }))

}
