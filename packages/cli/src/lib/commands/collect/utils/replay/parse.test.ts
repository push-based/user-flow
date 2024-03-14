import { describe, expect, it } from 'vitest';
import { parse } from './parse';
import { getReportContent } from 'test-data';

const pupeteerReplay = getReportContent('pupeteer-replay.json');
const userFlowReplay = getReportContent('userflow-replay.json');

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
