// @TODO merge into user-flow.mock in src folder
import FlowResult from 'lighthouse/types/lhr/flow';
import { getContent, LHR9_HTML_NAME, LHR9_JSON_NAME } from '../test-data/reports';

export class UserFlowReportMock {
  constructor() {
  }

  createFlowResult(): Promise<FlowResult> {
    return Promise.resolve(getContent(LHR9_JSON_NAME) as FlowResult);
  }

  generateReport(): Promise<string> {
    return Promise.resolve(getContent(LHR9_HTML_NAME) as string);
  }
}
