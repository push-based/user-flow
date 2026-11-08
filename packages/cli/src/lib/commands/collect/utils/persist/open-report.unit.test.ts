import {vi, describe, expect, beforeEach, it } from 'vitest';
import openReport from 'open';
import { handleOpenFlowReports, openFlowReports } from './open-report.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import { CollectCommandOptions } from '../../options/index.js';

vi.mock('open');
vi.mock('../../../../core/loggin');

describe('handleOpenFlowReport', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should return the openFlowReport function if openReport, interactive and not dryRun', async () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: true,
      dryRun: false,
    } as CollectCommandOptions);
    expect(openReportsProcess).toEqual(expect.any(Function));
  });

  it('should return undefined if openReport is false', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: false,
      interactive: true,
      dryRun: false,
    } as CollectCommandOptions);
    expect(openReportsProcess).toBeUndefined();
  });

  it('should return undefined if dryRun is true', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: true,
      dryRun: true,
    } as CollectCommandOptions);
    expect(openReportsProcess).toBeUndefined();
  });

  it('should return undefined if interactive is false', () => {
    const openReportsProcess = handleOpenFlowReports({
      openReport: true,
      interactive: false,
      dryRun: false,
    } as CollectCommandOptions);
    expect(openReportsProcess).toBeUndefined();
  });
});

describe('openReports', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not open the report if no file name is passed', async () => {
    await openFlowReports([]);
    expect(openReport).not.toHaveBeenCalled();
  });

  it.each(['html', 'json', 'md'])('should open the %s report', async (format) => {
    await openFlowReports([`example.${format}`]);
    expect(openReport).toHaveBeenCalled();
  });

  it('should not logVerbose if no file name is passed', async () => {
    await openFlowReports([]);
    expect(logVerbose).not.toHaveBeenCalled();
  });

  it('should only open 1 time report if multiple report formats are passed', async () => {
    await openFlowReports(['example.html', 'example.json', 'example.md']);
    expect(openReport).toHaveBeenCalledTimes(1);
  });
});
