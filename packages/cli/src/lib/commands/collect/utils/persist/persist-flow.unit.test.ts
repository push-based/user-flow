import { describe, expect, it, beforeEach, vi } from 'vitest';
import { generateStdoutReport } from './utils.js';
import { createReducedReport } from '../report/utils.js';
import { generateMdReport } from '../../../assert/utils/md-report.js';
import { persistFlow } from './persist-flow.js';
import { writeFile } from '../../../../core/file/index.js';
import { log } from '../../../../core/loggin/index.js';

import type { ReducedReport } from '../report/types.js';
import type { UserFlow } from 'lighthouse';

vi.mock('node:fs', () => ({
  existsSync: vi.fn().mockReturnValue(true)
}));
vi.mock('../../../../hacky-things/lighthouse')
vi.mock('../../../../core/file');
vi.mock('../../../../core/loggin');
vi.mock('./utils');
vi.mock('../../../assert/utils/md-report', () => ({
  generateMdReport: vi.fn().mockReturnValue('Mock Md Report')
}));
vi.mock('../report/utils', () => ({
  createReducedReport: vi.fn(),
  toReportName: vi.fn().mockReturnValue('report'),
}));

const flow = {
  _options: { name: 'flow-name' },
  createFlowResult: vi.fn(),
  generateReport: vi.fn()
} as any as UserFlow;

describe('persist flow reports in specified format', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not save any reports if no format is given', async () => {
    await persistFlow(flow, { outPath: '', format: [], url: 'mock.com' });
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should not save any report if format is only stdout', async () => {
    await persistFlow(flow, { outPath: '', format: ['stdout'], url: 'mock.com' });
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should return an empty list if format is only stdout', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['stdout'], url: 'mock.com' });
    expect(reports).toStrictEqual([]);
  });

  it('should log a report if stdout is passed as format', async () => {
    const generateStdoutReportSpy = vi.mocked(generateStdoutReport).mockReturnValue('Mock stdout report')
    await persistFlow(flow, { outPath: '', format: ['stdout'], url: 'mock.com' });
    expect(generateStdoutReportSpy).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Mock stdout report');
  });

  it('should extract a json report from UserFlow if json is given as format', async () => {
    const createFlowResultSpy = vi.spyOn(flow, 'createFlowResult');
    await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(createFlowResultSpy).toHaveBeenCalled();
  });

  it('should save the report in json if json is given as format', async () => {
    vi.spyOn(flow, 'createFlowResult').mockResolvedValue({mock: 'jsonResult'} as any);
    await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith('report.json', JSON.stringify({mock: 'jsonResult'}));
  });

  it('should return the path to the json report if json is given as format', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.json']);
  });

  it('should extract an html report from UserFlow if html is given as format', async () => {
    const generateReportSpy = vi.spyOn(flow, 'generateReport');
    await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(generateReportSpy).toHaveBeenCalled();
  });

  it('should save the report in html if html is given as format', async () => {
    vi.spyOn(flow, 'generateReport').mockResolvedValue('Mock HTML Report');
    await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith('report.html', 'Mock HTML Report');
  });

  it('should return the path to the html report if html is given as format', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.html']);
  });

  it('should extract an md report from the json report if md is given as format', async () => {
    vi.spyOn(flow, 'createFlowResult').mockResolvedValue({mock: 'base for md report'} as any);
    const createReducedReportSpy = vi.mocked(createReducedReport).mockReturnValue({mock: 'reduced report'} as any as ReducedReport);
    const generateMdReportMock = vi.mocked(generateMdReport);
    await persistFlow(flow, { outPath: '', format: ['md'], url: 'mock.com' });
    expect(createReducedReportSpy).toHaveBeenCalledWith({mock: 'base for md report'})
    expect(generateMdReportMock).toHaveBeenCalledWith({mock: 'reduced report'});
  });

  it('should save the report in md if md is given as format', async () => {
    await persistFlow(flow, { outPath: '', format: ['md'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith('report.md', 'Mock Md Report');
  });

  it('should return the path to the markdown report if md is given as format', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['md'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.md']);
  });

  it('should save the report in multiple formats if multiple formats are given', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['html', 'json', 'md', 'stdout'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.json', 'report.md', 'report.html']);
  });
});
