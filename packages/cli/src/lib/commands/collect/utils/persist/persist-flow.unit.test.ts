import * as utils from './utils';
import * as reportUtils from '../report/utils';
import * as mdReportUtils from '../../../assert/utils/md-report';
import { persistFlow } from './persist-flow';
import { writeFile } from '../../../../core/file';
import { log } from '../../../../core/loggin';
import { ReducedReport } from '../report/types';

import { UserFlow } from '../../../../hacky-things/lighthouse';

jest.mock('node:fs', () => ({
  existsSync: jest.fn().mockReturnValue(true)
}));
jest.mock('../../../../hacky-things/lighthouse')
jest.mock('../../../../core/file');
jest.mock('../../../../core/loggin');
jest.mock('./utils');
jest.mock('../../../assert/utils/md-report');
jest.mock('../report/utils', () => ({
  createReducedReport: jest.fn(),
  toReportName: jest.fn().mockReturnValue('report'),
}));

const flow = {
  name: 'flow-name',
  createFlowResult: jest.fn(),
  generateReport: jest.fn()
} satisfies UserFlow;

describe('persist flow reports in specified format', () => {

  beforeEach(() => {
    jest.clearAllMocks();
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
    const generateStdoutReportSpy = jest.spyOn(utils, 'generateStdoutReport').mockReturnValue('Mock stdout report')
    await persistFlow(flow, { outPath: '', format: ['stdout'], url: 'mock.com' });
    expect(generateStdoutReportSpy).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Mock stdout report');
  });

  it('should extract a json report from UserFlow if json is given as format', async () => {
    const createFlowResultSpy = jest.spyOn(flow, 'createFlowResult');
    await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(createFlowResultSpy).toHaveBeenCalled();
  });

  it('should save the report in json if json is given as format', async () => {
    jest.spyOn(flow, 'createFlowResult').mockResolvedValue({mock: 'jsonResult'});
    await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith('report.json', JSON.stringify({mock: 'jsonResult'}));
  });

  it('should return the path to the json report if json is given as format', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.json']);
  });

  it('should extract an html report from UserFlow if html is given as format', async () => {
    const generateReportSpy = jest.spyOn(flow, 'generateReport');
    await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(generateReportSpy).toHaveBeenCalled();
  });

  it('should save the report in html if html is given as format', async () => {
    jest.spyOn(flow, 'generateReport').mockResolvedValue('Mock HTML Report');
    await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith('report.html', 'Mock HTML Report');
  });

  it('should return the path to the html report if html is given as format', async () => {
    const reports = await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(reports).toStrictEqual(['report.html']);
  });

  it('should extract an md report from the json report if md is given as format', async () => {
    jest.spyOn(flow, 'createFlowResult').mockResolvedValue({mock: 'base for md report'});
    const createReducedReportSpy = jest.spyOn(reportUtils, 'createReducedReport').mockReturnValue({mock: 'reduced report'} as any as ReducedReport);
    const generateMdReportSpy = jest.spyOn(mdReportUtils, 'generateMdReport');
    await persistFlow(flow, { outPath: '', format: ['md'], url: 'mock.com' });
    expect(createReducedReportSpy).toHaveBeenCalledWith({mock: 'base for md report'})
    expect(generateMdReportSpy).toHaveBeenCalledWith({mock: 'reduced report'});
  });

  it('should save the report in md if md is given as format', async () => {
    jest.spyOn(mdReportUtils, 'generateMdReport').mockReturnValue('Mock Md Report')
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
