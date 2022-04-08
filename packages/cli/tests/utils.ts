import { ExecOptions } from "child_process";
import * as fs from "fs";
import * as cp from "child_process";
import { UserFlowRcConfig } from '../src/lib';
import * as rimraf from 'rimraf';
import path = require('path');
import {
  DEFAULT_USER_FLOW_RC_JSON, DEFAULT_USER_FLOW_RC_JSON_NAME,
  EMPTY_SANDBOX_PATH, SETUP_SANDBOX_PATH,
  STATIC_USER_FLOW_RC_JSON,
  STATIC_USER_FLOW_RC_JSON_NAME, STATIC_USER_FLOW_SERVE_PORT
} from './fixtures';

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
          reject(`Sandbox directory ${cwd} invalid`);
        }
      } catch (e) {
        reject(`Sandbox directory ${cwd} invalid`);
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

export function resetEmptySandbox(): void {
  const f = path.join(EMPTY_SANDBOX_PATH, DEFAULT_USER_FLOW_RC_JSON_NAME);
  if (fs.existsSync(f)) {
    fs.rmSync(f);
  }
}
