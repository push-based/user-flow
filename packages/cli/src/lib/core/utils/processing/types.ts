import { RcJson } from '@push-based/user-flow';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}
