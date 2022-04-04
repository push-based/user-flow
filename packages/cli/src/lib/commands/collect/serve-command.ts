import { concurrently } from 'concurrently';
import { CollectOptions } from '../../internal/config/model';

export function startServerIfNeeded(cfg: Pick<CollectOptions, 'serveCommand' | 'awaitServeStdout'>, log: (v: string) => void = (v: string) => void 0): Promise<() => void> {

  return new Promise<() => void>((resolve, reject) => {
    const { serveCommand, awaitServeStdout } = cfg;

    // early exit
    if(!serveCommand) {
      resolve(() => void 0);
      return;
    } else {

      const res = concurrently([serveCommand]);
      const cR = res.commands[0];

      const serveOutputSub = cR.stdout.subscribe(
        stdout => {
          const out = stdout.toString();
          log(out);
          if (awaitServeStdout) {

            if (out.includes(awaitServeStdout)) {
              resolve(() => {
                cR.kill();
                serveOutputSub.unsubscribe();
              });
            }
          } else {
            resolve(() => {
              cR.kill();
              serveOutputSub.unsubscribe();
            });
          }

        });
      serveOutputSub.add(cR.stderr.subscribe(
        stderr => {
          serveOutputSub.unsubscribe();
          reject(stderr.toString());
        }
      ));

    }

  });

}
