import { concurrently } from 'concurrently';
import { CollectOptions } from '../../../core/rc-json/types';
import { logVerbose } from '../../../core/loggin';
import { Subscription } from 'rxjs';
import { RcJson } from '../../../types';

const log = logVerbose;

// @TODO as it is quite har to maintain and test the serve command we have to think about a better way to wrap it
// I suggest a single function returning a promise.
// This fn takes the serve options as well ans the run block and makes shure execution is done correctly and errors are forwarded too.
// In there we compose easier to test fn's

export async function startServerIfNeededAndExecute(workTargetingServer: () => Promise<any>, collectOption: CollectOptions = {} as CollectOptions): Promise<RcJson> {

  const { serveCommand, awaitServeStdout } = collectOption;

  if (serveCommand && !awaitServeStdout) {
    return Promise.reject(new Error('If a serve command is provided awaitServeStdout is also required'));
  }

  if (!serveCommand || !awaitServeStdout) {
    logVerbose('run user flows without serve command');
    return workTargetingServer();
  }

  logVerbose('execute serve command');
  return new Promise((resolve, reject) => {
    const sub = new Subscription();
    const res = concurrently([serveCommand]);

    const cR = res.commands[0];
    const stopServer = () => {
      logVerbose('stop server');
      cR.kill();
      sub.unsubscribe();
    };
    const endRes = res.result
      // We resolve when the awaited value arrives
      // .then((v) => console.log('concurrently resolve', v))
      .catch(e => {
        reject('Error while executing ' + serveCommand);
      }).finally();


    let isCollecting = false;
    sub.add(cR.stdout.subscribe(
      stdout => {
        const out = stdout.toString();
        log(out);
        // await stdout and start collecting once
        if (out.includes(awaitServeStdout) && !isCollecting) {
          isCollecting = true;
          workTargetingServer()
            .then(resolve)
            .catch(e => {
              reject('Error while running user flows. ' + e);
            }).finally(stopServer);
        }
      }));
  });

}
