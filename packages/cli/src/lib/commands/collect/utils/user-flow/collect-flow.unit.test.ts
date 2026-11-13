import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseLaunchOptions } from './collect-flow.js';
import * as cliMode from '../../../../global/cli-mode/cli-mode.js';

vi.mock('../../../../core/loggin/index.js', () => ({ logVerbose: vi.fn() }));

describe('parseLaunchOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should keep the browser visible by default in DEFAULT mode', () => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue('DEFAULT');
    expect(parseLaunchOptions().headless).toBe(false);
  });

  it('should use the default viewport of Puppeteer if no launch options are given', () => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue('DEFAULT');
    expect(parseLaunchOptions().defaultViewport).toBeUndefined();
  });

  it('should use a mobile viewport for a dry run if no launch options are given', () => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue('DEFAULT');
    expect(parseLaunchOptions(undefined, { dryRun: true }).defaultViewport).toEqual({
      isMobile: true,
      isLandscape: false,
      width: 800,
      height: 600,
    });
  });

  it('should keep the given launch options for a dry run', () => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue('DEFAULT');
    expect(parseLaunchOptions({ headless: 'shell' }, { dryRun: true })).toEqual({ headless: 'shell' });
  });

  it('should keep the given launch options in DEFAULT mode', () => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue('DEFAULT');
    expect(parseLaunchOptions({ headless: 'shell' })).toEqual({ headless: 'shell' });
  });

  it.each(['CI', 'SANDBOX'] as const)('should run in new headless mode in %s mode', (mode) => {
    vi.spyOn(cliMode, 'detectCliMode').mockReturnValue(mode);
    expect(parseLaunchOptions().headless).toBe(true);
    expect(parseLaunchOptions({ headless: false }).headless).toBe(true);
  });
});
