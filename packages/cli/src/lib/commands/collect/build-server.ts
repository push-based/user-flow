// ported from: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/fallback-server.js
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import { Express } from 'express';
import * as compression from 'compression';
import { createServer, Server } from 'http';

const IGNORED_FOLDERS_FOR_AUTOFIND = new Set([
  'node_modules',
  'bower_components',
  'jspm_packages',
  'web_modules',
  'tmp'
]);

export class BuildServer {

  private _pathToBuildDir: string;
  private _app: Express;
  private _port: number;
  private _server: undefined | Server;

  constructor(pathToBuildDir: string, isSinglePageApplication: boolean|undefined) {
    this._pathToBuildDir = pathToBuildDir;
    this._app = express();
    this._app.use(compression());
    this._app.use('/', express.static(pathToBuildDir));
    this._app.use('/app', express.static(pathToBuildDir));
    if (isSinglePageApplication) {
      this._app.use('/*', (req, res) => res.sendFile(pathToBuildDir + '/index.html'));
    }
    this._port = 0;

    this._server = undefined;
  }

  get port(): number {
    return this._port;
  }

  listen(): Promise<void> {
    const server = createServer(this._app);
    this._server = server;

    return new Promise((resolve, reject) => {
      server.listen(0, () => {
        const serverAddress = server.address();
        if (typeof serverAddress === 'string' || !serverAddress) {
          return reject(new Error(`Invalid server address "${serverAddress}"`));
        }

        this._port = serverAddress.port;
        resolve(void 0);
      });
    });
  }

  async close(): Promise<void> {
    if (!this._server) return;
    const server = this._server;
    return new Promise((resolve, reject) =>
      server.close(
        (err: Error|undefined) => (err ? reject(err) : resolve(void 0))
      )
    );
  }

  getAvailableUrls(): string[] {
    const htmlFiles = BuildServer.readHtmlFilesInDirectory(this._pathToBuildDir, 2);
    return htmlFiles.map(({ file }) => `http://localhost:${this._port}/${file}`);
  }

  static readHtmlFilesInDirectory(directory: string, depth: number): Array<{ file: string, depth: number }> {
    const filesAndFolders = fs.readdirSync(directory, { withFileTypes: true });

    const files = filesAndFolders.filter(fileOrDir => fileOrDir.isFile()).map(file => file.name);
    const folders = filesAndFolders
      .filter(fileOrDir => fileOrDir.isDirectory())
      .map(dir => dir.name);

    const htmlFiles = files.filter(file => file.endsWith('.html')).map(file => ({ file, depth: 0 }));

    if (depth === 0) return htmlFiles;

    for (const folder of folders) {
      // Don't recurse into hidden folders, things that look like files, or dependency folders
      if (folder.includes('.')) continue;
      if (IGNORED_FOLDERS_FOR_AUTOFIND.has(folder)) continue;

      try {
        const fullPath = path.join(directory, folder);
        if (!fs.statSync(fullPath).isDirectory()) continue;

        htmlFiles.push(
          ...BuildServer.readHtmlFilesInDirectory(fullPath, depth - 1).map(({ file, depth }) => {
            return { file: `${folder}/${file}`, depth: depth + 1 };
          })
        );
      } catch (err) {
      }
    }

    return htmlFiles;
  }
}

