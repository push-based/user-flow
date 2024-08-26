import { describe, expect, it } from 'vitest';
import { parse } from './parse.js';
import { puppeteerReplay, userFlowReplay } from './replay.mocks.js';

describe('replay', () => {

  it('should parse original replay script without changes', () => {
    expect(puppeteerReplay['steps']).toBeDefined();

    expect(parse(puppeteerReplay)).toEqual(puppeteerReplay);
  });

  it('should parse user-flow enriched replay script without changes', () => {
    expect(userFlowReplay['steps']).toBeDefined();

    expect(parse(userFlowReplay)).toEqual(userFlowReplay);
  });
});
