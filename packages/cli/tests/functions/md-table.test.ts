import * as fs from 'fs';
import {join} from 'path';
import * as LHR9 from '../data/lhr-9.json';
import * as LHR9REDUCED from '../data/lhr-9_reduced.json';
import * as LHR8 from '../data/lhr-8.json';
import { createReducedReport } from '../../src/lib/commands/collect/processes/generate-reports';
import { userFlowReportToMdTable } from '../../src/lib/commands/assert/processes/md-table';

const lhr8 = LHR8 as any;
const lhr9 = LHR9 as any;
const lhr9reduced = LHR9REDUCED as any;

describe('md-table', () => {

  it('should throw if version is lower than 9', () => {
    expect(LHR8['steps']).toBe(undefined);
    expect(parseFloat(lhr8.lhr.lighthouseVersion)).toBeLessThan(9);
  });

  it('should NOT throw if version is greater or equal than 9', () => {
    expect(parseFloat(lhr9.steps[0].lhr.lighthouseVersion)).toBeGreaterThan(9);
  });

  it('should generate reduced JSON format for v9 raw JSON result if createReducedReport is called', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    expect(reducedLhr9).toEqual(lhr9reduced);
  });

  it('should print MD table if userFlowReportToMdTable is called with a reduced result', () => {
    const reducedLhr9 = createReducedReport(lhr9);
    const mdTable = userFlowReportToMdTable(reducedLhr9);
    const LHRREDUCEDMD = fs.readFileSync(join(__dirname, '../data/lhr-9_reduced.md'), 'utf-8');
    expect(mdTable).toEqual(LHRREDUCEDMD);
  });

});
