import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { handleGhWorkflowGeneration } from './generate-workflow.js';
import { fileURLToPath } from 'node:url';

const PATH_TO_REPO_ROOT = '../../../../../../..';
const _dirname = dirname(fileURLToPath(import.meta.url));
const expectedFilePath = join(_dirname, PATH_TO_REPO_ROOT, '.github', 'workflows','user-flow-ci.yml');

describe('generate GH workflow', () => {

  it('should create flow when --generateGhWorkflow is used',  async () => {
    expect(existsSync(expectedFilePath)).toBe(false);
    await handleGhWorkflowGeneration({generateGhWorkflow: true})({} as any);
    expect(existsSync(expectedFilePath)).toBe(true);
    rmSync(expectedFilePath);
  });

  it('should not create flow when --no-generateGhWorkflow is used', async () => {
    expect(existsSync(expectedFilePath)).toBe(false);
    await handleGhWorkflowGeneration({generateGhWorkflow: false})({} as any);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  });

});
