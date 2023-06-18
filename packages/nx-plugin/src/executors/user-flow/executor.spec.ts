import executor from './executor';
import {createTreeWithEmptyWorkspace} from "@nrwl/devkit/testing";
import {normalizeOptions} from "../../generators/target/utils";
import {addProjectConfiguration, getWorkspaceLayout, Tree, writeJson} from "@nrwl/devkit";
import {join} from "path";

const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {
  verbose: true,
  dryRun: true,
  projectName: PROJECT_NAME,
  skipPackageJson: false,
  url: "https://coffee-cart.netlify.app/",
  ufPath: join('./packages', 'nx-plugin', 'user-flows'),
  outputPath: join('./dist', 'user-flows', PROJECT_NAME)
};

describe('Test Executor', () => {
  let appTree: Tree;
  let normalizedOptions;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});

    const projectRoot = `${getWorkspaceLayout(appTree).libsDir}/${PROJECT_NAME}`;
    addProjectConfiguration(
      appTree,
      PROJECT_NAME,
      {
        root: projectRoot,
        projectType: 'library',
        sourceRoot: join(projectRoot, '/src'),
        targets: {
          build: {
            executor: "@push-based/user-flow-nx-plugin:build",
          },
        },
      }
    );
    normalizedOptions = normalizeOptions(appTree, baseOptions);
    writeJson(appTree, join(normalizedOptions.projectRoot, 'user-flows', 'flow.uf.ts'), {});
    writeJson(appTree, join(normalizedOptions.projectRoot, '.user-flowrc.json'), {});
    writeJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), {
      dependencies: {},
      devDependencies: {}
    })
  });

  it('should handle errors', async () => {
    const execResult = await executor({ }, {} as any);
    expect(execResult.success).toBe(false);
  });

  it('can run', async () => {
    const execResult = await executor(baseOptions, {} as any);
    expect(outputContainsConfig(execResult.output, {
      // test alias for outputPath gets derived from outputPath
      outPath: 'dist/user-flows/generated-test'
    })).toBe(true);
    expect(execResult.success).toBe(true);
  })
});

function outputContainsConfig(output: string, config: Record<string, unknown>): boolean {

  Object.entries(config).forEach(([k, v]) => {
    let contains = true;
    switch (k) {
      case 'rcPath':
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'outputPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
      case 'configPath':
        contains = output.includes(`${k}: '${v}'`);
        break;
      case 'config':
        contains = output.includes(`${k}: { `);
        break;
      case 'format':
        // eslint-disable-next-line no-case-declarations
        let values = (v as any[]).map(i => '\'' + i + '\'').join(', ') || '';
        values = values !== '' ? ' ' + values + ' ' : values;
        contains = output.includes(`${k}: [${values}]`);
        break;
      case 'verbose':
      case 'interactive':
      case 'openReport':
      case 'dryRun':
        contains = output.includes(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented for configuration check`);
        break;
    }
    if (!contains) {
      throw new Error(`${k} not present in output ${output}`);
    }
  });
  return true;
}
