import { UserFlowExecutorSchema } from './schema';
import executor from './executor';

const options: UserFlowExecutorSchema = {

};
describe('Test Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
