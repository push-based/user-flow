import { describe, expect, it } from 'vitest';
import { executeProcess } from '@code-pushup/utils';

describe('user-flow help', () => {
  it('should print global help', async () => {

    const { code, stdout, stderr } = await executeProcess({
      command: 'user-flow',
      args: ['help']
    });

    expect(code).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toMatchSnapshot();
  })
})
