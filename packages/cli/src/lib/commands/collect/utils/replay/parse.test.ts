import * as PupeteerReplay from '../../../../../../test-data/raw-reports/pupeteer-replay.json';
import * as UserFlowReplay from '../../../../../../test-data/raw-reports/userflow-replay.json';
import { parse } from './parse';

const pupeteerReplay = PupeteerReplay as any;
const userFlowReplay = UserFlowReplay as any;

describe('replay', () => {

  it('should parse original replay script without changes', () => {
    expect(pupeteerReplay['steps']).toBeDefined();

    expect(parse(pupeteerReplay)).toEqual(pupeteerReplay);
  });

  it('should parse user-flow enriched replay script without changes', () => {
    expect(userFlowReplay['steps']).toBeDefined();

    expect(parse(userFlowReplay)).toEqual(userFlowReplay);
  });

});
