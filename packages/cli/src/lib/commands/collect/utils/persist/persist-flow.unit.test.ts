import { join } from 'node:path';
import * as fs from 'node:fs';
import * as utils from './utils';
import * as reportUtils from '../report/utils';
import * as mdReportUtils from '../../../assert/utils/md-report';
import { persistFlow } from './persist-flow';
import { writeFile } from '../../../../core/file';
import { log } from '../../../../core/loggin';
import { ReducedReport } from '../report/types';

import { UserFlow } from '../../../../hacky-things/lighthouse';

jest.mock('node:fs');
jest.mock('../../../../hacky-things/lighthouse')
jest.mock('../../../../core/file');
jest.mock('../../../../core/loggin');
jest.mock('./utils');
jest.mock('../../../assert/utils/md-report');
jest.mock('../report/utils');

const flow = {
  name: 'flow-name',
  createFlowResult: jest.fn(),
  generateReport: jest.fn()
} satisfies UserFlow;

describe('persist flow reports in specified format', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })

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
    expect(reports).toEqual([]);
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
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(flow, 'createFlowResult').mockResolvedValue({mock: 'jsonResult'});
    jest.spyOn(reportUtils, 'toReportName').mockReturnValue('MockName')
    await persistFlow(flow, { outPath: 'Flow', format: ['json'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith(join('Flow', 'MockName.json'), JSON.stringify({mock: 'jsonResult'}));
  });

  it('should return the path to the json report if json is given as format', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const reports = await persistFlow(flow, { outPath: '', format: ['json'], url: 'mock.com' });
    expect(reports.at(0)).toContain('json');
  });

  it('should extract an html report from UserFlow if html is given as format', async () => {
    const generateReportSpy = jest.spyOn(flow, 'generateReport');
    await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(generateReportSpy).toHaveBeenCalled();
  });

  it('should save the report in html if html is given as format', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(flow, 'generateReport').mockResolvedValue('Mock HTML Report');
    jest.spyOn(reportUtils, 'toReportName').mockReturnValue('MockName')
    await persistFlow(flow, { outPath: 'Flow', format: ['html'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith(join('Flow', 'MockName.html'), 'Mock HTML Report');
  });

  it('should return the path to the html report if html is given as format', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const reports = await persistFlow(flow, { outPath: '', format: ['html'], url: 'mock.com' });
    expect(reports.at(0)).toContain('.html');
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
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(mdReportUtils, 'generateMdReport').mockReturnValue('Mock Md Report')
    jest.spyOn(reportUtils, 'toReportName').mockReturnValue('MockName')
    await persistFlow(flow, { outPath: 'Flow', format: ['md'], url: 'mock.com' });
    expect(writeFile).toHaveBeenCalledWith(join('Flow', 'MockName.md'), 'Mock Md Report');
  });

  it('should return the path to the html report if html is given as format', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const reports = await persistFlow(flow, { outPath: '', format: ['md'], url: 'mock.com' });
    expect(reports.at(0)).toContain('.md');
  });

  it('should save the report in multiple formats if multiple formats are given', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const reports = await persistFlow(flow, { outPath: '', format: ['html', 'json', 'md', 'stdout'], url: 'mock.com' });
    expect(reports.length).toEqual(3);
    expect(writeFile).toHaveBeenCalledTimes(3);
  });
});
