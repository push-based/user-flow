import { Options } from 'yargs';

export const config = {
  alias: 'l',
  type: 'string', // TODO This should be type object
  description: 'Lighthouse configuration (RC file only)'
} satisfies Options;
