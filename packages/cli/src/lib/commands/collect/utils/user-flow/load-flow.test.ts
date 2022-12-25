import { join } from 'path';
import { DEFAULT_COLLECT_UF_PATH } from '../../options/ufPath.constant';
import { loadFlow } from './load-flow';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowProjectConfig
} from '@push-based/user-flow-cli-testing';
import {
  INITIATED_PRJ_CFG,
  VALIDE_EXAMPLE_USERFLOW_CONTENT,
  VALIDE_EXAMPLE_USERFLOW_NAME,
  WRONG_EXT_USERFLOW_CONTENT,
  WRONG_EXT_USERFLOW_NAME,
  WRONG_MOD_EXPORT_USERFLOW_CONTENT,
  WRONG_MOD_EXPORT_USERFLOW_NAME
} from 'test-data';
import { DEFAULT_RC_NAME } from '../../../../constants';
import { DEFAULT_PERSIST_OUT_PATH } from '../../options/outPath.constant';

const rcFile = INITIATED_PRJ_CFG?.rcFile;
const prjRelativeOutPath = join(rcFile ? rcFile[DEFAULT_RC_NAME].persist.outPath : DEFAULT_PERSIST_OUT_PATH);

// prj.readUserFlow('name.uf.ts') => process.cwd() + sandbox-setup/src/lib/user-flows/name.uf.ts
// prj.readUserFlow('name.uf.ts') => ./sandbox-setup/src/lib/user-flows/name.uf.ts

// ./src/lib/user-flows (from rc.json)
const prjRelativeUfPath = join(rcFile ? rcFile[DEFAULT_RC_NAME].collect.ufPath : DEFAULT_COLLECT_UF_PATH);
const flowValidationCfg: UserFlowProjectConfig = {
  ...INITIATED_PRJ_CFG,
  create: {
    [join(prjRelativeUfPath, VALIDE_EXAMPLE_USERFLOW_NAME)]: VALIDE_EXAMPLE_USERFLOW_CONTENT,
    [join(prjRelativeUfPath, WRONG_EXT_USERFLOW_NAME)]: WRONG_EXT_USERFLOW_CONTENT,
    [join(prjRelativeUfPath, WRONG_MOD_EXPORT_USERFLOW_NAME)]: WRONG_MOD_EXPORT_USERFLOW_CONTENT
  }
};
let initializedPrj: UserFlowCliProject;

describe('loading user-flow scripts for execution', () => {
  beforeEach(async () => {
    process.chdir(initializedPrj.root);
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(flowValidationCfg);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should return flows if files with ts or js are in ufPath', () => {
    let validUfDirPath = join(prjRelativeUfPath);
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

  let notExistingUfPath = join(prjRelativeUfPath, 'not-existing.uf.ts');

  // NOTICE: this error was handles by initializing the folder on the fly.
  // Should we consider a log message here?
  /*it('should throw ufPath is not a file or directory', () => {
  let notExistingUfDirPath = join('not-existing');
    const ufPath = notExistingUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`ufPath: ${join(process.cwd(), ufPath)} is no directory`);
  });*/

  it('should throw if no user flows are in the directory', () => {
    let emptyUfDirPath = join(prjRelativeOutPath);
    const ufPath = emptyUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = () => loadFlow(collectOptions);
    expect(initializedPrj.outputPath()).toBe(join(process.cwd(), ufPath));
    expect(userFlows).toThrow(`No user flows found in ${ufPath}`);
  });
});

