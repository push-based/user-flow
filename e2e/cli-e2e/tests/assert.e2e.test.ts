import { describe, expect, it } from 'vitest';
import { executeProcess } from '@code-pushup/utils';

describe.skip('user-flow assert', () => {
  it('should run test', async () => {
    const { code, stdout, stderr } = await executeProcess({
      command: 'echo',
      args: ['value']
    })
    expect(code).toBe(0);
    expect(stdout).toContain('value');
    expect(stderr).toBe('');
    expect('value').toBeTruthy();
  })
})
