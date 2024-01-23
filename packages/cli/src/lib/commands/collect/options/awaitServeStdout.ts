import { Options } from 'yargs';

export const awaitServeStdout = {
  alias: 'w',
  type: 'string',
  description: 'A string in stdou resulting from serving the app, to be awaited before start running the tests. e.g. "server running..."',
  implies: ['w', 'serveCommand']
} as const satisfies Options;

