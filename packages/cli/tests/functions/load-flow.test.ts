import {join} from "path";
import {loadFlow} from "../../src/lib/commands/collect/utils/user-flow";
import {DEFAULT_COLLECT_UF_PATH} from "../../src/lib/commands/collect/options/ufPath.constant";
import {SETUP_SANDBOX_DEFAULT_RC_JSON, SETUP_SANDBOX_NAME} from "../fixtures/setup-sandbox";

const emptyUfPath = join('..', 'sandbox-empty', DEFAULT_COLLECT_UF_PATH);
const invalidUfPath = 'path/does/not/exist';
const validUfPath = join( '..', SETUP_SANDBOX_NAME, SETUP_SANDBOX_DEFAULT_RC_JSON.collect.ufPath);
const dirtyUfPath = join( '..', SETUP_SANDBOX_NAME, './src/lib/dirty-user-flows');
const singleUfPath = join(validUfPath, 'order-coffee.uf.ts');

describe('loading user-flow scripts for execution', () => {

  it('should return flows if files with ts or js are in ufPath', () =>{
    const collectOptions = {url: 'example.com', ufPath: validUfPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2)
  });

  it('should return flows if ufPath points a user-flow file and not a directory', () =>{
    const collectOptions = {url: 'example.com', ufPath: singleUfPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(1)
  });

  it('should return flows if files with ts or js are in ufPath and ignore files with other extensions', () =>{
    const collectOptions = {url: 'example.com', ufPath: dirtyUfPath};
    const userFlows = loadFlow(collectOptions);
    expect(userFlows.length).toBe(2)
  });

  it('should throw ufPath is not a file or directory', () => {
    const collectOptions = {url: 'example.com', ufPath: invalidUfPath};
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`ufPath: ${join(process.cwd(), invalidUfPath)} is no directory`);
  });

  it('should throw if no user flows are in the directory', () => {
    const collectOptions = {url: 'example.com', ufPath: emptyUfPath};
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`No user flows found in ${emptyUfPath}`);
  });

  it('should throw if files in ufPath dont contain UserFlowProvider', () =>{
    const collectOptions = {url: 'example.com', ufPath: emptyUfPath};
    const userFlows = () => loadFlow(collectOptions);
    expect(userFlows).toThrow(`No user flows found in ${emptyUfPath}`);
  });
});

