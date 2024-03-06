import { handleOpenFlowReports, openFlowReports } from './open-report';
import { logVerbose } from '../../../../core/loggin';
import * as openReport from 'open';

import * as dryRun from '../../../../commands/collect/options/dryRun';
import * as interactive from '../../../../global/options/interactive';

jest.mock('../../../../commands/collect/options/dryRun');
jest.mock('../../../../global/options/interactive');

describe('handleOpenFlowReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return undefined if openReport is false', () => {
    const openReportsProcess = handleOpenFlowReports(false);
    expect(openReportsProcess).toEqual(undefined);
  });

  it('should return undefined if dryRun is true', () => {
    jest.spyOn(dryRun, 'get').mockReturnValue(true);
    const openReportsProcess = handleOpenFlowReports(true);
    expect(openReportsProcess).toEqual(undefined);
  });

  it('should return undefined if interactive is false', () => {
    jest.spyOn(interactive, 'get').mockReturnValue(false);
    const openReportsProcess = handleOpenFlowReports(true);
    expect(openReportsProcess).toEqual(undefined);
  });

  it('should return the openFlowReport function if openReport, interactive and not dryRun', async () => {
    jest.spyOn(interactive, 'get').mockReturnValue(true);
    jest.spyOn(dryRun, 'get').mockReturnValue(false);
    const openReportsProcess = handleOpenFlowReports(true);
    expect(typeof openReportsProcess).toEqual("function");
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
