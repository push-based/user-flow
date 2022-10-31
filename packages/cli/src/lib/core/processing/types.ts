import { RcJson } from '../rc-json/types';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}
