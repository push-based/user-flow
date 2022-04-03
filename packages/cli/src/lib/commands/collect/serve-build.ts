import { CollectOptions } from './model';
import { logVerbose } from '../../core/loggin';
import { exec, ExecOptions } from 'child_process';

export async function startServerIfNeeded(options: Pick<CollectOptions, 'startServerCommand'>): Promise<() => any> {
  const { startServerCommand } = options;
  logVerbose('startServerIfNeeded');
  let close: () => any = async () => void 0;
  if (!startServerCommand) {
      new Promise<() => any>((resolve, reject) => {
      const execOptions: ExecOptions = {
        env: {
          ...process.env,
          __USER_FLOW_MODE__: 'SANDBOX'
        }
      };

      const p = exec(
        startServerCommand+'',
        (err, stdout, stderr) => {
          if (err) {
            return reject(err);
          }
          if (stderr) {
            return reject(stderr);
          }
          resolve(() => p.kill());
        }
      );
        close = () => p.kill();
    })

    return close
  }
  return  close;
}
