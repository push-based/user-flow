import { RcJson } from '../../types.js';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}
