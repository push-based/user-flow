import { describe, expect, it, vi } from 'vitest';
import { Config } from 'lighthouse';
import { isCompleteLhConfig, mergeLhConfig } from './index.js';

vi.mock('../../../../core/loggin');

const completeConfig: Config = {
  artifacts: [{ id: 'Custom', gatherer: 'custom-gatherer' }],
  audits: ['custom-audit'],
  categories: {
    custom: { title: 'Custom', auditRefs: [{ id: 'custom-audit', weight: 1 }] },
  },
};

describe('isCompleteLhConfig', () => {
  it('should be true for a config with artifacts and no extends', () => {
    expect(isCompleteLhConfig(completeConfig)).toBe(true);
  });

  it('should be false for a config that extends another config', () => {
    expect(
      isCompleteLhConfig({ ...completeConfig, extends: 'lighthouse:default' }),
    ).toBe(false);
  });

  it('should be false for a config without artifacts', () => {
    expect(isCompleteLhConfig({ settings: { onlyCategories: ['performance'] } })).toBe(false);
    expect(isCompleteLhConfig()).toBe(false);
  });
});

describe('mergeLhConfig', () => {
  it('should extend the default config if none is given', () => {
    expect(mergeLhConfig()).toStrictEqual({
      extends: 'lighthouse:default',
      settings: {},
    });
  });

  it('should add extends to a config without artifacts', () => {
    expect(
      mergeLhConfig({}, { settings: { onlyCategories: ['performance'] } }),
    ).toStrictEqual({
      extends: 'lighthouse:default',
      settings: { onlyCategories: ['performance'] },
    });
  });

  it('should keep a given extends', () => {
    expect(
      mergeLhConfig({ extends: 'lighthouse:desktop' } as Config, {}),
    ).toStrictEqual({ extends: 'lighthouse:desktop', settings: {} });
  });

  it('should let the flow config override the global config', () => {
    expect(
      mergeLhConfig(
        { settings: { onlyCategories: ['performance'], formFactor: 'mobile' } },
        { settings: { formFactor: 'desktop' } },
      ),
    ).toStrictEqual({
      extends: 'lighthouse:default',
      settings: { onlyCategories: ['performance'], formFactor: 'desktop' },
    });
  });

  it('should not add extends to a complete flow config', () => {
    const cfg = mergeLhConfig({}, completeConfig);
    expect(cfg).toStrictEqual(completeConfig);
    expect(cfg).not.toHaveProperty('extends');
  });

  it('should take only settings from the global config for a complete flow config', () => {
    const cfg = mergeLhConfig(
      {
        extends: 'lighthouse:default',
        audits: ['global-audit'],
        settings: { onlyCategories: ['custom'], formFactor: 'mobile' },
      },
      { ...completeConfig, settings: { formFactor: 'desktop' } },
    );
    expect(cfg).toStrictEqual({
      ...completeConfig,
      settings: { onlyCategories: ['custom'], formFactor: 'desktop' },
    });
    expect(cfg).not.toHaveProperty('extends');
  });
});
