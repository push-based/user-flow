import { param as verbose } from './verbose';
import { param as rc} from './rc';
import { param as interactive} from './interactive';
import { CoreOptions } from './types';

export const CORE_OPTIONS: CoreOptions = {
  ...verbose,
  ...rc,
  ...interactive
};

