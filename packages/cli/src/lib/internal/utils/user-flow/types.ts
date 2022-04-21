import { Page } from 'puppeteer';

import * as Config from 'lighthouse/types/config';



export interface StepOptions {
  stepName: string;
}

export type UserFlowOptions = {
  name: string;
} & { page: Page, config?: Config.default.Json, /*configContext?: LH.Config.FRContext*/ }
