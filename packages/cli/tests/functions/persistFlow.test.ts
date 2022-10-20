import { UserFlowOptions } from '@push-based/user-flow';
import { UserFlowReportMock } from '../../src/lib/commands/collect/utils/user-flow/user-flow.mock';
import { Page } from 'puppeteer';
import { persistFlow } from '../../src/lib/commands/collect/utils/user-flow/index';


const flow = new UserFlowReportMock({name: 'test'} as unknown as UserFlowOptions)

describe('persistFlow', () => {
  it('should throw if version is lower than 9', async () => {
    const fileNames = await persistFlow(flow, 'any', { outPath: '', format: ['json']})
    expect(fileNames).toBe(['any.json']);
  });
});
