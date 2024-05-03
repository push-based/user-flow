import { describe, expect, it } from 'vitest';
import { toFileName } from './to-file-name.js';

describe('toFileName', () => {

  it('should escape a URL', () => {
    const url = 'www.test.com';
    const httpUrl = 'http://www.test.com';
    const httpsUrl = 'https://www.test.com';
    expect(toFileName(url)).toEqual(url);
    expect(toFileName(httpUrl)).toEqual(url);
    expect(toFileName(httpsUrl)).toEqual(url);
  });

  it('should escape a URL and port', () => {
    const url = 'www.test.com';
    const urlAndPort = `https://${url}:4200`;
    expect(toFileName(urlAndPort)).toEqual(url + '-' + 4200);
  });


  it('should escape a folder name', () => {
    const folder = 'my-folder-name';
    const folder2 = 'myFolderName';
    const folder3 = 'my folder name';
    const folder4 = 'my Folder Name';
    expect(toFileName(folder)).toEqual(folder);
    expect(toFileName(folder2)).toEqual(folder);
    expect(toFileName(folder3)).toEqual(folder);
    expect(toFileName(folder4)).toEqual(folder);
  });

});
