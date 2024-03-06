import * as openReport from 'open';
import { handleOpenFlowReports, openFlowReports } from './open-report';
import { logVerbose } from '../../../../core/loggin';
import { CollectCommandOptions } from '../../options';

describe('handleOpenFlowReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return the openFlowReport function if openReport, interactive and not dryRun', async () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: true,
      dryRun: false,
    } as CollectCommandOptions);
    expect(typeof openReportsProcess).toEqual("function");
  });

  it('should return undefined if openReport is false', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: false,
      interactive: true,
      dryRun: false,
    } as CollectCommandOptions);
    expect(openReportsProcess).toEqual(undefined);
  });

  it('should return undefined if dryRun is true', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: true,
      dryRun: true,
    } as CollectCommandOptions);
    expect(openReportsProcess).toEqual(undefined);
  });

  it('should return undefined if interactive is false', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: false,
      dryRun: false,
    } as CollectCommandOptions);
    expect(openReportsProcess).toEqual(undefined);
  });


});

jest.mock('open');
jest.mock('../../../../core/loggin');

describe('openReports', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not open the report if no file name is passed', async () => {
    await openFlowReports([]);
    expect(openReport).not.toHaveBeenCalled();
  });

  it('should not logVerbose if no file name is passed', async () => {
    await openFlowReports([]);
    expect(logVerbose).not.toHaveBeenCalled();
  });

  it('should open the report if filenames includes an html report', async () => {
    await openFlowReports(['example.html']);
    expect(openReport).toHaveBeenCalled();
  });

  it('should logVerbose if filenames includes an html report', async () => {
    await openFlowReports(['example.html']);
    expect(logVerbose).toHaveBeenCalledWith(expect.stringContaining('HTML'));
  });

  it('should open the report if filenames includes a json report', async () => {
    await openFlowReports(['example.json']);
    expect(openReport).toHaveBeenCalled();
  });

  it('should logVerbose if filenames includes an json report', async () => {
    await openFlowReports(['example.json']);
    expect(logVerbose).toHaveBeenCalledWith(expect.stringContaining('JSON'));
  });

  it('should open the report if filenames includes a md report', async () => {
    await openFlowReports(['example.md']);
    expect(openReport).toHaveBeenCalled();
  });

  it('should logVerbose if filenames includes an md report', async () => {
    await openFlowReports(['example.md']);
    expect(logVerbose).toHaveBeenCalledWith(expect.stringContaining('Markdown'));
  });

  it('should only open 1 time report if multiple report formats are passed', async () => {
    await openFlowReports(['example.html', 'example.json', 'example.md']);
    expect(openReport).toHaveBeenCalledTimes(1);
  });

  it('should only logVerbose 1 time report if multiple report formats are passed', async () => {
    await openFlowReports(['example.html', 'example.json', 'example.md']);
    expect(logVerbose).toHaveBeenCalledTimes(1);
  });
});
