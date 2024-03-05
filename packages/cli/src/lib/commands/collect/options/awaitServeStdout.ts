import { Options } from 'yargs';

export const awaitServeStdout = {
  alias: 'w',
  type: 'string',
  description: 'A string in stdout resulting from serving the app, to be awaited before start running the tests. e.g. "server running..."',
  implies: ['w', 'serveCommand']
} satisfies Options;
