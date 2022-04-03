import { param as open } from './open';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as url } from './url';
import { param as staticDistDir } from './staticDistDir';
import { param as isSinglePageApplication } from './isSinglePageApplication';


export const COLLECT_OPTIONS = {
  ...url,
  ...ufPath,
  ...outPath,
  ...open,
  ...staticDistDir,
  ...isSinglePageApplication
};
