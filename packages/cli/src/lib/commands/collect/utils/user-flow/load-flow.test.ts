import { join } from 'path';
import { DEFAULT_COLLECT_UF_PATH } from '../../options/ufPath.constant';
import { loadFlow } from './load-flow';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../../../../../tests/utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { INITIATED_PRJ_CFG } from '../../../../../../tests/fixtures/sandbox/initiated';
import { UserFlowProjectConfig } from '../../../../../../tests/utils/cli-testing/user-flow-cli-project/types';
import {
  VALIDE_EXAMPLE_USERFLOW_CONTENT,
  VALIDE_EXAMPLE_USERFLOW_NAME
} from '../../../../../../tests/fixtures/user-flows/valide.example.uf';
import { DEFAULT_RC_NAME } from '../../../../constants';
import {
  WRONG_EXT_USERFLOW_CONTENT,
  WRONG_EXT_USERFLOW_NAME
} from '../../../../../../tests/fixtures/user-flows/wrong-ext.example.uf';
import {
  WRONG_MOD_EXPORT_USERFLOW_CONTENT,
  WRONG_MOD_EXPORT_USERFLOW_NAME
} from '../../../../../../tests/fixtures/user-flows/wrong-mod-export.example.uf';
import { DEFAULT_PERSIST_OUT_PATH } from '../../options/outPath.constant';


const rcFile = INITIATED_PRJ_CFG?.rcFile;
const outPath = join(rcFile ? rcFile[DEFAULT_RC_NAME].persist.outPath : DEFAULT_PERSIST_OUT_PATH);
const ufPath = join(rcFile ? rcFile[DEFAULT_RC_NAME].collect.ufPath : DEFAULT_COLLECT_UF_PATH);
const flowValidationCfg: UserFlowProjectConfig = {
  ...INITIATED_PRJ_CFG,
  root: join('..', 'sandbox-setup'),
  create: {
    [join(ufPath, VALIDE_EXAMPLE_USERFLOW_NAME)]: VALIDE_EXAMPLE_USERFLOW_CONTENT,
    [join(ufPath, WRONG_EXT_USERFLOW_NAME)]: WRONG_EXT_USERFLOW_CONTENT,
    [join(ufPath, WRONG_MOD_EXPORT_USERFLOW_NAME)]: WRONG_MOD_EXPORT_USERFLOW_CONTENT
  }
};
let initializedPrj: UserFlowCliProject;

let emptyUfDirPath = join(outPath);
let dirtyUfDirPath = join(ufPath);
let notExistingUfDirPath = join('not-existing');
let notExistingUfPath = join(ufPath, 'not-existing.uf.ts');
let validUfDirPath = join(ufPath);
let validUfPath = join(validUfDirPath, VALIDE_EXAMPLE_USERFLOW_NAME);

function normalizePathForCi(path: string): string {
  if (process.cwd().includes('packages')) {
    return path;
  }
  return join('packages/cli', path);
}

describe('loading user-flow scripts for execution', () => {
  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(flowValidationCfg);
    }
    await initializedPrj.setup();
  });
  afterEach(async () => {
    await initializedPrj.teardown();
  });

  it('should return flows if files with ts or js are in ufPath', () => {
    const ufPath = validUfDirPath;
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2);
  });

  it('should return flows if ufPath points a user-flow file and not a directory', () => {
    const ufPath = normalizePathForCi(validUfPath);
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(1);
  });

  it('should return flows if files with ts or js are in ufPath and ignore files with other extensions', () => {
    const ufPath = normalizePathForCi(dirtyUfDirPath);
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2);
  });

  // NOTICE: this error was handles by initializing the folder on the fly.
  // Should we consider a log message here?
  /*it('should throw ufPath is not a file or directory', () => {
    const ufPath = normalizePathForCi(notExistingUfDirPath);
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`ufPath: ${join(process.cwd(), ufPath)} is no directory`);
  });*/

  it('should throw if no user flows are in the directory', () => {
    const ufPath = normalizePathForCi(emptyUfDirPath);
    const collectOptions = { url: 'example.com', ufPath };
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`No user flows found in ${ufPath}`);
  });
});

