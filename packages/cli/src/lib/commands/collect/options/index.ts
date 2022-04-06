import { param as open } from './open';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as url } from './url';
import { param as serveCommand } from './serveCommand';
import { param as awaitServeStdout } from './awaitServeStdout';


export const COLLECT_OPTIONS = {
  ...url,
  ...ufPath,
  ...outPath,
  ...open,
  ...serveCommand,
  ...awaitServeStdout
};
