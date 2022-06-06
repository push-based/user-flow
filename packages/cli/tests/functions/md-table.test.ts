import * as LHR9 from '../data/lhr-9.json';
import * as LHR8 from '../data/lhr-8.json';
import { userFlowReportToMdTable } from '../../src/lib/commands/assert/processes/md-table';

const lhr8 = LHR8 as any;
const lhr9 = LHR9 as any;

describe('md-table', () => {

  it('should throw if version is lower than 9', () => {
    expect(LHR8['steps']).toBe(undefined);
    expect(parseFloat(lhr8.lhr.lighthouseVersion)).toBeLessThan(9);
  });

  it('should NOT throw if version is greater than 9', () => {
    expect(parseFloat(lhr9.steps[0].lhr.lighthouseVersion)).toBeGreaterThan(9);
  });

  it('should print MD table', () => {
    expect(userFlowReportToMdTable(lhr9)[0]).toBe('ads');
  });

});
