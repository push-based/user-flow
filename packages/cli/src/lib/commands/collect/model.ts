import { UserFlowRcConfig } from '@push-based/user-flow/cli';

export type CollectOptions = UserFlowRcConfig['collect'] & UserFlowRcConfig['persist'] & { openReport: boolean };
