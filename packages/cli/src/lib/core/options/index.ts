import { param as verbose } from './verbose';
import { param as rc} from './rc';
import { param as interactive} from './interactive';

export const CORE_OPTIONS = {
  ...verbose,
  ...rc,
  ...interactive
};

