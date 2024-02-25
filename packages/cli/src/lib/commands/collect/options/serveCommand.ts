import { Options } from 'yargs';

export const serveCommand = {
  alias: 's',
  type: 'string',
  description: 'The npm command to serve your application. e.g. "npm run serve:prod"',
} satisfies Options;
