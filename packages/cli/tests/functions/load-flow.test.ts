import {join} from "path";
import {DEFAULT_COLLECT_UF_PATH} from "../../src/lib/commands/collect/options/ufPath.constant";
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_NAME
} from '../fixtures/setup-sandbox';
// Import cannot be shortened do to jest import puppeteer-core error
import { loadFlow } from '../../src/lib/commands/collect/utils/user-flow/load-flow';
import { resetEmptySandbox } from '../fixtures/empty-sandbox';

const emptyUfPath = join('..', 'sandbox-empty', DEFAULT_COLLECT_UF_PATH);
const invalidUfPath = 'path/does/not/exist';
const validUfPath = join( '..', SETUP_SANDBOX_NAME, SETUP_SANDBOX_DEFAULT_RC_JSON.collect.ufPath);
const dirtyUfPath = join( '..', SETUP_SANDBOX_NAME, './src/lib/dirty-user-flows');
const singleUfPath = join(validUfPath, 'order-coffee.uf.ts');

function normalizePathForCi(path: string): string {
  if (process.cwd().includes('packages')) {
    return path;
  }
  return join('packages/cli', path);
}

class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError|NoErrorThrownError> => {
  try {
    await call();

    return new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

describe('loading user-flow scripts for execution', () => {

  beforeAll(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

  it('should return flows if files with ts or js are in ufPath', () =>{
    const ufPath = normalizePathForCi(validUfPath);
    const collectOptions = {url: 'example.com', ufPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2)
  });

  it('should return flows if ufPath points a user-flow file and not a directory', () =>{
    const ufPath = normalizePathForCi(singleUfPath)
    const collectOptions = {url: 'example.com', ufPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(1)
  });

  it('should return flows if files with ts or js are in ufPath and ignore files with other extensions', () =>{
    const ufPath = normalizePathForCi(dirtyUfPath)
    const collectOptions = {url: 'example.com', ufPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2)
  });

  it('should throw ufPath is not a file or directory', async () => {
    const ufPath = normalizePathForCi(invalidUfPath);
    const collectOptions = {url: 'example.com', ufPath};
    const error = await getError(async () => loadFlow(collectOptions));
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect((error as Error).message).toBe(`ufPath: ${join(process.cwd(), ufPath)} does not exist.`);
  });

  it('should throw if no user flows are in the directory', async () => {
    const ufPath = normalizePathForCi(emptyUfPath)
    const collectOptions = {url: 'example.com', ufPath};
    const error = await getError(async () => loadFlow(collectOptions));
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect((error as Error).message).toBe(`No user flows found in ${ufPath}.`);
  });
});

