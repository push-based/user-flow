import { join } from 'path';
import { DEFAULT_COLLECT_UF_PATH, DEFAULT_PERSIST_OUT_PATH } from '@push-based/user-flow';
import { loadFlow } from '../../../cli/src/lib/commands/collect/utils/user-flow';
import {
  INITIATED_PRJ_CFG,
  INITIATED_RC_JSON,
  VALIDE_EXAMPLE_USERFLOW_CONTENT,
  VALIDE_EXAMPLE_USERFLOW_NAME,
  WRONG_EXT_USERFLOW_CONTENT,
  WRONG_EXT_USERFLOW_NAME,
  WRONG_MOD_EXPORT_USERFLOW_CONTENT,
  WRONG_MOD_EXPORT_USERFLOW_NAME
} from 'test-data';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowProjectConfig
} from '@push-based/user-flow-cli-testing';


const prjRelativeOutPath = INITIATED_RC_JSON?.persist?.outPath || DEFAULT_PERSIST_OUT_PATH;

// prj.readUserFlow('name.uf.ts') => process.cwd() + sandbox-setup/src/lib/user-flows/name.uf.ts
// prj.readUserFlow('name.uf.ts') => ./sandbox-setup/src/lib/user-flows/name.uf.ts

// ./src/lib/user-flows (from rc.json)
const prjRelativeUfPath = INITIATED_RC_JSON?.collect?.ufPath || DEFAULT_COLLECT_UF_PATH;
const flowValidationCfg: UserFlowProjectConfig = {
  ...INITIATED_PRJ_CFG,
  create: {
    [join(prjRelativeUfPath, VALIDE_EXAMPLE_USERFLOW_NAME)]: VALIDE_EXAMPLE_USERFLOW_CONTENT,
    [join(prjRelativeUfPath, WRONG_EXT_USERFLOW_NAME)]: WRONG_EXT_USERFLOW_CONTENT,
    [join(prjRelativeUfPath, WRONG_MOD_EXPORT_USERFLOW_NAME)]: WRONG_MOD_EXPORT_USERFLOW_CONTENT
  }
};
let initializedPrj: UserFlowCliProject;
let originalCwd = process.cwd();

describe('loading user-flow scripts for execution', () => {
  beforeAll(async () => {
    process.chdir(INITIATED_PRJ_CFG.root);
  });
  beforeEach(async () => {
    process.chdir(flowValidationCfg.root);
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(flowValidationCfg);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });
  afterAll(async () => {
    process.chdir(originalCwd);
  });

  it('should return flows if files with ts or js are in ufPath', async () => {
    let validUfDirPath = prjRelativeUfPath;
    const ufPath = validUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };

    expect(initializedPrj.userFlowPath()).toBe(join(process.cwd(), ufPath));
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2);
  });

  it('should return flows if ufPath points a user-flow file and not a directory', () => {
    let validUfPath = join(prjRelativeUfPath, VALIDE_EXAMPLE_USERFLOW_NAME);
    const ufPath = validUfPath;
    const collectOptions = { url: 'example.com', ufPath };

    expect(initializedPrj.userFlowPath(VALIDE_EXAMPLE_USERFLOW_NAME)).toBe(join(process.cwd(), ufPath));
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(1);
  });

  it('should return flows if files with ts or js are in ufPath and ignore files with other extensions', () => {
    let dirtyUfDirPath = join(prjRelativeUfPath);
    const ufPath = dirtyUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };
    expect(initializedPrj.userFlowPath()).toBe(join(process.cwd(), ufPath));
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2);
  });

  it('should throw if no user flows are in the directory', () => {
    let emptyUfDirPath = join(prjRelativeOutPath);
    const ufPath = emptyUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = () => loadFlow(collectOptions);
    expect(initializedPrj.outputPath()).toBe(join(process.cwd(), ufPath));
    expect(userFlows).toThrow(`No user flows found in ${ufPath}`);
  });
});

