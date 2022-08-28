import { RcJson } from '../../../types';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}
