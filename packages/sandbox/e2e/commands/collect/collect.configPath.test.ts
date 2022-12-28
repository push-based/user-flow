import {
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowProjectConfig
} from '@push-based/user-flow-cli-testing';
import { STATIC_PRJ_CFG } from 'test-data';
import { STATIC_JSON_REPORT_NAME, STATIC_RC_JSON } from 'test-data';
import { DEFAULT_RC_NAME } from '@push-based/user-flow';
import {
  expectCollectCfgToContain,
  expectConfigPathUsageLog,
  expectNoConfigFileExistLog,
  expectResultsToIncludeConfig
} from '../../jest';
import { LH_CONFIG, LH_CONFIG_NAME } from 'test-data';

let staticPrj: UserFlowCliProject;

describe('$collect() sandbox+NO-assets with RC()', () => {
  beforeEach(async () => {
    if (!staticPrj) {
      staticPrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
    }
    await staticPrj.setup();
  });
  afterEach(async () => await staticPrj.teardown());

  it('should NOT log configPath info', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect();

    expect(stderr).toBe('');
    expectNoConfigFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

});

let staticWConfigAssetsPrj: UserFlowCliProject;
let staticWConfigPathPrjCfg: UserFlowProjectConfig = {
  ...STATIC_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: {
      ...STATIC_RC_JSON,
      collect: {
        ...STATIC_RC_JSON.collect,
        configPath: LH_CONFIG_NAME
      }
    }
  },
  create: {
    ...STATIC_PRJ_CFG.create,
    [LH_CONFIG_NAME]: LH_CONFIG
  },
  delete: [LH_CONFIG_NAME].concat(STATIC_PRJ_CFG?.delete || [])
};

describe('$collect() sandbox+assets with RC({configPath}))', () => {
  beforeEach(async () => {
    if (!staticWConfigAssetsPrj) {
      staticWConfigAssetsPrj = await UserFlowCliProjectFactory.create(staticWConfigPathPrjCfg);
    }
    await staticWConfigAssetsPrj.setup();
  });
 afterEach(async () => await staticWConfigAssetsPrj.teardown());

  it('should load configPath from RC file', async () => {
    const { exitCode, stdout, stderr } = await staticWConfigAssetsPrj.$collect({
      configPath: LH_CONFIG_NAME
    });


    expect(stderr).toBe('');
    expectCollectCfgToContain(stdout, {configPath: LH_CONFIG_NAME})
    expectConfigPathUsageLog(stdout, LH_CONFIG_NAME);
    expectResultsToIncludeConfig(staticWConfigAssetsPrj, STATIC_JSON_REPORT_NAME.split('.json').pop()+'');
    expect(exitCode).toBe(0);

  }, 60_000);

});
