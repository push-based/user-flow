import { param as verbose } from './verbose';
import { param as rc} from '../rc-json/options/rc';
import { param as interactive} from './interactive';
import { CoreOptions } from './types';

export const GLOBAL_OPTIONS: CoreOptions = {
  ...verbose,
  ...rc,
  ...interactive
};

