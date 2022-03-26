import { ExecOptions } from "child_process";
import * as fs from "fs";
import * as cp from "child_process";

export function exec(command: string, cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const execOptions: ExecOptions = {
      env: {
        ...process.env,
        __USER_FLOW_MODE__: 'SANDBOX'
      }
    };

    if (cwd !== undefined) {
      try {
        const isDir = fs.lstatSync(cwd).isDirectory();
        if (!isDir) {
          reject(`Sandbox directory ${cwd} invalide`);
        }
      } catch (e) {
        reject(`Sandbox directory ${cwd} invalide`);
      }
      cwd && (execOptions.cwd = cwd);
    }

    cp.exec(
      command,
      execOptions,
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        if (stderr) {
          return reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
}
